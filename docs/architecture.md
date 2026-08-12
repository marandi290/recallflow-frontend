# RecallFlow Frontend Architecture

## Overview
`recallflow-frontend` is a modern, responsive web application built with **Next.js 16 (App Router)**, **React**, and **Tailwind CSS**. It serves as the user interface for the RecallFlow Spaced Repetition Study & Revision Engine.

---

## 🏗️ System Architecture

```
User Interface (Next.js 16 App Router)
         │
         ▼
    App Shell (src/app/page.js)
  ┌──────┴───────────────────────────────────────────────────────┐
  │ State Management (User, Courses, Topics, Revisions, Analytics)│
  └──────┬───────────────────────────────────────────────────────┘
         │
         ├──► Component Views (src/components/*.jsx)
         │       ├── DashboardView
         │       ├── CoursesView
         │       ├── RevisionsView
         │       ├── AnalyticsView
         │       ├── CalendarView
         │       └── SearchView
         │
         └──► API Client Layer (src/lib/api.js)
                 │
                 ▼
     HTTP REST Requests (fetch API with Bearer JWT Header)
                 │
                 ▼
     RecallFlow Backend (http://localhost:3000/api/v1)
```

---

## 🎨 Design System & Styling

- **Theme Tokens**: Configured in `src/app/globals.css` using custom dark palette (Slate-950 background, Slate-900 surface cards, Indigo-600 primary accents, Emerald-500 success badges, Amber-500 warning alerts).
- **Responsive Layout**: Fluid grid adapting dynamically across mobile, tablet, and desktop breakpoints.
- **Typography**: System font stack with high legibility and kerning.

---

## 🔒 Authentication & Persistence

- **JWT Storage**: Tokens stored in `localStorage.recallflow_token`.
- **User Session**: User profile cached in `localStorage.recallflow_user`.
- **Bearer Interceptor**: `src/lib/api.js` automatically injects `Authorization: Bearer <token>` for all outgoing HTTP requests.
