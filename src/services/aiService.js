import OpenAI from "openai";
import { config } from "../config/index.js";
import { AI_CONFIG, PRIORITY, TASK_DEFAULTS, ERROR_MESSAGES } from "../constants/index.js";
import { AppError } from "../middleware/errorHandler.js";
import { logger } from "../utils/logger.js";

const client = new OpenAI({ 
  apiKey: config.openai.apiKey,
  timeout: AI_CONFIG.TIMEOUT_MS
});

const SYSTEM_PROMPT = `Du bist ein persönlicher KI-Assistent, der Menschen hilft, ihre Aufgaben zu verstehen und zu priorisieren. Antworte AUSSCHLIESSLICH mit gültigem JSON.

Schema:
{
  "tasks": [{
    "title": "Klare, handlungsorientierte Beschreibung im Imperativ",
    "priority": 1-3,
    "reason": "Eine warme, persönliche Begründung die erklärt WARUM diese Aufgabe wichtig ist - nicht nur WAS sie ist. Beziehe dich auf Werte wie Pflichtbewusstsein, Zuverlässigkeit, persönliche Ziele oder das Wohlbefinden. 2-3 Sätze.",
    "effort_minutes": 5-120,
    "due": "ISO-8601 oder null",
    "suggested_timebox": "Text oder null",
    "steps": [
      "Vollständige, persönliche Sätze die dich direkt ansprechen. Erkläre nicht nur WAS zu tun ist, sondern auch WARUM und WIE es hilft. Jeder Schritt sollte motivierend und klar sein. Beispiel: 'Bereite alle Notizen vor, die du für dein Meeting brauchst, damit du im Meeting selbstsicher auftreten kannst und nichts Wichtiges vergisst.' Maximal 5 Schritte."
    ]
  }]
}

Wichtige Regeln:
- Priority: 1 = heute deadline, 2 = diese Woche, 3 = später
- Begründungen müssen WARM und PERSÖNLICH sein, keine technischen Wiederholungen
- Begründungen erklären die tiefere Motivation (Verantwortung, Wohlbefinden, Erfolg, Beziehungen)
- Schritte in Du-Form, vollständige Sätze, erklären WARUM jeder Schritt wichtig ist
- Maximal 10 Tasks
- Nur JSON, keine Markdown, keine Erklärungen

Beispiel GUTE Begründung:
"Das Meeting ist eine wichtige berufliche Verpflichtung. Wenn du gut vorbereitet teilnimmst, zeigst du Professionalität und Zuverlässigkeit, was dein Team schätzen wird und dir hilft, deine Karriereziele zu erreichen."

Beispiel SCHLECHTE Begründung:
"Erinnerung für Meeting um 10:00 Uhr."

Beispiel GUTER Schritt:
"Bereite alle Unterlagen und Notizen vor, die du im Meeting brauchst. So kannst du selbstsicher deine Punkte vortragen und vergisst nichts Wichtiges."

Beispiel SCHLECHTER Schritt:
"Notizen bereitstellen"`;

function tryExtractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function validateTask(task) {
  return {
    title: String(task.title || "Unbekannte Aufgabe").slice(0, TASK_DEFAULTS.MAX_TITLE_LENGTH),
    priority: [PRIORITY.URGENT, PRIORITY.IMPORTANT, PRIORITY.LATER].includes(Number(task.priority)) 
      ? Number(task.priority) 
      : PRIORITY.LATER,
    reason: String(task.reason || "").slice(0, 500),
    effort_minutes: Math.max(5, Math.min(120, Number(task.effort_minutes) || TASK_DEFAULTS.EFFORT_MINUTES)),
    due: task.due || null,
    suggested_timebox: task.suggested_timebox || null,
    steps: Array.isArray(task.steps) ? task.steps.slice(0, TASK_DEFAULTS.MAX_STEPS).map(s => String(s).slice(0, 300)) : []
  };
}

export async function analyzeToTasks(messages = []) {
  if (!messages || messages.length === 0) {
    throw new AppError(ERROR_MESSAGES.NO_MESSAGES, 400);
  }
  
  const corpus = messages
    .map((m, i) => `${i + 1}. [${m.source}] ${m.subject ? `Betreff: ${m.subject} | ` : ""}${m.text}`)
    .join("\n")
    .slice(0, 10000);
  
  logger.debug("Analyzing messages", { count: messages.length, corpusLength: corpus.length });
  
  try {
    const completion = await client.chat.completions.create({
      model: AI_CONFIG.MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analysiere und priorisiere:\n${corpus}` }
      ],
      temperature: AI_CONFIG.TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS
    });
    
    const rawOutput = completion.choices?.[0]?.message?.content?.trim();
    if (!rawOutput) {
      throw new Error("Keine Antwort von OpenAI");
    }
    
    const parsed = tryExtractJSON(rawOutput);
    
    if (!parsed?.tasks || !Array.isArray(parsed.tasks)) {
      logger.warn("AI returned invalid JSON", { rawOutput: rawOutput.slice(0, 200) });
      throw new Error("Ungültiges JSON-Format");
    }
    
    const validated = parsed.tasks.map(validateTask);
    validated.sort((a, b) => a.priority - b.priority || a.effort_minutes - b.effort_minutes);
    
    logger.info("Tasks analyzed successfully", { count: validated.length });
    return validated;
    
  } catch (error) {
    logger.error("AI analysis failed", { error: error.message });
    
    if (error.code === "insufficient_quota") {
      throw new AppError("OpenAI API Quota erschöpft", 503);
    }
    
    if (error.code === "context_length_exceeded") {
      throw new AppError("Zu viele Nachrichten, bitte reduzieren", 400);
    }
    
    throw new AppError(ERROR_MESSAGES.AI_FAILED, 500, error.message);
  }
}

export async function summarizeMessages(messages = []) {
  if (!messages || messages.length === 0) {
    return "Keine Nachrichten zum Zusammenfassen.";
  }
  
  const joined = messages
    .map(m => `${m.source}: ${m.text}`)
    .join("\n")
    .slice(0, 5000);
  
  try {
    const completion = await client.chat.completions.create({
      model: AI_CONFIG.MODEL,
      messages: [
        { role: "system", content: "Fasse die Inhalte in max. 5 Stichpunkten zusammen." },
        { role: "user", content: joined }
      ],
      temperature: 0.3,
      max_tokens: 400
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    logger.error("Summarization failed", { error: error.message });
    throw new AppError("Zusammenfassung fehlgeschlagen", 500);
  }
}