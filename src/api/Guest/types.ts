export type Side = "groom" | "bride";

export interface Guest {
  id: string;
  name: string;
  note: string | null;
  seatCount: number;
  confirmed: boolean;
  side: Side;
}

/** API response (camelCase from .NET) */
export interface GuestResponseDto {
  id: string;
  name: string;
  note: string | null;
  seatCount: number;
  confirmed: boolean;
  side: number | string; // 0 | "Groom" | 1 | "Bride"
  weddingId: string;
}

/** Create payload */
export interface CreateGuestDto {
  name: string;
  note?: string | null;
  seatCount: number;
  side: number; // 0 = Groom, 1 = Bride
}

/** Update payload (no side) */
export interface UpdateGuestDto {
  name: string;
  note?: string | null;
  seatCount: number;
}

function parseApiSide(v: number | string): Side {
  if (typeof v === "number") return v === 0 ? "groom" : "bride";
  const s = String(v).toLowerCase();
  return s === "groom" ? "groom" : "bride";
}

function sideToApi(side: Side): number {
  return side === "groom" ? 0 : 1;
}

export function dtoToGuest(dto: GuestResponseDto): Guest {
  return {
    id: dto.id,
    name: dto.name ?? "",
    note: dto.note ?? null,
    seatCount: dto.seatCount ?? 1,
    confirmed: !!dto.confirmed,
    side: parseApiSide(dto.side),
  };
}

export function guestToCreateDto(guest: Partial<Guest> & { side: Side }): CreateGuestDto {
  return {
    name: guest.name ?? "",
    note: guest.note || undefined,
    seatCount: Math.max(1, guest.seatCount ?? 1),
    side: sideToApi(guest.side),
  };
}

export function guestToUpdateDto(guest: Partial<Guest>): UpdateGuestDto {
  return {
    name: guest.name ?? "",
    note: guest.note ?? undefined,
    seatCount: Math.max(1, guest.seatCount ?? 1),
  };
}
