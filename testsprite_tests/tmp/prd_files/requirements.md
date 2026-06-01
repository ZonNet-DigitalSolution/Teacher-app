# teacher-app — Product Requirements (source for standardization)

## Overview
A teacher-facing mobile application for the LearnAdolphin online tutoring/learning platform. Built with React Native 0.85 (New Architecture), Expo SDK 56, Expo Router (file-based routing), Redux Toolkit for state, and axios for a remote REST API. Runs on iOS, Android, and Web (react-native-web). The app is a pure client consuming the API at `https://admin.learnadolphin.com/api` (Bearer-token auth, all routes namespaced under `/teachers`).

## Goals
Enable teachers to authenticate, manage their teaching schedule and live sessions, administer student groups, run interactive virtual classrooms, manage private tutoring, handle content/recordings, view & give reviews, and maintain their profile.

## Functional Requirements

### 1. Authentication
- Phone-number entry that checks whether the account has a password set.
- Login via password OR via OTP verification.
- New-user registration and first-time password setup.
- Forgot/reset password via OTP (request OTP, verify OTP, set new password with confirmation).
- Fetch teacher profile after login; logout clears the session.
- Auth state hydrated from secure storage on startup. An AuthGuard redirects unauthenticated users to the login screen and authenticated users into the main tabs.
- A 401 response anywhere clears the session and forces re-login.
- Endpoints: POST /teachers/login, /teachers/login-password, /teachers/verify-otp, /teachers/setup-password, /teachers/register, /teachers/forgot-password, /teachers/verify-forgot-password, /teachers/reset-password, GET /teachers/profile, POST /teachers/logout.

### 2. Schedule / Home
- Daily and weekly views of the teacher's lessons, with timeline entries and lesson cards.
- Ability to edit a lesson.
- Endpoints: GET /teachers/sessions?weekFlag=1, GET /teachers/sessions?date=<iso>.

### 3. Groups
- List subject groups; create a group; view a group's students; delete a group; review students per group.
- Endpoints: GET /teachers/subject/groups, POST /teachers/groups, GET /teachers/groups/{id}/students, DELETE /teachers/groups/{id}, /teachers/review/student/subject/{groupId}.

### 4. Meeting Lobby & Room (Live Classroom)
- Pre-session lobby showing session info and icons.
- Live virtual classroom with: student list panel, chat panel, whiteboard, teaching tools, and interactive in-class games/quizzes including a question builder and game settings.
- End-session modal.

### 5. Session Content
- View learning content attached to a session; upload content via document picker; update/delete content; view recordings.
- Endpoints: GET /teachers/sessions/content/{sessionId}, POST /teachers/sessions/content/upload-one, PUT/DELETE teachers/sessions/content/{contentId}, GET /teachers/sessions/recordings.

### 6. Private Tutoring
- Dashboard with stats and booking requests; upcoming sessions.
- Availability scheduling (day strip, time slots, legend).
- Session log/history with status badges and rating stars.
- Settings for private tutoring.

### 7. Reviews
- View feedback received from students and reviews the teacher gave to students; filter by grade; star ratings.
- Endpoints: GET /teachers/review/by/student, GET /teachers/review/student.

### 8. Hall (external links)
- Manage teacher link "halls": list, create, update, delete, toggle active state, and connect-login that opens an external browser.
- Endpoints: GET/POST /teachers/link/teacher, /teachers/link/teacher/{id}, /teachers/teacher/link/{id}/toggle, POST /teachers/connect/login.

### 9. Library
- Access teacher library via login-link and info (external).
- Endpoints: /teachers/library/login-link, /teachers/library/info.

### 10. Guides
- Teacher help/guides listing. Endpoint: GET /teachers/guides.

### 11. Community
- Community tab and group chat.

### 12. Profile
- View and edit teacher profile; upload profile image; change password.
- Endpoints: GET/PUT /teachers/profile, POST /profile/upload-image, POST /profile/change-password.

## Cross-cutting Requirements
- Global alert system: API errors are surfaced as app-wide alerts via an alert gateway and a GlobalAlert component.
- Reusable UI kit: text fields, password fields, field/error banners, country picker, screen/nav headers, account sheet.
- Theming with light/dark support; custom fonts; splash screen.

## Non-Functional
- Cross-platform (iOS/Android/Web). Web build serves on http://localhost:8081 for browser-based testing.
- Secure token storage via expo-secure-store.
- Request timeout of 15s on the API client.
