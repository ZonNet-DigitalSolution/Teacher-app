import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TeacherProfile {
  id?: number;
  name: string;
  nameEn: string;
  teacherId: string;
  phone: string;
  email: string;
  country: string;
  joinDate: string;
  workType: string;
  bio: string;
  subject: string;
  profileImage: string | null;
  introVideo: string | null;
  status: 'active' | 'inactive' | string;
  studentsCount: number;
  groupsCount: number;
  reviewsCount: number;
  rating: number;
  sessionsCompleted: number;
}

interface TeacherState extends TeacherProfile {
  isLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  id: undefined,
  name: '',
  nameEn: '',
  teacherId: '',
  phone: '',
  email: '',
  country: '',
  joinDate: '',
  workType: '',
  bio: '',
  subject: '',
  profileImage: null,
  introVideo: null,
  status: 'active',
  studentsCount: 0,
  groupsCount: 0,
  reviewsCount: 0,
  rating: 0,
  sessionsCompleted: 0,
  isLoading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Partial<TeacherProfile>>) {
      return { ...state, ...action.payload };
    },
    setProfileImage(state, action: PayloadAction<string | null>) {
      state.profileImage = action.payload;
    },
    setProfileLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setProfileError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setProfileImage, setProfileLoading, setProfileError } =
  teacherSlice.actions;

export default teacherSlice.reducer;
