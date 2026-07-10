-- Adiciona colunas de UTM tracking na tabela leads
-- para rastrear origem dos leads vindos da Landing Page

ALTER TABLE leads ADD COLUMN IF NOT EXISTS "utmSource" VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "utmMedium" VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "utmCampaign" VARCHAR(255);
