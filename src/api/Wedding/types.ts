export interface WeddingInfo {
  name1: string;
  name2: string;
  date: string; // UI format: dd/mm/yyyy
  location: string;
  tagline: string;
}

export interface WeddingDto {
  name1: string;
  name2: string;
  date: string; // API format: ISO date-time string
  location: string;
  tagline?: string | null;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function isoToDMY(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function dmyToIso(dmy: string): string {
  // "dd/mm/yyyy" -> ISO at local midnight (compatible with backend date-time)
  const [dayStr, monthStr, yearStr] = dmy.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const d = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) return dmy;
  return d.toISOString();
}

export function dtoToWeddingInfo(dto: WeddingDto): WeddingInfo {
  return {
    name1: dto.name1 ?? "",
    name2: dto.name2 ?? "",
    date: dto.date ? isoToDMY(dto.date) : "",
    location: dto.location ?? "",
    tagline: dto.tagline ?? "",
  };
}

export function weddingInfoToDto(info: Partial<WeddingInfo>): Partial<WeddingDto> {
  return {
    name1: info.name1,
    name2: info.name2,
    date: info.date ? dmyToIso(info.date) : undefined,
    location: info.location,
    tagline: info.tagline,
  };
}
