"use server";

import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Operadora {
  id: number;
  nome: string;
  logo_url: string | null;
  planosCount?: number;
}

export interface Plano {
  id: number;
  operadoraId: number;
  nome: string;
  tipoContratacao: "ADESAO" | "CNPJ";
  segmentacao: "AMBULATORIAL" | "HOSPITALAR" | "GLOBAL";
  abrangencia: "REGIONAL" | "NACIONAL";
  beneficios: string | null;
  coparticipacao: boolean;
  cidades: string | null;
  carenciaUrgencia: number;
  carenciaConsultas: number;
  carenciaExamesSimples: number;
  carenciaAltaComplexidade: number;
  carenciaPreexistencias: number;
}

export interface Precos {
  id?: number;
  planoId: number;
  faixa0a18: number;
  faixa19a23: number;
  faixa24a28: number;
  faixa29a33: number;
  faixa34a38: number;
  faixa39a43: number;
  faixa44a48: number;
  faixa49a53: number;
  faixa54a58: number;
  faixa59mais: number;
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
    return { error: "Acesso restrito. Apenas administradores podem acessar as configurações de planos." };
  }

  return { session };
}

export async function getOperadorasWithPlansCountAction() {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const operadoras = await query<Operadora>(`
      SELECT o.id, o.nome, o.logo_url, COUNT(p.id)::int as "planosCount"
      FROM operadoras o
      LEFT JOIN planos p ON o.id = p."operadoraId"
      GROUP BY o.id, o.nome, o.logo_url
      ORDER BY o.nome ASC
    `);

    return { data: operadoras };
  } catch (error: any) {
    console.error("Error in getOperadorasAction:", error);
    return { error: error.message || "Erro ao buscar marcas operadoras" };
  }
}

export async function getPlanosForOperadoraAction(operadoraId: number) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const planos = await query<Plano>(
      `SELECT * FROM planos 
       WHERE "operadoraId" = $1 
       ORDER BY nome ASC`,
      [operadoraId]
    );

    return { data: planos };
  } catch (error: any) {
    console.error("Error in getPlanosForOperadoraAction:", error);
    return { error: error.message || "Erro ao buscar planos da operadora" };
  }
}

export async function getPlanoDetailsAction(planoId: number) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const planoRes = await query<Plano>(
      `SELECT * FROM planos WHERE id = $1`,
      [planoId]
    );

    if (planoRes.length === 0) {
      return { error: "Plano não encontrado" };
    }

    const precosRes = await query<Precos>(
      `SELECT * FROM precos WHERE "planoId" = $1`,
      [planoId]
    );

    return {
      plano: planoRes[0],
      precos: precosRes[0] || null,
    };
  } catch (error: any) {
    console.error("Error in getPlanoDetailsAction:", error);
    return { error: error.message || "Erro ao carregar detalhes do plano" };
  }
}

export async function savePlanoAction(
  planoData: Omit<Plano, "id"> & { id?: number },
  precosData: Omit<Precos, "id" | "planoId">
) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    const {
      id,
      operadoraId,
      nome,
      tipoContratacao,
      segmentacao,
      abrangencia,
      beneficios,
      coparticipacao,
      cidades,
      carenciaUrgencia,
      carenciaConsultas,
      carenciaExamesSimples,
      carenciaAltaComplexidade,
      carenciaPreexistencias,
    } = planoData;

    let planoId = id;

    if (id) {
      // 1. Update existing plan
      await query(
        `UPDATE planos 
         SET nome = $1, "tipoContratacao" = $2, segmentacao = $3, abrangencia = $4, beneficios = $5,
             coparticipacao = $6, cidades = $7, "carenciaUrgencia" = $8, "carenciaConsultas" = $9, 
             "carenciaExamesSimples" = $10, "carenciaAltaComplexidade" = $11, "carenciaPreexistencias" = $12
         WHERE id = $13`,
        [
          nome,
          tipoContratacao,
          segmentacao,
          abrangencia,
          beneficios,
          coparticipacao,
          cidades,
          carenciaUrgencia,
          carenciaConsultas,
          carenciaExamesSimples,
          carenciaAltaComplexidade,
          carenciaPreexistencias,
          id,
        ]
      );

      // 2. Update prices
      await query(
        `UPDATE precos
         SET "faixa0a18" = $1, "faixa19a23" = $2, "faixa24a28" = $3, "faixa29a33" = $4, "faixa34a38" = $5,
             "faixa39a43" = $6, "faixa44a48" = $7, "faixa49a53" = $8, "faixa54a58" = $9, "faixa59mais" = $10
         WHERE "planoId" = $11`,
        [
          precosData.faixa0a18,
          precosData.faixa19a23,
          precosData.faixa24a28,
          precosData.faixa29a33,
          precosData.faixa34a38,
          precosData.faixa39a43,
          precosData.faixa44a48,
          precosData.faixa49a53,
          precosData.faixa54a58,
          precosData.faixa59mais,
          id,
        ]
      );
    } else {
      // 1. Create new plan
      const insertPlanoRes = await query<{ id: number }>(
        `INSERT INTO planos ("operadoraId", nome, "tipoContratacao", segmentacao, abrangencia, beneficios, 
                              coparticipacao, cidades, "carenciaUrgencia", "carenciaConsultas", 
                              "carenciaExamesSimples", "carenciaAltaComplexidade", "carenciaPreexistencias")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING id`,
        [
          operadoraId,
          nome,
          tipoContratacao,
          segmentacao,
          abrangencia,
          beneficios,
          coparticipacao,
          cidades,
          carenciaUrgencia,
          carenciaConsultas,
          carenciaExamesSimples,
          carenciaAltaComplexidade,
          carenciaPreexistencias,
        ]
      );
      planoId = insertPlanoRes[0].id;

      // 2. Create prices
      await query(
        `INSERT INTO precos ("planoId", "faixa0a18", "faixa19a23", "faixa24a28", "faixa29a33", "faixa34a38",
                              "faixa39a43", "faixa44a48", "faixa49a53", "faixa54a58", "faixa59mais")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          planoId,
          precosData.faixa0a18,
          precosData.faixa19a23,
          precosData.faixa24a28,
          precosData.faixa29a33,
          precosData.faixa34a38,
          precosData.faixa39a43,
          precosData.faixa44a48,
          precosData.faixa49a53,
          precosData.faixa54a58,
          precosData.faixa59mais,
        ]
      );
    }

    revalidatePath("/planos");
    return { success: true, planoId };
  } catch (error: any) {
    console.error("Error in savePlanoAction:", error);
    return { error: error.message || "Erro ao salvar informações do plano" };
  }
}

export async function createOperadoraAction(nome: string, logoUrl: string | null) {
  try {
    const authCheck = await checkAdminSession();
    if (authCheck.error) {
      return { error: authCheck.error };
    }

    if (!nome) {
      return { error: "O nome da operadora é obrigatório." };
    }

    await query(
      `INSERT INTO operadoras (nome, logo_url) 
       VALUES ($1, $2)`,
      [nome, logoUrl]
    );

    revalidatePath("/planos");
    return { success: true };
  } catch (error: any) {
    console.error("Error in createOperadoraAction:", error);
    if (error.code === "23505") {
      return { error: "Esta operadora já está cadastrada." };
    }
    return { error: error.message || "Erro ao cadastrar operadora." };
  }
}
