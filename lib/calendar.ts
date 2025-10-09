import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/calendar'];

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey || !process.env.GOOGLE_PROJECT_ID) {
    throw new Error('Google Calendar credentials are missing');
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
    subject: clientEmail
  });
}

export function getCalendarClient() {
  const auth = getAuth();
  return google.calendar({ version: 'v3', auth });
}
