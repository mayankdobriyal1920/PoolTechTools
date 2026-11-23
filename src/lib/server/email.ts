// src/lib/server/email.ts — Resend email provider implementation
import { Resend } from "resend";

export interface EmailResult { success: boolean; messageId?: string; error?: string; }

export interface EmailService {
  sendPurchaseConfirmation(to: string, vars: { licenseKey: string; activationUrl: string }): Promise<EmailResult>;
  sendActivationConfirmation(to: string, vars: { deviceName: string; activatedAt: string }): Promise<EmailResult>;
  sendRecoveryInstructions(to: string, vars: { recoveryUrl: string }): Promise<EmailResult>;
  sendRevocationNotice(to: string, vars: { reason: string }): Promise<EmailResult>;
}

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

async function withRetry(fn: () => Promise<EmailResult>): Promise<EmailResult> {
  let lastError: string | undefined;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await fn();
      if (result.success) return result;
      lastError = result.error;
    } catch (err: any) {
      lastError = err?.message || "unknown";
    }
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, BASE_DELAY_MS * Math.pow(2, attempt - 1)));
    }
  }
  return { success: false, error: lastError };
}

function getResend(): Resend | null {
  const key = process.env.EMAIL_PROVIDER_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM_ADDRESS || "hello@pooltechkit.online";
}

export class ResendEmailService implements EmailService {
  private resend: Resend;
  constructor() {
    const r = getResend();
    if (!r) throw new Error("EMAIL_PROVIDER_API_KEY not set");
    this.resend = r;
  }

  async sendPurchaseConfirmation(to: string, vars: { licenseKey: string; activationUrl: string }) {
    return withRetry(async () => {
      try {
        const { data, error } = await this.resend.emails.send({
          from: getFromAddress(),
          to,
          subject: "Your PoolTechTools Pro License Key 🎉",
          html: purchaseConfirmationHtml(vars),
        });
        if (error) return { success: false, error: error.message };
        return { success: true, messageId: data?.id };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    });
  }

  async sendActivationConfirmation(to: string, vars: { deviceName: string; activatedAt: string }) {
    return withRetry(async () => {
      try {
        const { data, error } = await this.resend.emails.send({
          from: getFromAddress(),
          to,
          subject: "PoolTechTools Pro — Device Activated",
          html: `<p>Your device <strong>${vars.deviceName}</strong> was activated on ${vars.activatedAt}.</p><p>You can manage your devices at <a href="https://pooltechkit.online/pro/activate">pooltechkit.online/pro/activate</a>.</p>`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, messageId: data?.id };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    });
  }

  async sendRecoveryInstructions(to: string, vars: { recoveryUrl: string }) {
    return withRetry(async () => {
      try {
        const { data, error } = await this.resend.emails.send({
          from: getFromAddress(),
          to,
          subject: "PoolTechTools — License Recovery",
          html: `<p>Click the link below to recover your license:</p><p><a href="${vars.recoveryUrl}">${vars.recoveryUrl}</a></p><p>This link expires in 15 minutes.</p>`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, messageId: data?.id };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    });
  }

  async sendRevocationNotice(to: string, vars: { reason: string }) {
    return withRetry(async () => {
      try {
        const { data, error } = await this.resend.emails.send({
          from: getFromAddress(),
          to,
          subject: "PoolTechTools — License Update",
          html: `<p>Your license status has changed: ${vars.reason}.</p><p>Contact support if you have questions.</p>`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, messageId: data?.id };
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    });
  }
}

// Fallback for when no API key is set (dev/testing)
export class ConsoleEmailService implements EmailService {
  async sendPurchaseConfirmation(to: string, vars: { licenseKey: string; activationUrl: string }) {
    console.log("[EMAIL] Purchase confirmation to", to, vars);
    return { success: true, messageId: "stub-" + Date.now() };
  }
  async sendActivationConfirmation(to: string, vars: { deviceName: string; activatedAt: string }) {
    console.log("[EMAIL] Activation confirmation to", to, vars);
    return { success: true, messageId: "stub-" + Date.now() };
  }
  async sendRecoveryInstructions(to: string, vars: { recoveryUrl: string }) {
    console.log("[EMAIL] Recovery instructions to", to, vars);
    return { success: true, messageId: "stub-" + Date.now() };
  }
  async sendRevocationNotice(to: string, vars: { reason: string }) {
    console.log("[EMAIL] Revocation notice to", to, vars);
    return { success: true, messageId: "stub-" + Date.now() };
  }
}

export function getEmailService(): EmailService {
  if (process.env.EMAIL_PROVIDER_API_KEY) {
    return new ResendEmailService();
  }
  return new ConsoleEmailService();
}

function purchaseConfirmationHtml(vars: { licenseKey: string; activationUrl: string }): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0a1f33;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="color: #2b7bbd; margin-bottom: 8px;">Welcome to PoolTechTools Pro! 🎉</h1>
    <p style="color: #666;">Your payment was successful. Here's your license key.</p>
  </div>

  <div style="background: #eaf6fb; border: 2px solid #2b7bbd; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Your License Key</p>
    <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2b7bbd; letter-spacing: 2px; font-family: monospace;">${vars.licenseKey}</p>
  </div>

  <h2 style="color: #2b7bbd; font-size: 18px;">How to Activate (3 steps)</h2>
  <ol style="color: #333; line-height: 1.8;">
    <li>Go to <a href="${vars.activationUrl}" style="color: #2b7bbd;">${vars.activationUrl}</a></li>
    <li>Enter your license key and a device name (e.g., "My iPhone")</li>
    <li>Click <strong>Activate</strong> — Pro features unlock instantly</li>
  </ol>

  <div style="background: #f5fafe; border-radius: 8px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; font-size: 14px; color: #666;">
      <strong>Device limit:</strong> You can activate on up to 3 devices. To free a slot, deactivate a device from the activation page.
    </p>
  </div>

  <div style="background: #fff8e1; border-radius: 8px; padding: 16px; margin: 24px 0;">
    <p style="margin: 0; font-size: 14px; color: #856404;">
      <strong>Important:</strong> Save this email — it contains your license key. If you lose it, use the recovery option on the activation page.
    </p>
  </div>

  <p style="color: #999; font-size: 12px; margin-top: 32px; text-align: center;">
    PoolTechTools · <a href="https://pooltechkit.online" style="color: #999;">pooltechkit.online</a><br/>
    This email was sent because you purchased a Pro license.
  </p>
</body>
</html>`;
}
