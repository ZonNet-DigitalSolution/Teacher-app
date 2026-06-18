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
    FEEDBACK: "/teachers/review/by/student",
    STUDENTS: "/teachers/review/student",
  },
  HALL: {
    LIST: "/teachers/link/teacher",
    CREATE: "/teachers/link/teacher",
    UPDATE: "/teachers/link/teacher/",
    DELETE: "/teachers/link/teacher/",
    TOGGLE: "/teachers/teacher/link/",
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
    STUDENTS: "/teachers/groups/",
    DELETE: "/teachers/groups/",
    REVIEW: "/teachers/review/student/subject/",
  },
  PACKAGES: {
    LIST: "/teachers/groups/packages",
  },
  CONTENTS: {
    BY_SESSION: "/teachers/sessions/content/",
    ADD: "/teachers/sessions/content/upload-one",
    UPDATE: "teachers/sessions/content/",
    DELETE: "teachers/sessions/content/",
    RECORDINGS: "/teachers/sessions/recordings",
  },
} as const;
