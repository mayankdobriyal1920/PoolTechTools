-- Migration: 001_create_licensing_schema.sql
-- See PoolTechTools spec Section 14 for full details.

CREATE TABLE IF NOT EXISTS processed_webhook_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'received',
    error_classification VARCHAR(100),
    CONSTRAINT chk_processing_status CHECK (processing_status IN ('received','processing','processed','failed','skipped'))
);

CREATE TABLE IF NOT EXISTS licenses (
    license_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key_hash VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    paddle_transaction_id VARCHAR(255) UNIQUE NOT NULL,
    paddle_customer_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    amount_cents INT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    max_activations INT NOT NULL DEFAULT 3,
    email_delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_attempts INT NOT NULL DEFAULT 0,
    recovery_verification_token_hash VARCHAR(255),
    recovery_token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason VARCHAR(255),
    CONSTRAINT chk_status CHECK (status IN ('active','refunded','revoked','suspended')),
    CONSTRAINT chk_max_activations CHECK (max_activations > 0 AND max_activations <= 10),
    CONSTRAINT chk_email_status CHECK (email_delivery_status IN ('pending','sent','failed','bounced'))
);

CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(customer_email);
CREATE INDEX IF NOT EXISTS idx_licenses_transaction ON licenses(paddle_transaction_id);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);

CREATE TABLE IF NOT EXISTS license_activations (
    activation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID NOT NULL REFERENCES licenses(license_id) ON DELETE CASCADE,
    activation_identifier_hash VARCHAR(128) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_validated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    deactivated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_license_device UNIQUE (license_id, activation_identifier_hash),
    CONSTRAINT chk_activation_status CHECK (status IN ('active','deactivated'))
);

CREATE INDEX IF NOT EXISTS idx_activations_license ON license_activations(license_id);
CREATE INDEX IF NOT EXISTS idx_activations_status ON license_activations(status);
