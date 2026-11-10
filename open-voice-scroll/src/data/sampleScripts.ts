export interface ScriptPreset {
  id: string;
  title: string;
  lang: 'fr' | 'en';
  speechLang: 'fr-FR' | 'en-US' | 'en-GB';
  text: string;
}

export const SAMPLE_SCRIPTS: ScriptPreset[] = [
  {
    id: 'fr-pitch',
    title: '🇫🇷 Présentation OpenVoiceScroll',
    lang: 'fr',
    speechLang: 'fr-FR',
    text: `Bienvenue sur OpenVoiceScroll, le premier prompteur open-source piloté par la voix avec alignement phonétique temps réel.

Ce prompteur a été conçu pour résoudre le problème numéro un des orateurs et créateurs de contenu : le défilement automatique à vitesse fixe est toujours trop rapide ou trop lent.

Grâce à notre moteur d'écoute en direct, vous n'avez plus besoin d'accélérer ou de ralentir votre débit. Si vous vous arrêtez pour boire une gorgée d'eau ou pour insister sur une idée importante, le texte s'arrête avec vous. Dès que vous reprenez la parole, le curseur reprend exactement là où vous en étiez.

Le système utilise une tolérance phonétique avancée capable d'encaisser les hésitations, les répétitions et les légers écarts par rapport au texte préparé.

Vous pouvez ajuster la taille du texte, inverser l'écran en mode miroir pour les vitres de téléprompteur professionnelles, et passer en plein écran d'une seule touche.

Bonne prise de parole !`,
  },
  {
    id: 'en-demo',
    title: '🇬🇧 English Pitch (Test Accent FR)',
    lang: 'en',
    speechLang: 'en-US',
    text: `Hello everyone, and welcome to this live demonstration of OpenVoiceScroll.

Today, we are testing how the voice tracking engine handles non-native English accents, including the French accent.

Notice how words like think, three, technology, and weather are recognized even if the pronunciation of the TH sound is soft or shifted toward an S or a Z.

The teleprompter uses a resilient fuzzy alignment algorithm. It compares incoming audio tokens with a sliding window ahead of your current reading position.

You do not need to rush or pronounce every single syllable with perfection. Just speak naturally, at your own rhythm, and let the software follow your voice smoothly.

Whether you are recording YouTube videos, keynote speeches, or online courses, your eyes will stay locked on the camera lens without losing your place.

Thank you very much, and happy recording!`,
  },
];
