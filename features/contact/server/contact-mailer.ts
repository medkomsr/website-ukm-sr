export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  text: string;
};

/** Delivery boundary: false means unconfirmed delivery; adapters handle transport errors. */
export interface ContactMailer {
  send(message: ContactMessage, submissionId: string): Promise<boolean>;
}
