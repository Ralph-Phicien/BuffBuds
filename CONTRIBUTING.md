# Contributing Guidelines

Welcome to **BuffBuds** 💪  
This document explains how our team will collaborate, code, and submit changes.  

---

## Workflow Overview

1. **Pick an issue** from GitHub Issues (or create one if needed).  
2. **Create a feature branch** for your work.  
3. **Code & commit** commit often, if using LLMs ensure youre code actually works, garbage in == garbage out
4. **Open a Pull Request (PR)** into `dev`.  
5. Project manager reviews & approves before merging.  

---

## Branch Strategy

We use a **GitHub Flow + dev branch** model:

- `main` → production-ready code (stable).  
- `dev` → active development (staging).  
- `issue/sub-issue` → one branch per issue, branch again for sub issues.

---

## ✅ Commit Guidelines

Use clear, descriptive commit messages.  
Follow the **conventional commits** style:

- feat: add workout logging service
- fix: correct API call for user profile
- docs: update README setup steps
- style: changed header color
- refactor: broke big function into smaller modular ones
- chore: updated flask verison to latest
---

## 🧪 Code Standards

- **Backend (Flask)**  
  - Put routes in `backend/app/routes/` (blueprints).  
  - Put database/API logic in `backend/app/services/`.  
  - Don’t hardcode secrets — always use `.env`.  

- **Frontend (React)**  
  - Pages go in `frontend/src/pages/`.  
  - Reusable UI goes in `frontend/src/components/`.  
  - All API calls go in `frontend/src/services/api.js`.  

---

## 🔄 Pull Request Process

1. Ensure your code works properly and issue requirments are met.  
1. Push your branch.  
2. Open a PR into `dev`.  
4. Once approved, project manager will merge → `dev`.  
5. Porject manager (Dylan) will merge  `dev` → `main` after testing and sprint goals met.  

---

## 📦 Setup Instructions

### Backend (Flask)

1. `cd backend`
2. `pip install -r requirements.txt`
3. `make .env in root folder`
    - format:
        - SUPABASE_URL= "url here"
        - SUPABASE_KEY= "key here"
        - API_NINJAS_KEY= "key here"
4. `python wsgi.py` → runs server on local

### Frontend (React)

1. `cd frontend`
2. `npm install`
3. `npm run dev` runs frontend on local

---

## 📋 Issue Tracking

- All tasks must be linked to a GitHub Issue.  
- Tag issues with `frontend`, `backend`, `bug`, or `enhancement`.  
- Assign yourself when working on an issue.  

---
