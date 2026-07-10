"use server";

import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ClientLead {
  id: number;
  nome: string;
  whatsapp: string;
  perfil: string;
  idades: string;
  status: "Aguardando" | "Em Atendimento" | "Proposta Enviada" | "Venda Concluída";
  corretorId: string | null;
  corretorNome?: string;
}

export async function getClientsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Não autenticado." };
    }

    const role = (session.user as any).role;
    const userId = session.user.id;

    if (role === "ADMIN") {
      // Admin sees all inbound leads (Aguardando)
      const leads = await query<ClientLead>(`
        SELECT * FROM leads 
        WHERE status = 'Aguardando' 
        ORDER BY id DESC
      `);

      // Admin sees all qualified clients, joined with their broker names
      const clients = await query<ClientLead>(`
        SELECT l.*, u.name as "corretorNome"
        FROM leads l
        LEFT JOIN "user" u ON l."corretorId" = u.id
        WHERE l.status != 'Aguardando'
        ORDER BY l.id DESC
      `);

      return { data: { leads, clients } };
    } else {
      // Broker sees all inbound leads to claim them
      const leads = await query<ClientLead>(`
        SELECT * FROM leads 
        WHERE status = 'Aguardando' 
        ORDER BY id DESC
      `);

      // Broker sees only their claimed clients
      const clients = await query<ClientLead>(`
        SELECT * FROM leads 
        WHERE status != 'Aguardando' AND "corretorId" = $1
        ORDER BY id DESC
      `, [userId]);

      return { data: { leads, clients } };
    }
  } catch (error: any) {
    console.error("Error in getClientsAction:", error);
    return { error: error.message || "Erro ao buscar pipeline de clientes." };
  }
}

export async function startAttendanceAction(clientId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Não autenticado." };
    }

    const userId = session.user.id;

    // Check if the lead is still available
    const checkLead = await query(`
      SELECT status, "corretorId" FROM leads WHERE id = $1
    `, [clientId]);

    if (checkLead.length === 0) {
      return { error: "Registro não encontrado." };
    }

    if (checkLead[0].status !== "Aguardando") {
      return { error: "Este lead já foi assumido por outro corretor." };
    }

    // Assign to corretor and update status to 'Em Atendimento'
    await query(`
      UPDATE leads 
      SET status = 'Em Atendimento', "corretorId" = $1 
      WHERE id = $2
    `, [userId, clientId]);

    revalidatePath("/crm/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Error in startAttendanceAction:", error);
    return { error: error.message || "Erro ao iniciar atendimento." };
  }
}

export async function updateClientStatusAction(
  clientId: number,
  status: "Em Atendimento" | "Proposta Enviada" | "Venda Concluída"
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Não autenticado." };
    }

    const role = (session.user as any).role;
    const userId = session.user.id;

    // Verify ownership or admin rights
    const checkLead = await query(`
      SELECT "corretorId" FROM leads WHERE id = $1
    `, [clientId]);

    if (checkLead.length === 0) {
      return { error: "Cliente não encontrado." };
    }

    if (role !== "ADMIN" && checkLead[0].corretorId !== userId) {
      return { error: "Não autorizado. Este cliente pertence a outro corretor." };
    }

    // Update status
    await query(`
      UPDATE leads 
      SET status = $1 
      WHERE id = $2
    `, [status, clientId]);

    revalidatePath("/crm/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateClientStatusAction:", error);
    return { error: error.message || "Erro ao atualizar status do cliente." };
  }
}

export interface CreateLeadInput {
  nome: string;
  whatsapp: string;
  perfil: string;
  idades: string;
}

export async function createLeadAction(input: CreateLeadInput) {
  try {
    const { nome, whatsapp, perfil, idades } = input;

    if (!nome || !whatsapp) {
      return { error: "Nome e WhatsApp são obrigatórios" };
    }

    // Clean whatsapp number to store only digits
    const cleanedWhatsapp = whatsapp.replace(/\D/g, "");

    await query(
      `INSERT INTO leads (nome, whatsapp, perfil, idades, status)
       VALUES ($1, $2, $3, $4, 'Aguardando')`,
      [nome, cleanedWhatsapp, perfil, idades]
    );

    revalidatePath("/crm/clients");
    return { success: true };
  } catch (error: any) {
    console.error("Error in createLeadAction:", error);
    return { error: error.message || "Erro ao registrar cliente" };
  }
}
