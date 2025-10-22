import { logger } from "../utils/logger.js";

const DEMO_MESSAGES = [
  { from: "FernUniversität Hagen <info@fernuni-hagen.de>", subject: "Ihre Sendung wird zugestellt", snippet: "Ihre Sendung wird heute zwischen 13:10 und 14:40 Uhr zugestellt." },
  { from: "Amazon <bestellung@amazon.de>", subject: "Bestellung versendet", snippet: "Paket #123-456 wird morgen eintreffen." },
  { from: "PayPal <service@paypal.de>", subject: "Zahlung an Netflix", snippet: "12,99 EUR an Netflix gesendet." },
  { from: "LinkedIn <updates@linkedin.com>", subject: "Neue Profilansichten", snippet: "3 Personen haben Ihr Profil angesehen." },
  { from: "Dropbox <no-reply@dropbox.com>", subject: "Speicher fast voll", snippet: "Speicher zu 95% belegt." },
  { from: "Arztpraxis Dr. Müller <info@praxis-mueller.de>", subject: "Termin morgen 09:00", snippet: "Bitte Versicherungskarte mitbringen." },
  { from: "Google Kalender <calendar-noreply@google.com>", subject: "Team-Meeting 10:00", snippet: "Erinnerung: Meeting in 30 Minuten." },
  { from: "Telekom <kontakt@telekom.de>", subject: "Rechnung Oktober 2025", snippet: "Rechnung über 49,90 EUR verfügbar." },
  { from: "Postbank <online@postbank.de>", subject: "Wichtige Mitteilung", snippet: "Bitte Handynummer bis 30.10. bestätigen." },
  { from: "Spotify <no-reply@spotify.com>", subject: "Jahresrückblick 2025", snippet: "8.237 Minuten Musik gehört." },
  { from: "OpenAI <noreply@openai.com>", subject: "Neue Features in ChatGPT", snippet: "GPT-5 Turbo mit Memory." },
  { from: "Airbnb <updates@airbnb.com>", subject: "Buchung Wien", snippet: "24.–26. Oktober bestätigt." },
  { from: "Notion <support@notion.so>", subject: "Neue Kommentare", snippet: "Anna hat kommentiert." },
  { from: "Microsoft <security@microsoft.com>", subject: "Sicherheitsüberprüfung", snippet: "Bitte Identität bestätigen." },
  { from: "Apple <no-reply@apple.com>", subject: "iCloud fast voll", snippet: "49,3 GB von 50 GB genutzt." },
  { from: "GitHub <noreply@github.com>", subject: "Neue Stars", snippet: "3 neue Stars für 'ai-assistant-mvp'." },
  { from: "Krankenkasse TK <service@tk.de>", subject: "Bescheinigung abgelaufen", snippet: "Bitte bis 31. Oktober erneuern." }
];

export async function fetchGmailMessages() {
  logger.info("Fetching Gmail messages (demo mode)");
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return DEMO_MESSAGES;
}

export async function fetchGmailWithOAuth() {
  throw new Error("OAuth not implemented yet - use demo mode");
}
