import api from "@/api/api-client";
import type { Milestone, MilestoneDto } from "./types";
import { dtoToMilestone, milestoneToCreateDto, milestoneToUpdateDto } from "./types";

export async function getMilestones(): Promise<Milestone[]> {
  const res = await api.get<MilestoneDto[]>("/api/wedding/milestones");
  return (res.data ?? []).map(dtoToMilestone);
}

export async function createMilestone(data: Partial<Milestone>): Promise<Milestone> {
  const res = await api.post<MilestoneDto>("/api/wedding/milestones", milestoneToCreateDto(data));
  return dtoToMilestone(res.data);
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone> {
  const res = await api.put<MilestoneDto>(`/api/wedding/milestones/${id}`, milestoneToUpdateDto(data));
  return dtoToMilestone(res.data);
}

export async function toggleMilestoneCompleted(id: string): Promise<Milestone> {
  const res = await api.patch<MilestoneDto>(`/api/wedding/milestones/${id}/toggle`);
  return dtoToMilestone(res.data);
}

export async function deleteMilestone(id: string): Promise<void> {
  await api.delete(`/api/wedding/milestones/${id}`);
}
