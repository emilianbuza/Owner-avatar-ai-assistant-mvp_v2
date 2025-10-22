import { API_ENDPOINTS, MESSAGES } from "./constants.js";
import { 
  loadTasks, 
  persistTasks, 
  setSavedMinutes, 
  addSavedMinutes,
  getDoneSet,
  setDoneSet,
  hashTask,
  showError,
  apiRequest
} from "./utils.js";
import { renderMails, renderTasks, updateStats, setLoading } from "./ui.js";

class App {
  constructor() {
    this.tasks = [];
    this.mails = [];
    this.activeTab = "all";
    this.showTop3 = false;
    
    this.initElements();
    this.initEventListeners();
    this.loadInitialData();
  }
  
  initElements() {
    this.els = {
      fetchBtn: document.getElementById("fetchMails"),
      clearMailsBtn: document.getElementById("clearMails"),
      mailList: document.getElementById("mailList"),
      loading: document.getElementById("loading"),
      textForm: document.getElementById("textForm"),
      textInput: document.getElementById("textInput"),
      clearTextBtn: document.getElementById("clearText"),
      fileForm: document.getElementById("fileForm"),
      fileInput: document.getElementById("fileInput"),
      taskContainer: document.getElementById("taskContainer"),
      countStat: document.getElementById("countStat"),
      etaStat: document.getElementById("etaStat"),
      savedCounter: document.getElementById("savedCounter"),
      showTop3Btn: document.getElementById("showTop3"),
      resetDoneBtn: document.getElementById("resetDone"),
      tabs: Array.from(document.querySelectorAll(".tab"))
    };
  }
  
  initEventListeners() {
    this.els.fetchBtn.addEventListener("click", () => this.fetchMessages());
    this.els.clearMailsBtn.addEventListener("click", () => this.clearMails());
    this.els.textForm.addEventListener("submit", (e) => this.handleTextSubmit(e));
    this.els.clearTextBtn.addEventListener("click", () => this.clearText());
    this.els.fileForm.addEventListener("submit", (e) => this.handleFileSubmit(e));
    this.els.showTop3Btn.addEventListener("click", () => this.toggleTop3());
    this.els.resetDoneBtn.addEventListener("click", () => this.resetDone());
    
    this.els.tabs.forEach(tab => {
      tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
    });
    
    this.els.taskContainer.addEventListener("click", (e) => this.handleTaskAction(e));
  }
  
  loadInitialData() {
    this.tasks = loadTasks();
    this.render();
  }
  
  async fetchMessages() {
    setLoading(this.els.loading, true);
    
    try {
      const data = await apiRequest(API_ENDPOINTS.FETCH);
      this.mails = data.gmail || [];
      renderMails(this.mails, this.els.mailList);
      
      if (this.mails.length > 0) {
        await this.analyzeMessages(this.mails.map(m => ({
          source: "Gmail",
          subject: m.subject,
          text: m.snippet,
          from: m.from
        })));
      }
    } catch (error) {
      showError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(this.els.loading, false);
    }
  }
  
  async analyzeMessages(messages) {
    setLoading(this.els.loading, true);
    
    try {
      const data = await apiRequest(API_ENDPOINTS.INBOX_TEXT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages })
      });
      
      this.tasks = data.tasks || [];
      persistTasks(this.tasks);
      
      const saved = Math.round(this.tasks.reduce((sum, t) => sum + (Number(t.effort_minutes) || 0), 0) * 0.3);
      setSavedMinutes(saved);
      
      this.render();
    } catch (error) {
      showError(MESSAGES.ANALYSIS_ERROR + ": " + error.message);
    } finally {
      setLoading(this.els.loading, false);
    }
  }
  
  async handleTextSubmit(e) {
    e.preventDefault();
    
    const text = this.els.textInput.value.trim();
    if (!text) {
      showError(MESSAGES.NO_TEXT);
      return;
    }
    
    await this.analyzeMessages([{ 
      source: "Eingabe", 
      subject: "Benutzertext", 
      text 
    }]);
  }
  
  async handleFileSubmit(e) {
    e.preventDefault();
    
    const file = this.els.fileInput.files[0];
    if (!file) {
      showError(MESSAGES.NO_FILE);
      return;
    }
    
    setLoading(this.els.loading, true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(API_ENDPOINTS.INBOX_UPLOAD, {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(data.error);
      }
      
      this.tasks = data.tasks || [];
      persistTasks(this.tasks);
      
      const saved = Math.round(this.tasks.reduce((sum, t) => sum + (Number(t.effort_minutes) || 0), 0) * 0.3);
      setSavedMinutes(saved);
      
      this.render();
      this.els.fileInput.value = "";
    } catch (error) {
      showError(MESSAGES.FILE_ERROR + ": " + error.message);
    } finally {
      setLoading(this.els.loading, false);
    }
  }
  
  handleTaskAction(e) {
    const action = e.target.dataset.action;
    if (!action) return;
    
    const taskEl = e.target.closest(".task");
    if (!taskEl) return;
    
    const id = taskEl.dataset.id;
    const task = this.tasks.find(t => hashTask(t) === id);
    
    if (!task) return;
    
    if (action === "done") {
      const doneSet = getDoneSet();
      doneSet.add(id);
      setDoneSet(doneSet);
      addSavedMinutes(5);
      
      taskEl.classList.add("removing");
      setTimeout(() => this.render(), 150);
    }
    
    if (action === "copy") {
      const text = `${task.title}\nWarum: ${task.reason}\nDauer: ~${task.effort_minutes} Min\nZeitslot: ${task.suggested_timebox || "frei wählbar"}`;
      navigator.clipboard.writeText(text);
      e.target.textContent = "Kopiert ✓";
      setTimeout(() => {
        e.target.textContent = "Kopieren";
      }, 1500);
    }
  }
  
  switchTab(tab) {
    this.activeTab = tab;
    this.els.tabs.forEach(t => t.classList.remove("active"));
    this.els.tabs.find(t => t.dataset.tab === tab).classList.add("active");
    this.render();
  }
  
  toggleTop3() {
    this.showTop3 = !this.showTop3;
    this.els.showTop3Btn.textContent = this.showTop3 ? "Alle anzeigen" : "Top 3";
    this.render();
  }
  
  resetDone() {
    setDoneSet(new Set());
    this.render();
  }
  
  clearMails() {
    this.mails = [];
    renderMails([], this.els.mailList);
  }
  
  clearText() {
    this.els.textInput.value = "";
  }
  
  render() {
    renderTasks(this.tasks, this.els.taskContainer, this.activeTab, this.showTop3);
    updateStats(this.tasks, this.els.countStat, this.els.etaStat, this.els.savedCounter);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
