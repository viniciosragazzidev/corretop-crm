import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

function sanitizePhone(raw: string): string {
  return raw.replace(/[\s\-\(\)\.\+]/g, "").replace(/^55/, "");
}

type NormalizedLead = {
  nome: string;
  whatsapp: string;
  perfil: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  idades?: string | null;
};

function normalizeGeneric(payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;
  return {
    nome: p.nome || p.name || p.full_name || "",
    whatsapp: sanitizePhone(p.whatsapp || p.phone || p.telefone || ""),
    perfil: p.perfil_interesse || p.perfil || p.plan_type || "Adesão",
    utm_source: p.utm_source || null,
    utm_medium: p.utm_medium || null,
    utm_campaign: p.utm_campaign || null,
    idades: p.idades || null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || token !== process.env.WEBHOOK_SECRET_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: Record<string, unknown> = await request.json();
    const lead = normalizeGeneric(payload);

    if (!lead.nome || lead.nome.length < 2) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: nome is required" },
        { status: 400 }
      );
    }
    if (!lead.whatsapp || lead.whatsapp.length < 8) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: whatsapp is required" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO leads (nome, whatsapp, perfil, idades, status, "utmSource", "utmMedium", "utmCampaign")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        lead.nome,
        lead.whatsapp,
        lead.perfil,
        lead.idades || null,
        "Aguardando",
        lead.utm_source,
        lead.utm_medium,
        lead.utm_campaign,
      ]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("[webhook/leads] Error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
