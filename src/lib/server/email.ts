// src/lib/server/email.ts — provider-independent EmailService interface + stub
// Replace the stub with a real provider (Resend/Postmark/SendGrid) by implementing this interface.

export interface EmailResult { success: boolean; messageId?: string; error?: string; }

export interface EmailService {
  sendPurchaseConfirmation(to: string, vars: { licenseKey: string; activationUrl: string }): Promise<EmailResult>;
  sendActivationConfirmation(to: string, vars: { deviceName: string; activatedAt: string }): Promise<EmailResult>;
  sendRecoveryInstructions(to: string, vars: { recoveryUrl: string }): Promise<EmailResult>;
  sendRevocationNotice(to: string, vars: { reason: string }): Promise<EmailResult>;
}

// Stub implementation — logs to console. Replace in production.
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
  // TODO: instantiate real provider based on env config
  return new ConsoleEmailService();
}
