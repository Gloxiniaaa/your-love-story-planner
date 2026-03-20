import api from "@/api/api-client";
import type { Guest, GuestResponseDto } from "./types";
import { dtoToGuest, guestToCreateDto, guestToUpdateDto } from "./types";

export async function getGuests(): Promise<Guest[]> {
  const res = await api.get<GuestResponseDto[]>("/api/wedding/guests");
  return (res.data ?? []).map(dtoToGuest);
}

export async function createGuest(data: Omit<Partial<Guest>, "id" | "confirmed"> & { name: string; side: "groom" | "bride" }): Promise<Guest> {
  const res = await api.post<GuestResponseDto>("/api/wedding/guests", guestToCreateDto(data));
  return dtoToGuest(res.data);
}

export async function updateGuest(id: string, data: Partial<Pick<Guest, "name" | "note" | "seatCount">>): Promise<Guest> {
  const res = await api.put<GuestResponseDto>(`/api/wedding/guests/${id}`, guestToUpdateDto(data));
  return dtoToGuest(res.data);
}

export async function toggleGuestConfirmed(id: string): Promise<Guest> {
  const res = await api.patch<GuestResponseDto>(`/api/wedding/guests/${id}/toggle`);
  return dtoToGuest(res.data);
}

export async function deleteGuest(id: string): Promise<void> {
  await api.delete(`/api/wedding/guests/${id}`);
}
