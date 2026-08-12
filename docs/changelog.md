# RecallFlow Frontend Changelog

## [1.0.0] - 2026-08-12

### Initial Release
- **Next.js 16 Setup**: Created decoupled frontend repository using Next.js 16 (App Router), React, and Tailwind CSS.
- **Central API Client**: Implemented `src/lib/api.js` for seamless HTTP REST integration with RecallFlow backend.
- **Dashboard View**: Added metrics overview, today's due revisions list, and study session cards.
- **Courses & Topics Manager**: Built course cards with Spaced Repetition strategy badges (`quick`, `three_month`, `six_month`, `one_year`, `two_year`) and topic management.
- **Revision Manager**: Added sub-tabs for Today, Upcoming, and Overdue revisions with revision completion modals.
- **Analytics & Streaks**: Implemented learning streak tracking, 7-day weekly study bar chart, and 30-day activity heatmap grid.
- **Monthly Calendar Grid**: Created interactive monthly calendar grid aggregating daily study minutes and revision statuses.
- **Global Search**: Built keyword search bar for courses, topics, and study notes.
- **Notifications Drawer**: Added real-time notification drawer for due revisions and overdue warnings.
- **PWA & Mobile Experience (Phase 13)**:
  - Added Web App Manifest (`public/manifest.json`) for standalone PWA installation.
  - Implemented Service Worker (`public/sw.js`) for offline static asset caching.
  - Added `PWAInstaller` component with service worker registration, network offline alert banner, and install prompt.
  - Added `MobileNav` touchscreen bottom navigation bar for mobile devices.
- **Advanced Features (Phase 14)**:
  - Added `FlashcardQuizView` component featuring AI Flashcard card flipper, AI Quiz self-test player, and JSON Data Backup & Restore manager.

