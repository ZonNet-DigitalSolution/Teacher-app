export type SlotStatus = "available" | "booked" | "off";

export type DayKey =
  | "sun"
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat";

export type Schedule = Partial<Record<DayKey, Partial<Record<string, SlotStatus>>>>;

export type DaySchedule = Partial<Record<string, SlotStatus>>;
