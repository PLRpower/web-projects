import { fr } from './fr';
import { de } from './de';
import { nl } from './nl';
import { en } from './en';
import type { Dict } from './fr';

export type { Dict };

export const TICKET_URL = 'https://www.billetweb.fr/the-red-light-special-ballroom';

export interface LanguageEntry {
  code: 'fr' | 'de' | 'nl' | 'en';
  /** Nom natif de la langue, utilisé pour les libellés accessibles du sélecteur. */
  name: string;
  path: string;
  dict: Dict;
}

export const languages: LanguageEntry[] = [
  { code: 'fr', name: 'Français', path: '/red-ball/', dict: fr },
  { code: 'de', name: 'Deutsch', path: '/de/red-ball/', dict: de },
  { code: 'nl', name: 'Nederlands', path: '/nl/red-ball/', dict: nl },
  { code: 'en', name: 'English', path: '/en/red-ball/', dict: en },
];

export const whiteEditionPath = (code: string): string =>
  code === 'fr' ? '/' : `/${code}/`;
