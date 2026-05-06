export interface Country {
  code: string;
  flag: string;
  dial: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: 'EG', flag: '🇪🇬', dial: '+20', name: 'مصر' },
  { code: 'SA', flag: '🇸🇦', dial: '+966', name: 'السعودية' },
  { code: 'AE', flag: '🇦🇪', dial: '+971', name: 'الإمارات' },
  { code: 'KW', flag: '🇰🇼', dial: '+965', name: 'الكويت' },
  { code: 'QA', flag: '🇶🇦', dial: '+974', name: 'قطر' },
  { code: 'JO', flag: '🇯🇴', dial: '+962', name: 'الأردن' },
  { code: 'LB', flag: '🇱🇧', dial: '+961', name: 'لبنان' },
];
