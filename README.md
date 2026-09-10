# RecallFlow Frontend

RecallFlow Frontend is the modern, responsive web application for the **RecallFlow Spaced Repetition Study & Revision Platform**.

Built with **Next.js 16 (App Router)**, **React**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🚀 Features

- **Daily Study Dashboard**: Overview of today's study duration, due revisions, overdue alerts, and today's logged sessions.
- **Course & Topic Hierarchy**: Manage courses, algorithm strategies (`quick`, `three_month`, `six_month`, `one_year`, `two_year`), and subject topics.
- **Spaced Repetition Revision Manager**: Filter Today, Upcoming, and Overdue reviews with completion notes.
- **Analytics & Learning Streaks**: Track consecutive study streaks, revision completion rates %, 7-day study bar charts, and 30-day activity heatmaps.
- **Monthly Calendar Grid**: Month-by-month grid displaying daily study sessions and revision status indicators.
- **Global Search**: Search across courses, topics, study notes, and revision notes.
- **Notifications Drawer**: Daily reminder alerts for due revisions and overdue tasks.
- **JWT Authentication**: Login and registration modals with JWT session persistence.

---

## 🛠️ Getting Started (Local Setup)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ LTS)
- [npm](https://www.npmjs.com/) (version 9+)
- Ensure the **RecallFlow Backend** (`recallflow-backend`) is running at `http://localhost:3000`.

### 2. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd "C:\Users\Prakash\Personal Projects\recallflow-frontend"
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file by copying `.env.example`:
```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

The default backend API URL is:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 4. Running the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
- **Web App**: [http://localhost:3001](http://localhost:3001) (or `http://localhost:3000` if port 3000 is available)

### 5. Production Build & Execution
```bash
npm run build
npm start
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs) folder:

- [`docs/architecture.md`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs/architecture.md) — System architecture, design tokens, and state management
- [`docs/components.md`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs/components.md) — Comprehensive component guide
- [`docs/api-integration.md`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs/api-integration.md) — API client endpoints mapping
- [`docs/development-plan.md`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs/development-plan.md) — Frontend master plan and future roadmap
- [`docs/changelog.md`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/docs/changelog.md) — Release notes and change history
