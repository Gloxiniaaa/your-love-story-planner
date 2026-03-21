import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as photoApi from "./api";
import type { Photo, UploadPhotoDto, UpdatePhotoDto } from "./types";

const PHOTOS_KEY = ["photos", "wedding"] as const;

/**
 * Fetch all wedding photos
 * Only enabled when user has authentication token
 */
export function usePhotos() {
  return useQuery<Photo[], Error>({
    queryKey: PHOTOS_KEY,
    queryFn: photoApi.getPhotos,
    enabled: !!localStorage.getItem("access_token"),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Upload a new wedding photo
 * Optimistically prepends to cache on success
 */
export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: photoApi.uploadPhoto,
    onSuccess: (newPhoto) => {
      queryClient.setQueryData<Photo[]>(PHOTOS_KEY, (old) => [newPhoto, ...(old ?? [])]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY });
    },
  });
}

/**
 * Update photo metadata (caption and aspect ratio)
 * Uses optimistic update with rollback on error
 */
export function useUpdatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePhotoDto }) =>
      photoApi.updatePhoto(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel pending queries to avoid conflicts
      await queryClient.cancelQueries({ queryKey: PHOTOS_KEY });

      // Save previous state for rollback
      const previous = queryClient.getQueryData<Photo[]>(PHOTOS_KEY);

      // Optimistically update cache
      queryClient.setQueryData<Photo[]>(PHOTOS_KEY, (old) =>
        (old ?? []).map((p) =>
          p.id === id ? { ...p, caption: data.caption, aspectRatio: data.aspectRatio } : p
        )
      );

      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      // Rollback to previous state on error
      if (ctx?.previous) {
        queryClient.setQueryData(PHOTOS_KEY, ctx.previous);
      }
    },
    onSettled: () => {
      // Re-sync cache after mutation completes
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY });
    },
  });
}

/**
 * Delete a wedding photo
 * Optimistically removes from cache with rollback on error
 */
export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: photoApi.deletePhoto,
    onMutate: async (photoId) => {
      // Cancel pending queries
      await queryClient.cancelQueries({ queryKey: PHOTOS_KEY });

      // Save previous state for rollback
      const previous = queryClient.getQueryData<Photo[]>(PHOTOS_KEY);

      // Optimistically remove from cache
      queryClient.setQueryData<Photo[]>(PHOTOS_KEY, (old) =>
        (old ?? []).filter((p) => p.id !== photoId)
      );

      return { previous };
    },
    onError: (_err, _photoId, ctx) => {
      // Restore deleted photo on error
      if (ctx?.previous) {
        queryClient.setQueryData(PHOTOS_KEY, ctx.previous);
      }
    },
    onSettled: () => {
      // Re-sync cache after mutation completes
      queryClient.invalidateQueries({ queryKey: PHOTOS_KEY });
    },
  });
}
