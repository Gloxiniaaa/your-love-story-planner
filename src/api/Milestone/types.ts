export interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  date: string; // UI format: dd/mm/yyyy
  completed: boolean;
  emoji: string;
}

export interface MilestoneDto {
  id: string;
  title: string;
  subtitle?: string | null;
  date: string; // API format: ISO date-time
  completed?: boolean;
  emoji?: string | null;
}

export interface CreateMilestoneDto {
  title: string;
  subtitle?: string;
  date: string; // ISO
  completed?: boolean;
  emoji?: string;
}

export interface UpdateMilestoneDto {
  title: string;
  subtitle?: string;
  date: string; // ISO
  completed?: boolean;
  emoji?: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function isoToDMY(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function dmyToIso(dmy: string): string {
  const [dayStr, monthStr, yearStr] = dmy.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const d = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) return dmy;
  return d.toISOString();
}

export function dtoToMilestone(dto: MilestoneDto): Milestone {
  return {
    id: dto.id,
    title: dto.title ?? "",
    subtitle: dto.subtitle ?? "",
    date: dto.date ? isoToDMY(dto.date) : "",
    completed: !!dto.completed,
    emoji: dto.emoji ?? "🎉",
  };
}

export function milestoneToCreateDto(m: Partial<Milestone>): Partial<CreateMilestoneDto> {
  return {
    title: m.title,
    subtitle: m.subtitle,
    date: m.date ? dmyToIso(m.date) : undefined,
    completed: m.completed,
    emoji: m.emoji,
  };
}

export function milestoneToUpdateDto(m: Partial<Milestone>): Partial<UpdateMilestoneDto> {
  return {
    title: m.title,
    subtitle: m.subtitle,
    date: m.date ? dmyToIso(m.date) : undefined,
    completed: m.completed,
    emoji: m.emoji,
  };
}
