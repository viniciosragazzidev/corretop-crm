"use server";

import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Corretor {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CORRETOR";
  status: "ONLINE" | "PAUSADO" | "INATIVO";
}

// Helper to check if the current user is an Admin
async function checkAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Não autenticado" };
  }

  const role = (session.user as any).role;
  if (role !== "ADMIN") {
    return { error: "Acesso não autorizado. Apenas administradores podem gerenciar a equipe." };
  }

  return { session };
}

export async function getCorretoresAction() {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const corretores = await query<Corretor>(`
      SELECT id, name, email, role, status 
      FROM "user" 
      ORDER BY name ASC
    `);

    return { data: corretores };
  } catch (error: any) {
    console.error("Error in getCorretoresAction:", error);
    return { error: error.message || "Erro ao buscar equipe de corretores" };
  }
}

export interface CreateCorretorInput {
  name: string;
  email: string;
  passwordHash: string; // password from UI form
  role: "ADMIN" | "CORRETOR";
}

export async function createCorretorAction(input: CreateCorretorInput) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const { name, email, passwordHash: password } = input;

    if (!name || !email || !password) {
      return { error: "Nome, e-mail e senha são obrigatórios." };
    }

    if (password.length < 6) {
      return { error: "A senha inicial deve ter pelo menos 6 caracteres." };
    }

    // Call better-auth's API to sign up the new user
    // Note: Since this is executed server-to-server, it registers the user securely
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return { error: "Falha ao cadastrar credenciais de login." };
    }

    const newUserId = signUpResult.user.id;

    // Update their role and default status (ONLINE) in the user table
    await query(`
      UPDATE "user" 
      SET role = $1, status = $2 
      WHERE id = $3
    `, [input.role, "ONLINE", newUserId]);

    revalidatePath("/corretores");
    return { success: true };
  } catch (error: any) {
    console.error("Error in createCorretorAction:", error);
    // User-friendly error mapping for duplicate emails
    if (error.message?.includes("already exists") || error.code === "23505") {
      return { error: "Este endereço de e-mail já está cadastrado no sistema." };
    }
    return { error: error.message || "Erro ao cadastrar corretor." };
  }
}

export async function updateCorretorStatusAction(
  corretorId: string,
  status: "ONLINE" | "PAUSADO" | "INATIVO"
) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    // Update the corretor status
    await query(`
      UPDATE "user" 
      SET status = $1 
      WHERE id = $2
    `, [status, corretorId]);

    revalidatePath("/corretores");
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateCorretorStatusAction:", error);
    return { error: error.message || "Erro ao atualizar status." };
  }
}

export async function desativarCorretorAction(corretorId: string) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const currentUserId = authCheck.session?.user.id;
    if (corretorId === currentUserId) {
      return { error: "Você não pode desativar seu próprio usuário administrador." };
    }

    // Set status to INATIVO
    await query(`
      UPDATE "user" 
      SET status = 'INATIVO' 
      WHERE id = $1
    `, [corretorId]);

    revalidatePath("/corretores");
    return { success: true };
  } catch (error: any) {
    console.error("Error in desativarCorretorAction:", error);
    return { error: error.message || "Erro ao desativar corretor." };
  }
}
