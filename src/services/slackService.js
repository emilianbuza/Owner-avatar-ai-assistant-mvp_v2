import { logger } from "../utils/logger.js";

const DEMO_MESSAGES = [
  { channel: "#team", text: "Bitte Präsentation bis 14 Uhr prüfen." },
  { channel: "#sales", text: "Neuer Lead eingegangen – bitte übernehmen." },
  { channel: "#support", text: "Ticket 1043 ist kritisch markiert." }
];

export async function fetchSlackMessages() {
  logger.info("Fetching Slack messages (demo mode)");
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return DEMO_MESSAGES;
}

export async function fetchSlackWithAPI(token) {
  throw new Error("Slack API not implemented yet - use demo mode");
}
