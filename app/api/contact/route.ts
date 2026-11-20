import { createContactHandler } from "@/features/contact/server/contact-handler";
import { createSmtpMailer } from "@/features/contact/server/smtp-mailer";
import { createContactStore } from "@/features/contact/server/contact-store";

export const POST = createContactHandler(
  () => (process.env.CONTACT_ENABLED === "true" ? createSmtpMailer() : null),
  createContactStore,
);
