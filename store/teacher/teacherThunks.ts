import { API_ENDPOINTS } from '@/constants/endpoints';
import { api, normalizeError } from '@/services/api';
import { profileService, UpdateUserPayload } from '@/services/profileService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setProfile,
  setProfileError,
  setProfileImage,
  setProfileLoading,
  TeacherProfile,
} from './teacherSlice';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiToProfile(data: any): Partial<TeacherProfile> {
  return {
    id: data.id,
    name: data.full_name_ar ?? data.name ?? '',
    nameEn: data.full_name_en ?? '',
    teacherId: String(data.id ?? ''),
    phone: data.phone_number ?? data.phone ?? '',
    email: data.email ?? '',
    country: data.country ?? '',
    joinDate: data.date_of_joining
      ? new Date(data.date_of_joining).toLocaleDateString('ar-EG')
      : '',
    workType: data.employment_type ?? '',
    bio: data.bio ?? '',
    subject: data.subject ?? data.class_name ?? '',
    profileImage: data.profile_pic ?? null,
    introVideo: data.intro_video ?? null,
    status: data.status ?? 'active',
    studentsCount: data.students_count ?? data.number_of_students ?? 0,
    groupsCount: data.groups_count ?? data.number_of_groups ?? 0,
    reviewsCount: data.reviews_count ?? data.number_of_sessions_completed ?? 0,
    rating: data.rating ?? data.average_rating ?? 0,
    sessionsCompleted: data.number_of_sessions_completed ?? 0,
  };
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchProfile = createAsyncThunk(
  'teacher/fetchProfile',
  async (_, { dispatch }) => {
    try {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));

      // Fetch profile + groups + reviews in parallel
      const [profileRes, groupsRes, reviewsRes] = await Promise.allSettled([
        api.get<{ data: any }>(API_ENDPOINTS.AUTH.PROFILE),
        api.get<{ data: any }>(API_ENDPOINTS.GROUPS.LIST),
        api.get<{ data: any[] }>(API_ENDPOINTS.REVIEWS.FEEDBACK),
      ]);

      const profileData =
        profileRes.status === 'fulfilled'
          ? profileRes.value.data.data ?? profileRes.value.data
          : {};

      const profile = mapApiToProfile(profileData);

      // Derive real counts from groups list
      if (groupsRes.status === 'fulfilled') {
        const groupsRaw = groupsRes.value.data.data?.groups ?? groupsRes.value.data.data ?? groupsRes.value.data;
        const groups: any[] = Array.isArray(groupsRaw) ? groupsRaw : [];
        profile.groupsCount = groups.length;
        profile.studentsCount = groups.reduce(
          (sum, g) => sum + (g.student_count ?? 0),
          0,
        );
      }

      // Derive real reviews count
      if (reviewsRes.status === 'fulfilled') {
        const reviewsRaw = reviewsRes.value.data.data ?? reviewsRes.value.data;
        const reviews: any[] = Array.isArray(reviewsRaw) ? reviewsRaw : [];
        profile.reviewsCount = reviews.length;
      }

      dispatch(setProfile(profile));
      return profile;
    } catch (err) {
      dispatch(setProfileError(normalizeError(err)));
    } finally {
      dispatch(setProfileLoading(false));
    }
  },
);

export const updateProfile = createAsyncThunk(
  'teacher/updateProfile',
  async (
    payload: Partial<TeacherProfile> & { imageUri?: string; imageName?: string },
    { dispatch },
  ) => {
    try {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));

      const formData = new FormData();
      if (payload.name) formData.append('full_name_ar', payload.name);
      if (payload.nameEn) formData.append('full_name_en', payload.nameEn);
      if (payload.email) formData.append('email', payload.email);
      if (payload.country) formData.append('country', payload.country);
      if (payload.bio) formData.append('bio', payload.bio);
      if (payload.workType) formData.append('employment_type', payload.workType);

      if (payload.imageUri) {
        formData.append('profile_pic', {
          uri: payload.imageUri,
          name: payload.imageName ?? 'avatar.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const { data } = await api.put<{ data: any }>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      const profile = mapApiToProfile(data.data ?? data);
      dispatch(setProfile(profile));
      return profile;
    } catch (err) {
      dispatch(setProfileError(normalizeError(err)));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  },
);

export const updateProfileData = createAsyncThunk(
  'teacher/updateProfileData',
  async (payload: UpdateUserPayload, { dispatch }) => {
    try {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));
      const raw = await profileService.updateUser(payload);
      const profile = mapApiToProfile(raw);
      dispatch(setProfile(profile));
      return profile;
    } catch (err) {
      dispatch(setProfileError(normalizeError(err)));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  },
);

export const updateProfileImage = createAsyncThunk(
  'teacher/updateProfileImage',
  async (
    { imageUri, imageName }: { imageUri: string; imageName?: string },
    { dispatch },
  ) => {
    try {
      dispatch(setProfileLoading(true));
      dispatch(setProfileError(null));
      const raw = await profileService.updateUserImage(imageUri, imageName);
      const imageUrl: string | null =
        raw?.profile_pic ?? raw?.image ?? raw?.profileImage ?? null;
      dispatch(setProfileImage(imageUrl));
      return imageUrl;
    } catch (err) {
      dispatch(setProfileError(normalizeError(err)));
      throw err;
    } finally {
      dispatch(setProfileLoading(false));
    }
  },
);
