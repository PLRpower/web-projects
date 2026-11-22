import { fr } from './fr';
import { de } from './de';
import { nl } from './nl';
import { en } from './en';
import type { Dict } from './fr';

export type { Dict };

export const TICKET_URL = 'https://www.billetweb.fr/the-white-light-special-ball';

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
} as const;

export interface LanguageEntry {
  code: 'fr' | 'de' | 'nl' | 'en';
  name: string;
  label: string;
  path: string;
  dict: Dict;
}

export const languages: LanguageEntry[] = [
  { code: 'fr', name: 'Français', label: 'FR', path: '/', dict: fr },
  { code: 'de', name: 'Deutsch', label: 'DE', path: '/de/', dict: de },
  { code: 'nl', name: 'Nederlands', label: 'NL', path: '/nl/', dict: nl },
  { code: 'en', name: 'English', label: 'EN', path: '/en/', dict: en },
];
