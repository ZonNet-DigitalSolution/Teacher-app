import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "./api";

export type UpdateUserPayload = {
  name?: string;
  nameEn?: string;
  email?: string;
  country?: string;
  bio?: string;
  workType?: string;
};

export const profileService = {
  async updateUser(payload: UpdateUserPayload) {
    const body: Record<string, string> = { _method: "PUT" };
    if (payload.name) body.full_name_ar = payload.name;
    if (payload.nameEn) body.full_name_en = payload.nameEn;
    if (payload.email) body.email = payload.email;
    if (payload.country) body.country = payload.country;
    if (payload.bio) body.bio = payload.bio;
    if (payload.workType) body.employment_type = payload.workType;
    const { data } = await api.post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, body);
    return data?.data ?? data;
  },

  async updateUserImage(imageUri: string, imageName = "avatar.jpg") {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: imageName,
      type: "image/jpeg",
    } as any);
    formData.append("_method", "PATCH");
    const { data } = await api.post(API_ENDPOINTS.AUTH.UPLOAD_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data ?? data;
  },
};
