import api from "@/api/api-client";
import type { Photo, PhotoResponseDto, UploadPhotoDto, UpdatePhotoDto } from "./types";
import { dtoToPhoto } from "./types";

/**
 * Fetch all wedding photos for the current user
 */
export async function getPhotos(): Promise<Photo[]> {
  const res = await api.get<PhotoResponseDto[]>("/api/wedding/photos");
  return (res.data ?? []).map(dtoToPhoto);
}

/**
 * Upload a new wedding photo with metadata
 */
export async function uploadPhoto(data: UploadPhotoDto): Promise<Photo> {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("caption", data.caption);
  formData.append("aspectRatio", data.aspectRatio);

  const res = await api.post<PhotoResponseDto>("/api/wedding/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return dtoToPhoto(res.data);
}

/**
 * Update photo metadata (caption and aspect ratio)
 */
export async function updatePhoto(id: string, data: UpdatePhotoDto): Promise<Photo> {
  const res = await api.put<PhotoResponseDto>(`/api/wedding/photos/${id}`, data);
  return dtoToPhoto(res.data);
}

/**
 * Delete a wedding photo
 */
export async function deletePhoto(id: string): Promise<void> {
  await api.delete(`/api/wedding/photos/${id}`);
}
