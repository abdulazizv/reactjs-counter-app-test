import { en } from './en';
import { uz } from './uz';
import { ru } from './ru';

export const translations = {
  en,
  uz,
  ru,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
