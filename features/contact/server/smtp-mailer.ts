import nodemailer from "nodemailer";
import { CONTACT_EMAIL_PATTERN as emailPattern } from "../lib/contact-config";
import type { ContactMailer } from "./contact-mailer";
const recipient = "senireligi@ub.ac.id";
export function createSmtpMailer(
  createTransport: typeof nodemailer.createTransport = nodemailer.createTransport,
): ContactMailer | null {
  const host = process.env.CONTACT_SMTP_HOST;
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASSWORD;
  const from = process.env.CONTACT_FROM;
  const port = Number(process.env.CONTACT_SMTP_PORT || "587");
  if (!host || !user || !pass || !from || !emailPattern.test(from) || ![465, 587].includes(port)) {
    return null;
  }

  return {
    send: async ({ name, email, subject, text, attachments }, id) => {
      const transport = createTransport({
        host,
        port,
        secure: port === 465,
        requireTLS: true,
        auth: { user, pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      try {
        const result = await transport.sendMail({
          from: { name: "Website Seni Religi", address: from },
          to: recipient,
          replyTo: { name, address: email },
          subject: `[Hubungi Kami] ${subject} — ${name}`,
          messageId: `<contact-${id}@${from.split("@")[1]}>`,
          text,
          attachments,
        });
        return result.accepted.some((address) => address.toLowerCase() === recipient);
      } catch {
        return false;
      } finally {
        transport.close();
      }
    },
  };
}
