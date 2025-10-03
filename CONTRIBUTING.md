# Contributing Guidelines

Welcome to **BuffBuds** 💪  
This document explains how our team will collaborate, code, and submit changes.  

---

## Workflow Overview

1. **Pick an issue** from GitHub Issues (or create one if needed).  
2. **Create a feature branch** for your work.  
3. **Code & commit** commit often, if using LLMs ensure youre code actually works, garbage in == garbage out
4. **Open a Pull Request (PR)** into epic branch.  
5. Project manager reviews & approves before merging.  

---

## Branch Strategy

We use a **GitHub Flow + dev branch** model:

- `main` → production-ready code (stable).  
- `dev` → active development (staging).  
- `epic/issue` → one branch per issue, pull from applicable epic branch

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
  - Put informational .JSON in `backend/data`.  
  - Don’t hardcode secrets — always use `.env` into root (./)  

- **Frontend (React)**  
  - Pages go in `frontend/src/assets/pages/`.  
  - Reusable UI goes in `frontend/src/assets/components/`.  
  - API calls go in `frontend/src/services/api.js`.  

---

## 🔄 Pull Request Process

1. Ensure your code works properly and issue requirments are met.  
1. Push your branch.  
2. Open a PR into applicable `#####-epic` branch.  
4. Once approved, project manager will merge → `#####-epic`.  
5. Project manager (Dylan) will merge  `#####-epic` → `dev` after testing and sprint goals met.
6. at end of testing of `dev`→ `main`, dev satys deployed during duration of development, main goes live after all deveolpment goals and testing is complete.
---

## 📦 Setup Instructions (Devlopement)

### Backend (Flask)

1. `cd backend`
2. `pip install -r requirements.txt`
3. `make .env in root folder`
    - format:
        - SUPABASE_URL= "url here"
        - SUPABASE_KEY= "key here"
        - SECERT_KEY= "key here"
     
4. ensure in wsgi.py that line 4 `app = create_app('app.config.DevelopmentConfig')
` app.config should always use class DevelopmentConfig in dev
5. `python wsgi.py` → runs server on local

### Frontend (React)

1. `cd frontend`
2. `npm install`
3. `npm run dev` runs frontend on local

---

## 📋 Issue Tracking

- All tasks must be linked to a GitHub Issue.  
- Tag issues with `frontend`, `backend`, `bug`, or `enhancement`.  
- Announce yourself in work on the "in-work" channel on discord with the issue you are going in work on 

---
