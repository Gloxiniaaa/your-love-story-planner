import { useQuery } from "@tanstack/react-query";
import { getInvitation, type InvitationView } from "./api";

export function useInvitation(weddingId?: string) {
  return useQuery<InvitationView, Error>({
    queryKey: ["invitation", weddingId],
    queryFn: () => getInvitation(weddingId!),
    enabled: !!weddingId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

