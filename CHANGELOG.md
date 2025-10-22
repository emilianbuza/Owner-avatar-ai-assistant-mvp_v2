# Changelog

## [2.0.0] - 2025-10-22

### 🔒 Security
- Rate Limiting implementiert (100 req/15min)
- Input Validation & Sanitization
- Security Headers (XSS, CSRF Protection)
- File Upload Restrictions
- Error Masking in Production

### 🏗️ Architektur
- Komplette Restrukturierung
- Controllers für Request Handling
- Services für Business Logic
- Middleware-Layer (Validation, Error, Security)
- Zentrale Config & Constants
- Logger implementiert

### 🎨 Frontend
- Modularisierung (App, UI, Utils, Constants)
- CSS in separater Datei
- Error Toasts
- Besseres State Management
- XSS-sichere Rendering-Funktionen

### ⚡ Performance
- Debouncing für API Calls
- Optimierte Event Listener
- Reduced Reflows

### 📝 Code Quality
- JSDoc Types hinzugefügt
- DRY-Prinzip durchgezogen
- Magic Numbers eliminiert
- Besseres Error Handling
- Async/Await statt Promises

### 🐛 Bugfixes
- JSON Parsing Error Handling
- File Upload Memory Leaks
- LocalStorage Overflow Protection
- Task Deduplication

### 📚 Dokumentation
- Production-ready README
- Security Policy
- API Documentation
- Deployment Guide

### ⚠️ Breaking Changes
- API Endpoints geändert (`.env` anpassen)
- Frontend Storage Keys geändert
- Neue Environment Variables erforderlich

## [1.0.0] - 2025-10-15

### Initial Release
- Basic AI Analysis
- Gmail Demo Integration
- Simple Task Management
- Monolithic Frontend
- No Security Measures
