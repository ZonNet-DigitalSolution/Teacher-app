# Push Notifications Implementation Guide

## Overview

Implement push notifications using Expo Notifications.

The flow is:

1. User logs in.
2. Mobile app requests notification permissions.
3. App retrieves Expo Push Token.
4. App sends token to backend.
5. Backend stores token.
6. Backend sends push notifications when events occur.
7. User receives notification.
8. Clicking the notification navigates to the appropriate screen.

---

# Frontend Implementation (Expo React Native)

## Install Dependencies

```bash
npx expo install expo-notifications expo-device expo-constants
```

---

## Notification Service Responsibilities

Create a notification service that provides the following functions:

### configureForegroundNotifications()

Configure notification behavior while the app is open.

Requirements:

* Show notification banner.
* Show notification in notification center.
* Play notification sound.
* Update app badge.

Must be called once during app startup.

---

### registerForPushNotifications()

Responsibilities:

1. Skip execution when running on Expo Go.
2. Create Android notification channel.
3. Check notification permissions.
4. Request permissions if needed.
5. Get Expo Project ID.
6. Retrieve Expo Push Token.
7. Send token to backend.
8. Return token.

Backend endpoint:

```http
POST /teachers/device/register
```

Request body:

```json
{
  "token": "ExponentPushToken[...]",
  "platform": "android",
  "appVersion": "1.0.0"
}
```

---

### registerNotificationResponseHandler(router)

Responsibilities:

* Listen for notification clicks.
* Read notification payload.
* Navigate user to correct screen.

Example payload:

```json
{
  "type": "private_session",
  "action": "new_booking"
}
```

Navigation:

```ts
router.push("/(tabs)/private?tab=new");
```

Must return cleanup function to remove listener.

---

### sendTestPushNotification()

Responsibilities:

* Ensure device token is registered.
* Trigger backend endpoint.

```http
POST /teachers/notifications/test-push
```

Used only for testing.

---

## App Initialization

Inside:

```tsx
app/_layout.tsx
```

Requirements:

```ts
configureForegroundNotifications();

registerNotificationResponseHandler(router);
```

When user authentication succeeds:

```ts
registerForPushNotifications();
```

---

# Backend Implementation

## Database

Store device tokens.

Example table:

```sql
CREATE TABLE device_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    platform VARCHAR(20),
    app_version VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

Rules:

* One user can have multiple devices.
* Prevent duplicate tokens.
* Update existing token if already registered.

---

## Register Device Endpoint

### Endpoint

```http
POST /teachers/device/register
```

### Request

```json
{
  "token": "ExponentPushToken[...]",
  "platform": "android",
  "appVersion": "1.0.0"
}
```

### Responsibilities

* Validate token.
* Associate token with authenticated user.
* Store/update token.
* Return success response.

Example:

```json
{
  "success": true
}
```

---

## Send Push Notification Service

Create a dedicated service:

```ts
NotificationService
```

Responsibilities:

* Retrieve user device tokens.
* Build notification payload.
* Send payload to Expo Push API.
* Handle failures.
* Log delivery errors.

Payload example:

```json
{
  "to": "ExponentPushToken[...]",
  "title": "New Booking",
  "body": "A new private session has been booked.",
  "data": {
    "type": "private_session",
    "action": "new_booking"
  }
}
```

---

## Test Push Endpoint

### Endpoint

```http
POST /teachers/notifications/test-push
```

Responsibilities:

* Get authenticated user's device tokens.
* Send test notification.
* Return Expo response.

---

## Business Events

Send notifications when:

### New Booking

```json
{
  "type": "private_session",
  "action": "new_booking"
}
```

---

### Teacher Assigned

```json
{
  "type": "private_session",
  "action": "teacher_assigned"
}
```

---

### Trial Request

```json
{
  "type": "private_session",
  "action": "trial_request_new"
}
```

---

# End-to-End Flow

```text
App Start
    │
    ▼
Configure Notification Handlers
    │
    ▼
User Login
    │
    ▼
Register Device Token
    │
    ▼
Store Token In Database
    │
    ▼
Business Event Occurs
    │
    ▼
Backend Notification Service
    │
    ▼
Expo Push API
    │
    ▼
Mobile Device
    │
    ├─ App Open
    │      │
    │      ▼
    │  Show Notification
    │
    └─ User Clicks
           │
           ▼
      Navigate To Screen
```
