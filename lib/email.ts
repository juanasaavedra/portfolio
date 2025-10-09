import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not set. Emails will fail to send.');
}

export const resend = new Resend(resendApiKey || '');

export const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND ?? 'UNO Estudiante';
