export interface Hall {
  id: number;
  type: string;
  link: string;
  status: 'active' | 'inactive';
}

export const ROOM_LABELS: Record<string, string> = {
  zamn: 'Zamn',
  zoom: 'Zoom',
  'zon-net': 'Zon-Net',
  connect: 'Connect',
  other: 'أخرى',
};

export const ROOM_TYPES = [
  { value: 'zamn', label: 'Zamn' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'zon-net', label: 'Zon-Net' },
  { value: 'connect', label: 'Connect' },
  { value: 'other', label: 'أخرى' },
] as const;
