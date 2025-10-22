import { asyncHandler } from "../middleware/errorHandler.js";
import { fetchGmailMessages } from "../services/gmailService.js";
import { fetchSlackMessages } from "../services/slackService.js";
import { summarizeMessages, analyzeToTasks } from "../services/aiService.js";

export const fetchAllMessages = asyncHandler(async (req, res) => {
  const [gmail, slack] = await Promise.allSettled([
    fetchGmailMessages(),
    fetchSlackMessages()
  ]);
  
  res.json({
    ok: true,
    gmail: gmail.status === "fulfilled" ? gmail.value : [],
    slack: slack.status === "fulfilled" ? slack.value : [],
    errors: [
      gmail.status === "rejected" ? { source: "gmail", error: gmail.reason.message } : null,
      slack.status === "rejected" ? { source: "slack", error: slack.reason.message } : null
    ].filter(Boolean)
  });
});

export const getSummary = asyncHandler(async (req, res) => {
  const messages = req.validatedMessages || [
    { source: "Slack", text: "Demo-Nachricht für Zusammenfassung" }
  ];
  
  const summary = await summarizeMessages(messages);
  
  res.json({
    ok: true,
    summary,
    messageCount: messages.length
  });
});

export const prioritizeTasks = asyncHandler(async (req, res) => {
  const messages = req.validatedMessages || [
    { source: "Demo", subject: "Test", text: "Demo-Aufgabe" }
  ];
  
  const tasks = await analyzeToTasks(messages);
  
  res.json({
    ok: true,
    tasks,
    count: tasks.length
  });
});

export const healthCheck = asyncHandler(async (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "1.0.0"
  });
});
