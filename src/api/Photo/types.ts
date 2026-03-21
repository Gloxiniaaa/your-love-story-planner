// Photo aspect ratio type matching backend allowed values
export type AspectRatio = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

// Frontend model representing a wedding photo
export interface Photo {
  id: string;
  imageUrl: string;
  caption: string;
  aspectRatio: AspectRatio;
}

// API response DTO from backend PhotoGalleryController
export interface PhotoResponseDto {
  id: string;
  imageUrl: string;
  aspectRatio: AspectRatio;
  caption: string;
}

// Form data for uploading a new photo (multipart/form-data)
export interface UploadPhotoDto {
  file: File;
  caption: string;
  aspectRatio: AspectRatio;
}

// Payload for updating photo metadata only
export interface UpdatePhotoDto {
  caption: string;
  aspectRatio: AspectRatio;
}

// DTO mapping functions
export function dtoToPhoto(dto: PhotoResponseDto): Photo {
  return {
    id: dto.id,
    imageUrl: dto.imageUrl,
    caption: dto.caption,
    aspectRatio: dto.aspectRatio,
  };
}

export function photoToUpdateDto(photo: Pick<Photo, "caption" | "aspectRatio">): UpdatePhotoDto {
  return {
    caption: photo.caption,
    aspectRatio: photo.aspectRatio,
  };
}
