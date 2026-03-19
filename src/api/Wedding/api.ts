import api from "@/api/api-client";
import type { WeddingDto, WeddingInfo } from "./types";
import { dtoToWeddingInfo, weddingInfoToDto } from "./types";

// Usually you get weddingId from context / route / user profile
// For now assuming one wedding per user (as your controller does)

export const getMyWedding = async (): Promise<WeddingInfo | null> => {
  try {
    const res = await api.get<WeddingDto>("/api/wedding");
    return dtoToWeddingInfo(res.data);
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 404) return null;
    throw e;
  }
};

export const createWedding = async (data: Partial<WeddingInfo>): Promise<WeddingInfo> => {
  const res = await api.post<WeddingDto>("/api/wedding", weddingInfoToDto(data));
  return dtoToWeddingInfo(res.data);
};

export const updateWedding = async (data: Partial<WeddingInfo>): Promise<WeddingInfo> => {
  const res = await api.put<WeddingDto>("/api/wedding", weddingInfoToDto(data));
  return dtoToWeddingInfo(res.data);
};

export const deleteWedding = async (): Promise<void> => {
  await api.delete("/api/wedding");
};