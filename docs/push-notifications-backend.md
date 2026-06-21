# Push Notifications — Backend Implementation

---

## Endpoints Required

| Method | Endpoint | Called when |
|---|---|---|
| `POST` | `/teachers/device/register` | Teacher logs in |
| `POST` | `/teachers/notifications/test-push` | Developer testing |

---

## 1. Database

```sql
CREATE TABLE teacher_devices (
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id       BIGINT        NOT NULL,
    fcm_token        VARCHAR(512)  NOT NULL,
    device_type      VARCHAR(10)   NOT NULL,   -- "android" or "ios"
    device_name      VARCHAR(255)  NULL,
    platform_version VARCHAR(50)   NULL,
    app_version      VARCHAR(20)   NULL,
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_fcm_token (fcm_token),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id)
);
```

---

## 2. Register Device

### `POST /teachers/device/register`

**Auth:** Bearer token (teacher must be logged in)

**Request body — sent by the app:**

```json
{
  "fcm_token":        "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "device_type":      "android",
  "device_name":      "Samsung Galaxy S23",
  "platform_version": "14",
  "app_version":      "1.0.0"
}
```

**Validation:**

```
fcm_token        required | string | max:512
device_type      required | in:android,ios
device_name      nullable | string | max:255
platform_version nullable | string | max:50
app_version      nullable | string | max:20
```

**Logic — upsert on `fcm_token`:**

```
1. Get teacher_id from auth token
2. Find row where fcm_token = request.fcm_token
   - Found  → update teacher_id + metadata + updated_at
   - Not found → insert new row
3. Return { success: true }
```

**Laravel example:**

```php
public function registerDevice(Request $request)
{
    $request->validate([
        'fcm_token'        => 'required|string|max:512',
        'device_type'      => 'required|in:android,ios',
        'device_name'      => 'nullable|string|max:255',
        'platform_version' => 'nullable|string|max:50',
        'app_version'      => 'nullable|string|max:20',
    ]);

    TeacherDevice::updateOrCreate(
        ['fcm_token' => $request->fcm_token],
        [
            'teacher_id'       => auth()->id(),
            'device_type'      => $request->device_type,
            'device_name'      => $request->device_name,
            'platform_version' => $request->platform_version,
            'app_version'      => $request->app_version,
        ]
    );

    return response()->json(['success' => true]);
}
```

**Success response:**

```json
{ "success": true }
```

---

## 3. Send Push Notification (Internal Service)

Used internally whenever a business event happens. Not a public endpoint.

### Expo Push API

```
POST https://exp.host/--/api/v2/push/send
Content-Type: application/json
```

### Payload structure

```json
{
  "to":        "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title":     "حجز جديد",
  "body":      "طالب طلب حصة فردية في الرياضيات",
  "channelId": "private_sessions",
  "data": {
    "type":   "private_session",
    "action": "new_booking"
  }
}
```

> ⚠️ `channelId: "private_sessions"` is required on Android — must match the channel the app registers.
> ⚠️ `data.type` and `data.action` are required for the app to navigate automatically.

### Recognized `action` values

| Value | When to send |
|---|---|
| `new_booking` | Student books a private session |
| `teacher_assigned` | Teacher is assigned to a session |
| `trial_request_new` | New trial session request arrives |
| `test_push` | Developer test only |

### Laravel example — send to all teacher devices

```php
use Illuminate\Support\Facades\Http;

function notifyTeacher(int $teacherId, string $title, string $body, string $action): void
{
    $tokens = TeacherDevice::where('teacher_id', $teacherId)
        ->pluck('fcm_token')
        ->toArray();

    if (empty($tokens)) return;

    $messages = array_map(fn($token) => [
        'to'        => $token,
        'title'     => $title,
        'body'      => $body,
        'channelId' => 'private_sessions',
        'data'      => [
            'type'   => 'private_session',
            'action' => $action,
        ],
    ], $tokens);

    $response = Http::post('https://exp.host/--/api/v2/push/send', $messages);

    // Clean up stale tokens
    foreach ($response->json('data', []) as $i => $result) {
        if (($result['details']['error'] ?? '') === 'DeviceNotRegistered') {
            TeacherDevice::where('fcm_token', $tokens[$i])->delete();
        }
    }
}
```

### Usage in event handlers

```php
// New private session booking
notifyTeacher(
    teacherId: $booking->teacher_id,
    title:     'حجز جديد',
    body:      "طالب طلب حصة في {$booking->subject}",
    action:    'new_booking'
);

// Teacher assigned to session
notifyTeacher(
    teacherId: $session->teacher_id,
    title:     'تم تعيينك لحصة جديدة',
    body:      "تم تعيينك في حصة {$session->subject}",
    action:    'teacher_assigned'
);

// New trial request
notifyTeacher(
    teacherId: $trial->teacher_id,
    title:     'طلب حصة تجريبية',
    body:      "طالب طلب حصة تجريبية في {$trial->subject}",
    action:    'trial_request_new'
);
```

---

## 4. Test Push Endpoint

### `POST /teachers/notifications/test-push`

**Auth:** Bearer token

**Request body — sent by the app:**

```json
{
  "title": "اختبار إشعار",
  "body":  "ده إشعار تجربة على موبايل المدرس"
}
```

**Laravel example:**

```php
public function testPush(Request $request)
{
    $tokens = TeacherDevice::where('teacher_id', auth()->id())
        ->pluck('fcm_token')
        ->toArray();

    if (empty($tokens)) {
        return response()->json(['success' => false, 'message' => 'No devices registered'], 400);
    }

    $messages = array_map(fn($token) => [
        'to'        => $token,
        'title'     => $request->input('title', 'Test'),
        'body'      => $request->input('body', 'Test notification'),
        'channelId' => 'private_sessions',
        'data'      => [
            'type'   => 'private_session',
            'action' => 'test_push',
        ],
    ], $tokens);

    Http::post('https://exp.host/--/api/v2/push/send', $messages);

    return response()->json([
        'success' => true,
        'data'    => [
            'device_count' => count($tokens),
            'sent_count'   => count($tokens),
        ],
    ]);
}
```

**Success response:**

```json
{
  "success": true,
  "data": {
    "device_count": 2,
    "sent_count": 2
  }
}
```

---

## 5. Routes

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/teachers/device/register',         [NotificationController::class, 'registerDevice']);
    Route::post('/teachers/notifications/test-push', [NotificationController::class, 'testPush']);
});
```

---

## 6. DeviceNotRegistered — Handle Stale Tokens

When the app is uninstalled or the token expires, Expo returns this error:

```json
{
  "status": "error",
  "details": { "error": "DeviceNotRegistered" }
}
```

**Always delete the token immediately when you see this.** If you don't, every future push to that token fails silently and wastes API calls.

```php
foreach ($response->json('data', []) as $i => $result) {
    if (($result['details']['error'] ?? '') === 'DeviceNotRegistered') {
        TeacherDevice::where('fcm_token', $tokens[$i])->delete();
    }
}
```

---

## 7. Checklist

- [ ] Create `teacher_devices` table with unique constraint on `fcm_token`
- [ ] `POST /teachers/device/register` — upsert on `fcm_token`
- [ ] `POST /teachers/notifications/test-push` — for dev testing
- [ ] `notifyTeacher()` helper sends to all teacher devices
- [ ] Include `channelId: "private_sessions"` in every payload
- [ ] Include `type: "private_session"` and `action` in `data`
- [ ] Delete token on `DeviceNotRegistered` error
- [ ] Wire `notifyTeacher()` to: `new_booking`, `teacher_assigned`, `trial_request_new`
