# RecallFlow API Integration Guide

## Overview
All backend HTTP communication is encapsulated in [`src/lib/api.js`](file:///C:/Users/Prakash/Personal%20Projects/recallflow-frontend/src/lib/api.js). The default base URL points to `http://localhost:3000/api/v1` (configurable via `NEXT_PUBLIC_API_URL`).

---

## 📡 API Endpoint Mapping

| Domain | Frontend Method | Backend Endpoint | Description |
|---|---|---|---|
| **Auth** | `api.register(data)` | `POST /auth/register` | User registration |
| **Auth** | `api.login(data)` | `POST /auth/login` | User login |
| **Auth** | `api.getProfile()` | `GET /auth/me` | Current user profile |
| **Courses** | `api.getCourses(userId)` | `GET /courses?user_id=1` | Get courses for user |
| **Courses** | `api.createCourse(data)` | `POST /courses` | Create new course |
| **Courses** | `api.deleteCourse(id)` | `DELETE /courses/:id` | Delete course |
| **Topics** | `api.getTopics(courseId)` | `GET /topics?course_id=1` | Get topics for course |
| **Topics** | `api.createTopic(data)` | `POST /topics` | Create new topic |
| **Study Entries** | `api.createStudyEntry(data)` | `POST /study-entries` | Record study session & calculate revisions |
| **Revisions** | `api.getTodayRevisions(userId)` | `GET /revisions/today?user_id=1` | Get revisions due today |
| **Revisions** | `api.getUpcomingRevisions(userId)` | `GET /revisions/upcoming?user_id=1` | Get upcoming revisions |
| **Revisions** | `api.getMissedRevisions(userId)` | `GET /revisions/missed?user_id=1` | Get overdue/missed revisions |
| **Revisions** | `api.completeRevision(id, notes)` | `PATCH /revisions/:id/complete` | Complete revision with notes |
| **Dashboard** | `api.getTodayDashboard(userId)` | `GET /dashboard/today?user_id=1` | Today's aggregate overview |
| **Analytics** | `api.getAnalyticsOverview(userId)` | `GET /analytics/overview?user_id=1` | Overview metrics & streak |
| **Analytics** | `api.getWeeklyAnalytics(userId)` | `GET /analytics/weekly?user_id=1` | 7-day study minutes breakdown |
| **Analytics** | `api.getMonthlyAnalytics(userId)` | `GET /analytics/monthly?user_id=1` | 30-day study activity breakdown |
| **Calendar** | `api.getCalendar(userId, y, m)` | `GET /calendar?user_id=1&year=Y&month=M` | Monthly calendar grid |
| **Search** | `api.search(userId, query)` | `GET /search?user_id=1&q=query` | Global keyword search |
| **Notifications** | `api.getNotifications(userId)` | `GET /notifications?user_id=1` | Daily revision & streak alerts |
