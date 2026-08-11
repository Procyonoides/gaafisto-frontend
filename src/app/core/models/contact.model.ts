export interface Contact {
  _id?: string;
  sms: string;
  telpon: string;
  wa: string;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}