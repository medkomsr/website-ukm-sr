import { createContactHandler } from "@/features/contact/server/contact-handler";
import { createSmtpMailer } from "@/features/contact/server/smtp-mailer";

export const POST = createContactHandler(createSmtpMailer);
