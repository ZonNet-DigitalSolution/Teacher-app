# Push Notifications — Frontend Implementation Guide

How push notifications are wired up in the Teacher App (Expo SDK 56).

---

## File Structure

```
services/
  pushNotificationsService.ts   ← core logic (permission, token, navigation)

hooks/
  use-push-notifications.ts     ← React hook that drives the service

app/
  _layout.tsx                   ← where the hook is called (once, on app mount)

docs/
  push-notifications.md         ← architecture reference
  push-notifications-backend.md ← backend implementation guide
  push-notifications-frontend.md← this file
```

---

## How It Works

```
App opens
  └── RootLayoutNav renders
        └── usePushNotifications()
              ├── configureForegroundNotifications()   ← always
              ├── registerNotificationResponseHandler() ← always
              └── registerForPushNotifications()        ← only when authenticated
```

The hook handles everything. You never call the service functions directly from screens.

---

## The Hook — `usePushNotifications`

**File:** `hooks/use-push-notifications.ts`

```ts
export function usePushNotifications() {
  const router = useRouter();
  const didRegisterToken = useRef(false);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized   = useSelector((s: RootState) => s.auth.isInitialized);

  // Effect 1 — runs once on mount
  // Sets up foreground display + tap navigation listener
  useEffect(() => {
    configureForegroundNotifications();
    const removeListener = registerNotificationResponseHandler(router);
    return () => removeListener();
  }, [router]);

  // Effect 2 — runs when auth state changes
  // Registers the device token once after login
  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      if (!isAuthenticated) didRegisterToken.current = false;
      return;
    }
    if (didRegisterToken.current) return;
    didRegisterToken.current = true;

    registerForPushNotifications().then((token) => {
      if (!token) didRegisterToken.current = false;
    });
  }, [isAuthenticated, isInitialized]);
}
```

### Key design decisions

| Decision | Why |
|---|---|
| `didRegisterToken` ref | Prevents registering the same token twice per session |
| Resets ref on logout | So the next login re-registers cleanly |
| Returns `null` silently on failure | No crash — the app works fine without push |
| Cleanup on unmount | Prevents memory leaks from the tap listener |

---

## Where It's Called

**File:** `app/_layout.tsx`

```tsx
function RootLayoutNav() {
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useAuthGuard();
  usePushNotifications();   // ← here

  if (!isInitialized) return <AppLoadingScreen />;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        ...
      </Stack>
      <GlobalAlert />
      <StatusBar style="auto" />
    </>
  );
}
```

Called at the root layout level so it runs for the entire app lifetime — one instance, never remounted.

---

## The Service — `pushNotificationsService.ts`

### `configureForegroundNotifications()`

Called once on mount. Tells the OS to show banners and play sounds even when the app is open.

```ts
configureForegroundNotifications();
// After this: notifications show as banners in foreground
```

---

### `registerForPushNotifications()`

Called after login. Runs through these checks in order:

```
Expo Go?         → return null (silent)
Android channel  → create "private_sessions" channel
Permission?      → request if not granted
                 → return null if denied
Project ID?      → read from app.json
                 → return null if missing
Get token        → ExponentPushToken[...]
Register         → POST /teachers/device/register
Return token
```

Returns `string` on success, `null` on any failure — never throws.

---

### `registerNotificationResponseHandler(router)`

Called once on mount. Returns a cleanup function.

```ts
const cleanup = registerNotificationResponseHandler(router);
// Now: tapping a notification navigates automatically

cleanup(); // call this on unmount
```

**Navigation logic:**

```
Notification tapped
  └── read data.type + data.action_type
        └── type === "private_session"
            AND action_type in { new_booking, teacher_assigned,
                                 trial_request_new, test_push }
              → router.push("/(tabs)/private?tab=new")
```

Any other notification type → no navigation (notification still shows).

---

### `sendTestPushNotification()`

Only for development. Registers the device then asks the backend to send a test push.

```ts
// Attach to a button temporarily during development
await sendTestPushNotification();
```

---

## Environment Guard

All functions check `Constants.appOwnership === "expo"` first.

| Environment | Behavior |
|---|---|
| **Expo Go** | Returns `null` / no-op — no crash |
| **Dev build** (`npx expo run:android`) | Full push flow works |
| **Preview / Production build** | Full push flow works |

> Push notifications require a **dev build or higher** — they will never work in Expo Go.

---

## Android Notification Channel

Created automatically by `registerForPushNotifications()` on first run.

| Property | Value |
|---|---|
| Channel ID | `private_sessions` |
| Name | `Private sessions` |
| Importance | `HIGH` (shows as heads-up banner) |
| Vibration | `[0, 250, 250, 250]` |
| Light color | `#D18C2D` (amber) |

> The backend must send `"channelId": "private_sessions"` in the push payload for this channel to be used.

---

## How to Add a New Navigation Target

If you want a new notification type to navigate somewhere else:

**1 — Add the `action_type` to the Set in the service:**

```ts
// services/pushNotificationsService.ts
const PRIVATE_SESSION_ACTIONS = new Set([
  "new_booking",
  "teacher_assigned",
  "trial_request_new",
  "test_push",
  "your_new_action",   // ← add here
]);
```

**2 — Add the navigation case in the handler:**

```ts
// inside registerNotificationResponseHandler
const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data as Record<string, unknown>;

  if (data.type === "private_session" && PRIVATE_SESSION_ACTIONS.has(data.action_type as string)) {
    router.push("/(tabs)/private?tab=new");
  }

  if (data.type === "your_new_type") {
    router.push("/your-screen");   // ← add your route
  }
});
```

---

## Testing Push Notifications

### Requirements

- Real Android or iOS device (emulator won't receive push)
- Dev build or higher (not Expo Go)

### Step 1 — Build and install

```bash
npx expo run:android
# or
eas build --profile development --platform android
```

### Step 2 — Get the push token

After login, the token is registered automatically. Check Metro logs for:

```
LOG  [push] registering device → { fcm_token: "ExponentPushToken[...]", ... }
```

### Step 3 — Send a test notification

**Option A — use the app's test function** (attach to a button temporarily):

```ts
import { sendTestPushNotification } from "@/services/pushNotificationsService";

<Button onPress={sendTestPushNotification} title="Test Push" />
```

**Option B — curl with the token:**

```bash
curl -X POST https://exp.host/--/api/v2/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ExponentPushToken[your-token]",
    "title": "حجز جديد",
    "body": "طالب طلب حصة فردية",
    "channelId": "private_sessions",
    "data": {
      "type": "private_session",
      "action_type": "new_booking"
    }
  }'
```

**Option C — Expo push tool:**

Go to [expo.dev/notifications](https://expo.dev/notifications), paste the token, fill in the fields, send.

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| Token is `null` | Running on Expo Go | Use dev build |
| Token is `null` | Permission denied | User must allow notifications in device settings |
| Token is `null` | Missing `projectId` in `app.json` | Run `eas init` to link the project |
| Notification shows but no navigation | `action_type` not in the Set | Add it to `PRIVATE_SESSION_ACTIONS` |
| Notification doesn't show in foreground | `configureForegroundNotifications()` not called | Check `_layout.tsx` — the hook must run |
| Android notification uses wrong sound/channel | Backend not sending `channelId` | Backend must include `"channelId": "private_sessions"` |

---

## Checklist

- [ ] `usePushNotifications()` is called in `app/_layout.tsx`
- [ ] App has a dev build (not Expo Go)
- [ ] `projectId` is set in `app.json` under `expo.extra.eas`
- [ ] Backend registers token via `POST /teachers/device/register`
- [ ] Backend sends `channelId: "private_sessions"` in all push payloads
- [ ] Backend sends `type` and `action_type` in the `data` field
- [ ] Tested on a real device
