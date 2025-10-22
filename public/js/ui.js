import { PRIORITY } from "./constants.js";
import { hashTask, getDoneSet } from "./utils.js";

export function renderMails(mails, container) {
  if (!mails || mails.length === 0) {
    container.innerHTML = '<div class="muted">Noch keine E-Mails geladen.</div>';
    return;
  }
  
  container.innerHTML = mails.map(mail => `
    <div class="mail">
      <strong>${escapeHtml(mail.from)}</strong>
      ${escapeHtml(mail.subject)}
      <br><small>${escapeHtml(mail.snippet)}</small>
    </div>
  `).join("");
}

export function renderTasks(tasks, container, activeTab, showTop3) {
  const doneSet = getDoneSet();
  
  let filtered = tasks.filter(t => !doneSet.has(hashTask(t)));
  
  if (activeTab !== "all") {
    filtered = filtered.filter(t => String(t.priority) === String(activeTab));
  }
  
  filtered.sort((a, b) => 
    a.priority - b.priority || 
    (a.due ? 1 : 0) - (b.due ? 1 : 0) ||
    a.effort_minutes - b.effort_minutes
  );
  
  if (showTop3) {
    filtered = filtered.slice(0, 3);
  }
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="muted">Keine Aufgaben in dieser Kategorie.</div>';
    return;
  }
  
  container.innerHTML = filtered.map(task => `
    <div class="task" data-id="${hashTask(task)}">
      <h4>${escapeHtml(task.title)}</h4>
      ${getPriorityBadge(task.priority)}
      <span class="badge time">~ ${task.effort_minutes || 30} min</span>
      ${task.due ? `<span class="badge due">Fällig: ${task.due}</span>` : ""}
      ${task.suggested_timebox ? `<div class="muted" style="margin-top:6px">⏱️ ${escapeHtml(task.suggested_timebox)}</div>` : ""}
      <div class="muted" style="margin-top:6px">Warum: ${escapeHtml(task.reason || "—")}</div>
      ${task.steps && task.steps.length ? `
        <details style="margin-top:8px">
          <summary>Schritte anzeigen (${task.steps.length})</summary>
          <ol style="margin:6px 0 0 20px">
            ${task.steps.map(s => `<li>${escapeHtml(s)}</li>`).join("")}
          </ol>
        </details>
      ` : ""}
      <div class="actions">
        <button class="btn done" data-action="done">Erledigt</button>
        <button class="btn flat" data-action="copy">Kopieren</button>
      </div>
    </div>
  `).join("");
}

export function updateStats(tasks, countEl, etaEl, savedEl) {
  const doneSet = getDoneSet();
  const pending = tasks.filter(t => !doneSet.has(hashTask(t)));
  const minutes = pending.reduce((sum, t) => sum + (Number(t.effort_minutes) || 0), 0);
  
  countEl.textContent = `${pending.length} Aufgaben`;
  etaEl.textContent = `~ ${minutes} Min`;
  
  const saved = Number(localStorage.getItem("aii_time_saved_today") || 0);
  savedEl.textContent = `⏳ Zeitersparnis: ${saved} Min`;
}

export function setLoading(el, show) {
  if (show) {
    el.classList.add("show");
  } else {
    el.classList.remove("show");
  }
}

function getPriorityBadge(priority) {
  switch (Number(priority)) {
    case PRIORITY.URGENT:
      return '<span class="badge p1">Dringend</span>';
    case PRIORITY.IMPORTANT:
      return '<span class="badge p2">Wichtig (48h)</span>';
    default:
      return '<span class="badge p3">Später</span>';
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
