# RecallFlow Frontend Components Guide

## Component Directory Structure (`src/components/`)

### 1. `Header.jsx`
- **Purpose**: Top navigation header bar.
- **Features**:
  - App branding logo.
  - Quick action buttons ("Log Session", "Add Course").
  - Global search bar trigger.
  - Notifications bell button with live unread badge count.
  - User session widget (Sign In button / User Profile & Logout button).

### 2. `Sidebar.jsx`
- **Purpose**: Left navigation sidebar for desktop layouts.
- **Features**:
  - Interactive navigation items: Dashboard, Courses & Topics, Revision Manager, Analytics & Streaks, Monthly Calendar, Global Search.
  - API connection health indicator.

### 3. `DashboardView.jsx`
- **Purpose**: Daily main dashboard screen.
- **Features**:
  - Stat cards: Today's study time (minutes), Due Today revisions, Overdue/missed count, Upcoming revisions.
  - Today's Due Revisions list with "Mark Done" action button.
  - Today's logged study session cards with difficulty badge and notes.

### 4. `CoursesView.jsx`
- **Purpose**: Course and topic hierarchy manager.
- **Features**:
  - Course cards showing title, category, goal, duration in days, and algorithm strategy (`quick`, `three_month`, `six_month`, `one_year`, `two_year`).
  - Expandable topic list per course.
  - Delete course and topic handlers.
  - "Create Course" and "Add Topic" triggers.

### 5. `RevisionsView.jsx`
- **Purpose**: Spaced repetition revision management screen.
- **Features**:
  - Sub-tab switcher: **Today**, **Upcoming**, **Overdue/Missed**.
  - Revision item cards with topic title, course name, revision number, scheduled date, and completion status.
  - "Complete Review" modal trigger.

### 6. `AnalyticsView.jsx`
- **Purpose**: Analytics and learning streak dashboard.
- **Features**:
  - Overview cards: Learning streak (consecutive days), total study hours, completion rate %, finished courses.
  - 7-day weekly study duration bar chart.
  - 30-day activity heatmap grid.

### 7. `CalendarView.jsx`
- **Purpose**: Monthly calendar grid view.
- **Features**:
  - Month and year navigation controls.
  - 7-column monthly day grid.
  - Each day cell displays total study minutes, completed revisions badge, missed revisions alert, and pending revisions.

### 8. `SearchView.jsx`
- **Purpose**: Global keyword search screen.
- **Features**:
  - Search input box.
  - Grouped search results for Courses, Topics, and Study Notes.

### 9. `Modals.jsx`
Contains all dialogs and drawer panels:
- `StudyLoggerModal`: Form to log study sessions with topic selector, duration, difficulty, and study notes.
- `CourseModal`: Form to create courses with algorithm selector.
- `TopicModal`: Form to add topics to a course.
- `CompleteRevisionModal`: Form to mark revisions completed with optional revision notes.
- `AuthModal`: User login and registration dialog.
- `NotificationsModal`: Notification drawer showing due/missed revision alerts and daily study reminders.
