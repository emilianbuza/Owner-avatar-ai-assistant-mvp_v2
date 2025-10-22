import { STORAGE_KEYS } from "./constants.js";

export function hashTask(task) {
  const str = `${task.title}|${task.due || ""}|${task.priority}`;
  return btoa(unescape(encodeURIComponent(str))).slice(0, 24);
}

export function getDoneSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONE_TASKS);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function setDoneSet(set) {
  try {
    localStorage.setItem(STORAGE_KEYS.DONE_TASKS, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export function getSavedMinutes() {
  try {
    return Number(localStorage.getItem(STORAGE_KEYS.TIME_SAVED) || 0);
  } catch {
    return 0;
  }
}

export function setSavedMinutes(min) {
  try {
    localStorage.setItem(STORAGE_KEYS.TIME_SAVED, String(min));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export function addSavedMinutes(min) {
  const current = getSavedMinutes();
  const next = current + Number(min || 0);
  setSavedMinutes(next);
  return next;
}

export function persistTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function showError(message) {
  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error || "Request failed");
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
