-- Adiciona coluna de UTM content para rastrear anúncio específico
-- Execute depois da migration 003

ALTER TABLE leads ADD COLUMN IF NOT EXISTS "utmContent" VARCHAR(255);
