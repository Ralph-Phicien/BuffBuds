# BuffBuds

A modern **workout logger** + **social fitness platform**.  
Track your training, connect with friends, and push your limits together

🌐 **Live at:** [buffbuds.netlify.app](https://buffbuds.netlify.app/)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Team](#team)

---

## 🎯 Overview

BuffBuds is a comprehensive fitness platform that combines workout tracking with social networking. Users can create custom workout plans, log training sessions, track progress with detailed analytics, and connect with friends to share their fitness journey. The platform includes an admin panel for content moderation and user management.

---

## ✨ Features

### 👤 User Management
- **Authentication**: Secure email-based signup/login with Supabase Auth
- **Profile Customization**: Bio, profile pictures (URL or file upload), personal records (PRs)
- **Session Persistence**: Automatic login state management
- **Admin Roles**: Special privileges for platform moderation

### 🤝 Social Features
- **Follow System**: Follow/unfollow other users
- **Social Feed**: View posts from all users, sorted by most recent
- **Interactive Posts**: Like, unlike, and comment on posts
- **User Search**: Real-time search with autocomplete suggestions
- **Workout Sharing**: Automatic post generation after completing workouts
- **Profile Viewing**: View other users' profiles, posts, and PRs

### 🏋️ Workout Management
- **Custom Plans**: Create workout plans with multiple exercises
- **Auto-Generation**: Algorithm-based workout creation
  - Push/Pull/Legs split support
  - Balanced exercise selection (2 compound, 2 functional, 3 isolated)
- **Exercise Library**: Comprehensive database organized by muscle groups
- **Session Logging**: Track sets, reps, and weight for each exercise
- **Volume Calculation**: Automatic total volume computation
- **Workout History**: View all past workout sessions

### 📊 Analytics Dashboard
- **Volume Tracking**: Historical workout volume visualization
- **Multiple Views**: Weekly, monthly, year-to-date, and all-time charts
- **Statistics Cards**: 
  - Total workout sessions
  - Total volume lifted
  - Average volume per session
  - Maximum volume in a single session
- **Personal Records**: Track bench press, squat, and deadlift PRs
- **Chart.js Integration**: Beautiful, interactive data visualizations

### 🛡️ Admin Panel
- **User Management**: View all users, admin status, creation dates
- **Content Moderation**: Delete inappropriate posts
- **Workout Plan Oversight**: Monitor and manage all workout plans
- **Real-Time Updates**: Instant reflection of changes across the platform
- **Tabbed Interface**: Easy navigation between different management sections

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Framework**: Flask (Python)
- **API Design**: RESTful with Blueprint organization
- **Authentication**: Session-based with Flask-Session
- **Data Validation**: Pydantic schemas
- **CORS**: Flask-CORS
- **Middleware**: ProxyFix for deployment

### Database & Authentication
- **Database**: Supabase (PostgreSQL)
- **Auth Provider**: Supabase Auth
- **Real-time Capabilities**: Supabase real-time subscriptions

### Deployment
- **Frontend**: Netlify
- **Backend**: Railway
- **Version Control**: GitHub

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   React Client  │
│    (Netlify)    │
└────────┬────────┘
         │ HTTPS/REST
         │ (Axios)
         ↓
┌─────────────────┐
│   Flask API     │
│   (Railway)     │
│                 │
│  Blueprints:    │
│  • /auth        │
│  • /user        │
│  • /posts       │
│  • /plans       │
│  • /sessions    │
│  • /admin       │
└────────┬────────┘
         │ SQL
         ↓
┌─────────────────┐
│   Supabase      │
│  PostgreSQL +   │
│  Auth Service   │
└─────────────────┘
```

### Database Schema

**Core Tables:**
- `user_profile`: User data, bio, PRs, admin flags, volume history
- `Posts`: User posts with likes, comments, timestamps
- `workout_plans`: Saved workout templates with exercises
- `workout_session`: Logged workouts with volume calculations
- `Followers`: Many-to-many relationship for user following
- `user_likes`: User-to-user likes (stretch feature)

**Key Relationships:**
- Users → Posts (one-to-many)
- Users → Workout Plans (one-to-many)
- Users → Workout Sessions (one-to-many)
- Users ↔ Users (followers, many-to-many)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account

### Environment Variables

**Backend (.env):**
```
SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:5000  # Development
# VITE_API_BASE_URL=https://your-backend.railway.app  # Production
```

### Installation

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python wsgi.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Default Ports
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📡 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/status` - Check authentication status
- `POST /auth/reset-password` - Reset password

### User Endpoints
- `GET /user/users` - Get all users
- `GET /user/users/:username` - Get user profile
- `GET /user/users/:username/prs` - Get user PRs
- `PUT /user/users/:username` - Update user profile
- `DELETE /user/users/:username` - Delete user account
- `POST /user/follow/:username` - Follow user
- `POST /user/unfollow/:username` - Unfollow user
- `GET /user/:username/followers` - Get followers list
- `GET /user/:username/following` - Get following list
- `GET /user/volume-history` - Get workout volume history

### Post Endpoints
- `POST /posts` - Create new post
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/like` - Like post
- `PUT /posts/:id/unlike` - Unlike post
- `POST /posts/:id/comment` - Add comment
- `DELETE /posts/:id/comment/:index` - Delete comment
- `GET /posts/user/:username` - Get user's posts

### Workout Plan Endpoints
- `POST /plans` - Create workout plan
- `GET /plans` - Get all user's plans
- `GET /plans/:id` - Get single plan
- `PUT /plans/:id` - Update plan
- `DELETE /plans/:id` - Delete plan

### Workout Session Endpoints
- `POST /sessions` - Log workout session
- `GET /sessions` - Get all sessions
- `PUT /sessions/:id` - Update session

### Admin Endpoints (Protected)
- `GET /admin/users` - Get all users
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/posts` - Get all posts
- `DELETE /admin/posts/:id` - Delete post
- `GET /admin/workout-plans` - Get all plans
- `DELETE /admin/workout-plans/:id` - Delete plan

---

## 🎯 Project Status

### ✅ Completed Features
- [x] User authentication and management
- [x] Social feed with posts
- [x] Follow/unfollow system
- [x] Workout plan creation (manual + auto-generate)
- [x] Workout session logging
- [x] Analytics dashboard with charts
- [x] Admin panel with moderation tools
- [x] Profile customization
- [x] Real-time search
- [x] Comment system
- [x] PR tracking

### 🚧 Future Enhancements
- [ ] Direct messaging between users
- [ ] Workout challenges and competitions
- [ ] Leaderboards
- [ ] Achievement badges and gamification
- [ ] Streak tracking
- [ ] Mobile app (React Native)
- [ ] Public workout plan sharing


---

## 📱 Key Highlights

### Auto-Workout Generation Algorithm
Selects exercises based on muscle group with balanced distribution:
- **2 Compound exercises**: Multi-joint movements (Bench Press, Squats, Deadlifts)
- **2 Functional exercises**: Movement-based training (Box Jumps, TRX Rows)
- **3 Isolated exercises**: Single-muscle targeting (Bicep Curls, Lateral Raises)

### Workout Summary Auto-Posting
After completing a workout, the system automatically:
1. Calculates total volume (weight × reps across all sets)
2. Formats workout details with sets, reps, and weights
3. Creates and publishes a structured post to the social feed
4. Parses workout summaries for enhanced display rendering

### Real-Time Admin Moderation
- Changes made in admin panel instantly reflect across all user views
- Cascade delete operations maintain database integrity
- Admin middleware protects all sensitive endpoints

---

## 🧑‍💻 Team

**Team Lead & Project Manager**
- **Dylan Liesenfelt** – Full Stack Development
  - Email: dliesenfelt2022@fau.edu / djliesenfelt@gmail.com

**Frontend Engineers**
- **Esteban Santome**
- **Alex Manzanares**


**Backend Engineers**
- **Derik Colucci**
- **Ralph Phicien**

---

## 📄 License

This project is developed as part of an academic software engineering course.

---

## 🙏 Acknowledgments

- **Supabase** for authentication and database services
- **Netlify** and **Railway** for deployment platforms
- **Chart.js** for analytics visualization
- **Lucide** for beautiful icon library

---
