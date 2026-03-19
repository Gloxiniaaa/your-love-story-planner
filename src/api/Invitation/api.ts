import api from "@/api/api-client";
import type { WeddingInfo } from "@/api/Wedding/types";
import { dtoToWeddingInfo } from "@/api/Wedding/types";
import type { Milestone, MilestoneDto } from "@/api/Milestone/types";
import { dtoToMilestone } from "@/api/Milestone/types";

export interface WeddingForGuestDto {
  id: string;
  name1: string;
  name2: string;
  date: string; // ISO
  location: string;
  tagline: string;
  milestones: MilestoneDto[];
}

export interface InvitationView {
  wedding: WeddingInfo;
  milestones: Milestone[];
}

export async function getInvitation(weddingId: string): Promise<InvitationView> {
  const res = await api.get<WeddingForGuestDto>(`/api/invitation/${weddingId}`);
  const dto = res.data;
  return {
    wedding: dtoToWeddingInfo(dto),
    milestones: (dto.milestones ?? []).map(dtoToMilestone),
  };
}

