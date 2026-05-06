export const API_ENDPOINTS = {
  AUTH: {
    CHECK_PHONE: "/teachers/login",
    LOGIN_PASSWORD: "/teachers/login-password",
    VERIFY_OTP: "/teachers/verify-otp",
    SETUP_PASSWORD: "/teachers/setup-password",
    REGISTER: "/teachers/register",
    FORGOT_PASSWORD: "/teachers/forgot-password",
    VERIFY_FORGOT_PASSWORD: "/teachers/verify-forgot-password",
    RESET_PASSWORD: "/teachers/reset-password",
    PROFILE: "/teachers/profile",
    UPDATE_PROFILE: "/teachers/profile",
    UPLOAD_IMAGE: "/profile/upload-image",
    CHANGE_PASSWORD: "/profile/change-password",
    LOGOUT: "/teachers/logout",
  },
  SCHEDULE: {
    SESSIONS: "/teachers/sessions",
  },
  REVIEWS: {
    FEEDBACK: "/teachers/review/by/student",   // feedback FROM students TO teacher
    STUDENTS: "/teachers/review/student",       // reviews teacher gave to students
  },
  HALL: {
    LIST: "/teachers/link/teacher",
    CREATE: "/teachers/link/teacher",
    UPDATE: "/teachers/link/teacher/",    // append id, send _method: PUT
    DELETE: "/teachers/link/teacher/",    // append id
    TOGGLE: "/teachers/teacher/link/",    // append id/toggle
    CONNECT_LOGIN: "/teachers/connect/login",
  },
  GUIDES: {
    LIST: "/teachers/guides",
  },
  LIBRARY: {
    LOGIN_LINK: "/teachers/library/login-link",
    INFO: "/teachers/library/info",
  },
  GROUPS: {
    LIST: "/teachers/subject/groups",
    CREATE: "/teachers/groups",
    STUDENTS: "/teachers/groups/",      // append groupId/students
    DELETE: "/teachers/groups/",        // append groupId
    REVIEW: "/teachers/review/student/subject/",  // append groupId
  },
  PACKAGES: {
    LIST: "/teachers/groups/packages",
  },
  CONTENTS: {
    BY_SESSION: "/teachers/sessions/content/",       // append sessionId
    ADD: "/teachers/sessions/content/upload-one",
    UPDATE: "teachers/sessions/content/",            // append contentId
    DELETE: "teachers/sessions/content/",            // append contentId
    RECORDINGS: "/teachers/sessions/recordings",
  },
} as const;
