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
  utm_content: string | null;
  idades?: string | null;
};

// Meta Ads Lead Forms: flat key-value pairs with "lead_id", "full_name", "phone_number", etc.
function normalizeMetaPayload(payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;
  // Meta sends field values as top-level keys or nested in "lead_gen_id"
  const nome = p.full_name || p.nome || p.name || p["First Name"]
    ? `${p["First Name"] || ""} ${p["Last Name"] || ""}`.trim() || p.full_name || p.nome || p.name || ""
    : "";
  const phone = p.phone_number || p.whatsapp || p.telefone || p["Phone Number"] || p["Mobile Number"] || "";
  const perfil = p.perfil_interesse || p.perfil || p.plan_type || p["Qual plano te interessa?"] || "Adesão";

  return {
    nome,
    whatsapp: sanitizePhone(phone),
    perfil,
    utm_source: p.utm_source || p.utmSource || "meta_ads",
    utm_medium: p.utm_medium || p.utmMedium || "lead_form",
    utm_campaign: p.utm_campaign || p.utmCampaign || p.adset_name || null,
    utm_content: p.utm_content || p.ad_name || null,
    idades: p.idades || p["Quantas vidas?"] || null,
  };
}

// Google Ads Lead Forms: sends via Lead Form Webhook integration
function normalizeGooglePayload(payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;
  // Google sends a "user_column_data" array with field_id/value pairs
  const fields: Record<string, string> = {};
  if (Array.isArray(p.user_column_data)) {
    for (const f of p.user_column_data) {
      fields[f.column_id || f.field_id || ""] = f.string_value || f.value || "";
    }
  }

  const nome = fields["CONSENT_1"] || fields["1"] || p.full_name || p.nome || "";
  const phone = fields["CONSENT_2"] || fields["2"] || p.phone || p.whatsapp || "";

  return {
    nome,
    whatsapp: sanitizePhone(phone),
    perfil: p.perfil_interesse || "Adesão",
    utm_source: p.utm_source || "google_ads",
    utm_medium: p.utm_medium || "lead_form",
    utm_campaign: p.campaign_id || p.utm_campaign || null,
    utm_content: p.adgroup_id || null,
    idades: p.idades || null,
  };
}

// TikTok Ads Lead Forms: sends via TikTok Lead Gen Webhook
function normalizeTikTokPayload(payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;
  // TikTok wraps in "form" object with field_name/field_value pairs
  const fields: Record<string, string> = {};
  const form = p.form || p;
  if (Array.isArray(form.fields)) {
    for (const f of form.fields) {
      fields[f.field_name || ""] = Array.isArray(f.field_value)
        ? f.field_value.join(", ")
        : f.field_value || "";
    }
  }

  const nome = fields["full_name"] || fields["name"] || p.full_name || p.nome || "";
  const phone = fields["phone_number"] || fields["phone"] || p.phone || "";

  return {
    nome,
    whatsapp: sanitizePhone(phone),
    perfil: fields["qual_plano"] || p.perfil_interesse || "Adesão",
    utm_source: p.utm_source || "tiktok_ads",
    utm_medium: p.utm_medium || "lead_form",
    utm_campaign: p.utm_campaign || p.campaign_name || null,
    utm_content: p.ad_name || null,
    idades: fields["quantas_vidas"] || p.idades || null,
  };
}

// Generic fallback: reads any flat key-value payload
function normalizeGeneric(payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;
  return {
    nome: p.nome || p.name || p.full_name || "",
    whatsapp: sanitizePhone(p.whatsapp || p.phone || p.telefone || ""),
    perfil: p.perfil_interesse || p.perfil || p.plan_type || "Adesão",
    utm_source: p.utm_source || null,
    utm_medium: p.utm_medium || null,
    utm_campaign: p.utm_campaign || null,
    utm_content: p.utm_content || null,
    idades: p.idades || null,
  };
}

function detectAndNormalize(source: string | null, payload: Record<string, unknown>): NormalizedLead {
  const p = payload as any;

  // If source is explicitly provided, use it
  if (source === "meta" || source === "facebook" || source === "instagram") {
    return normalizeMetaPayload(payload);
  }
  if (source === "google") {
    return normalizeGooglePayload(payload);
  }
  if (source === "tiktok") {
    return normalizeTikTokPayload(payload);
  }

  // Auto-detect based on payload structure
  if (Array.isArray(p.user_column_data)) {
    return normalizeGooglePayload(payload);
  }
  if (p.form && Array.isArray(p.form.fields)) {
    return normalizeTikTokPayload(payload);
  }
  if (p.full_name || p.phone_number || p.adset_name) {
    return normalizeMetaPayload(payload);
  }

  return normalizeGeneric(payload);
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const source = searchParams.get("source"); // Optional: "meta" | "google" | "tiktok"

    if (!token || token !== process.env.WEBHOOK_SECRET_TOKEN) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload: Record<string, unknown> = await request.json();
    const lead = detectAndNormalize(source, payload);

    if (!lead.nome || lead.nome.length < 2) {
      console.warn("[webhook/leads] Invalid lead - nome missing:", JSON.stringify(payload).slice(0, 200));
      return NextResponse.json(
        { success: false, error: "Invalid payload: nome is required" },
        { status: 400 }
      );
    }
    if (!lead.whatsapp || lead.whatsapp.length < 8) {
      console.warn("[webhook/leads] Invalid lead - whatsapp missing:", JSON.stringify(payload).slice(0, 200));
      return NextResponse.json(
        { success: false, error: "Invalid payload: whatsapp is required" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO leads (nome, whatsapp, perfil, idades, status, "utmSource", "utmMedium", "utmCampaign", "utmContent")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        lead.nome,
        lead.whatsapp,
        lead.perfil,
        lead.idades || null,
        "Aguardando",
        lead.utm_source,
        lead.utm_medium,
        lead.utm_campaign,
        lead.utm_content,
      ]
    );

    console.log(`[webhook/leads] Lead inserted: ${lead.nome} (${lead.whatsapp}) via ${lead.utm_source || "unknown"}`);
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
