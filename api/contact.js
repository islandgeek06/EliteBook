// api/contact.js
// Node (serverless) handler for Vercel / Next.js Pages API.
// Requires: `npm i nodemailer zod`

const nodemailer = require("nodemailer");
const { z } = require("zod");

// ---- Config helpers --------------------------------------------------------
const bool = (v) => String(v).toLowerCase() === "true";

// Optional: allow cross-origin if your frontend is on a different domain.
function setCors(req, res) {
  const allowed = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(",").map((s) => s.trim())
    : [];

  const origin = req.headers.origin;
  if (origin && allowed.length && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!allowed.length && origin) {
    // default: reflect origin (same-project deployments usually fine)
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// Zod schema for simple validation
const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  topic: z.string().min(2),
  message: z.string().min(10),
  // `consent` may arrive as boolean or string "true"
  consent: z.union([z.boolean(), z.string()]),
  // optional honeypot
  company: z.string().optional(),
});

module.exports = async function handler(req, res) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Parse JSON body (Next.js usually gives object; raw deployments might give a string)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input." });

  const data = parsed.data;
  const consentGiven = typeof data.consent === "boolean" ? data.consent : data.consent === "true";
  if (!consentGiven) return res.status(400).json({ error: "Consent is required." });

  // Honeypot trap (hidden input named "company" on the client)
  if (data.company && data.company.trim() !== "") return res.status(204).end();

  const { name, email, phone, topic, message } = data;

  // SMTP transport (works with Microsoft 365, Google Workspace, etc.)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: bool(process.env.SMTP_SECURE), // true for 465, else false
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const TO_EMAIL = process.env.TO_EMAIL || "info@elitebooksolution.com";
  const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@elitebooksolution.com";

  try {
    // 1) Send inquiry to your inbox
    await transporter.sendMail({
      from: `"EliteBook Website" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New Inquiry: ${topic} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "N/A"}`,
        `Service: ${topic}`,
        ``,
        `Message:`,
        `${message}`,
      ].join("\n"),
    });

    // 2) Auto-reply to the sender
    await transporter.sendMail({
      from: `"EliteBook Solution" <${FROM_EMAIL}>`,
      to: email,
      subject: `We received your message — EliteBook Solution`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#0b1320">
          <h2 style="margin:0 0 8px;color:#1F6B3A">Thanks, ${escapeHtml(name)}!</h2>
          <p>We’ve received your message about <strong>${escapeHtml(topic)}</strong> and will get back to you shortly (usually within one business day).</p>
          <p style="margin:16px 0 8px"><strong>Your message:</strong></p>
          <blockquote style="margin:0;padding:12px 16px;border-left:4px solid #E9A51C;background:#f8f9fb">
            ${escapeHtml(message).replace(/\n/g, "<br/>")}
          </blockquote>
          <p style="margin-top:16px">If you need anything urgent, email us at <a href="mailto:${TO_EMAIL}">${TO_EMAIL}</a>.</p>
          <p style="font-size:12px;color:#6b7280">— EliteBook Solution</p>
        </div>
      `.trim(),
      text: `Hi ${name},

Thanks for contacting EliteBook Solution about "${topic}".
A specialist will get back to you shortly (usually within one business day).

Your message:
${message}

If you need anything urgent, email ${TO_EMAIL}.

— EliteBook Solution`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({ error: "Email failed. Please try direct email." });
  }
};

// Small HTML escaper for safety in the auto-reply
function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
