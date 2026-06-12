import { Resend } from "resend";
import QRCode from "qrcode";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

interface MembershipActivationEmailParams {
  to: string;
  fullName: string;
  tierName: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  orderId: string;
  bankReference: string | null;
  qrValue: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function sendMembershipActivationEmail({
  to,
  fullName,
  tierName,
  startDate,
  endDate,
  amount,
  orderId,
  bankReference,
  qrValue,
}: MembershipActivationEmailParams): Promise<void> {
  const apiKey = required("RESEND_API_KEY");
  const from = required("EMAIL_FROM");

  const resend = new Resend(apiKey);

  const qrPng = await QRCode.toBuffer(qrValue, { type: "png", width: 320, margin: 2 });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #0a0a0f;">
      <h1 style="font-size: 20px; text-transform: uppercase; letter-spacing: 0.05em;">Welcome to Be Fit Gym</h1>
      <p>Hi ${escapeHtml(fullName)},</p>
      <p>Your payment was successful and your <strong>${escapeHtml(tierName)}</strong> membership is now <strong>active</strong>.</p>

      <div style="text-align: center; margin: 24px 0;">
        <img src="cid:membership-qr" alt="Membership QR code" width="240" height="240" />
        <p style="font-size: 12px; color: #666;">Show this QR code at the front desk to check in.</p>
      </div>

      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 8px;">Receipt</h2>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; color: #666;">Plan</td><td style="padding: 4px 0; text-align: right;">${escapeHtml(tierName)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Amount paid</td><td style="padding: 4px 0; text-align: right;">€${amount.toFixed(2)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Valid from</td><td style="padding: 4px 0; text-align: right;">${dateFormatter.format(startDate)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Valid until</td><td style="padding: 4px 0; text-align: right;">${dateFormatter.format(endDate)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Order ID</td><td style="padding: 4px 0; text-align: right; font-family: monospace;">${escapeHtml(orderId)}</td></tr>
        ${bankReference ? `<tr><td style="padding: 4px 0; color: #666;">Auth code</td><td style="padding: 4px 0; text-align: right; font-family: monospace;">${escapeHtml(bankReference)}</td></tr>` : ""}
      </table>

      <p style="margin-top: 24px; font-size: 12px; color: #666;">Be Fit Gym, Suhareka, Kosovo</p>
    </div>
  `;

  await resend.emails.send({
    from,
    to,
    subject: `Your ${tierName} membership is active`,
    html,
    attachments: [
      {
        filename: "membership-qr.png",
        content: qrPng,
        contentType: "image/png",
        contentId: "membership-qr",
      },
    ],
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
