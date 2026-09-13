import type { Dict } from './fr';

/**
 * EN — English translation.
 * Ballroom culture terms kept as-is (Voguing, MC, category names).
 */
export const en: Dict = {
  code: 'en',
  htmlLang: 'en',
  meta: {
    title: 'Ballroom Strasbourg — RED LIGHT SPECIAL 2026',
    description:
      'On 24 October 2026 in Strasbourg: an institutional Tea Time, a Master Class with Vinii Revlon, the Red Forum and the grand Ballroom night. A major cultural, inclusive and artistic event.',
  },
  nav: {
    about: 'The Event',
    artists: 'Artists',
    devices: 'Formats',
    programme: 'Programme',
    partners: 'Partners',
    values: 'Values',
    gallery: 'Gallery',
    tickets: 'Tickets',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'Harmonie Nouvelle X Club Convives<br />present',
    title: 'BallRoom Strasbourg',
    code: 'Code',
    subtitle: 'The Red Light Special',
    tagline:
      'An event celebrating Ballroom culture, diversity, artistic excellence, inclusion and transmission.',
    date: '24 October 2026',
    city: 'Strasbourg — France',
    audience: '300 participants expected',
    ctaPrimary: 'Book my place',
    ctaSecondary: 'Discover the event',
    deadline: 'Tickets €17 — €14 students & associations, until 20 October.',
  },
  about: {
    eyebrow: 'Presentation',
    title: 'An ambitious and deeply committed edition',
    lead: 'In 2026, Ballroom Strasbourg presents an ambitious and deeply committed edition: RED LIGHT SPECIAL. An event celebrating Ballroom culture, diversity, artistic excellence, inclusion and transmission.',
    body: 'RED LIGHT SPECIAL establishes Strasbourg as a queer European cultural capital — a territory where art, sport, citizenship and inclusion meet.',
    pillarsTitle: 'Key moments, one legendary night',
    pillars: [
      { name: 'Institutional Tea Time', desc: 'with Vinii Revlon' },
      { name: 'Professional Master Class', desc: 'Performance, discipline & transmission' },
      { name: 'Red Forum', desc: 'a civic space dedicated to inclusive associations' },
      { name: 'Red Circle', desc: 'a discreet premium space for partners and sponsors' },
      { name: 'Grand Ballroom night', desc: 'the artistic and performative heart of the event' },
    ],
    identityTitle: 'The power of red',
    identity:
      'RED LIGHT SPECIAL explores the power of red: intensity, glamour, mystery, warmth, affirmation, presence. Red light becomes a visual signature, an atmosphere, a dramatic arc.',
    tags: ['artistic', 'inclusive', 'community-driven', 'territorial', 'professional'],
    photoAlt: 'Ballroom night — stage atmosphere',
    photoCaption: 'The energy of a red night',
  },
  artists: {
    eyebrow: 'Guests & artistic team',
    title: 'Legends on stage',
    judges:
      'Two national and international personality judges and two local judges complete the panel (being confirmed).',
    vini: {
      name: 'Vinii Revlon',
      role: 'Official MC',
      photoAlt: 'Vinii Revlon — portrait',
      credits: [
        'Europe’s first Voguing Legend, Father of the House of Revlon',
        'Dancer in Les Indes Galantes (Opéra Bastille)',
        'Finalist on Legendary (HBO Max)',
        'Winner of the Têtu Award 2025',
        'Choreographer for Aya Nakamura',
        'Guest judge on Drag Race France — Season 4 (2026)',
      ],
    },
    bo: {
      name: 'Bo The Qu-inG',
      role: 'Artistic direction & live performances',
      photoAlt: 'Bo The Qu-inG — on-stage performance',
      credits: ['Opening live: Red Awakening', 'Closing live: Red Ascension', 'Overall artistic direction'],
    },
  },
  gallery: {
    eyebrow: 'The Ballroom scene',
    title: 'In the red light',
    subtitle:
      'Walks, performances, energy and community: Ballroom culture in pictures — a taste of what awaits you on 24 October.',
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    altPrefix: 'Ballroom Strasbourg — photo',
  },
  devices: {
    eyebrow: 'The key formats',
    title: 'An event with many dimensions',
    items: [
      {
        name: 'Institutional Tea Time',
        time: '15:00 – 17:00',
        price: '€17 · €14 students & associations',
        tagline: '“Voguing at the Olympic Games? Art, Sport & Inclusion”',
        desc: 'A time for reflection bringing together institutions, partners, cultural players and media.',
        features: [
          'Recognition of voguing as an artistic and sporting discipline',
          'Inclusion & diversity',
          'Afro-queer heritage',
          'Cultural transmission',
        ],
      },
      {
        name: 'Professional Master Class',
        time: '17:00 – 18:00',
        price: 'On registration',
        tagline: '“Performance, Discipline & Transmission”',
        desc: 'A premium training session led by Vinii Revlon.',
        features: ['Technique', 'Rigour', 'Performance', 'Direct transmission from a legend'],
      },
      {
        name: 'Red Forum — Inclusive associations & partners',
        time: '17:00 – 22:00',
        price: 'Free entry',
        tagline: 'The civic space of the event',
        desc: 'A space dedicated to LGBTQIA+ associations, prevention organisations, cultural & social players and institutional partners.',
        features: [
          'Association stands',
          'Wall of commitments',
          'Red Card (anonymous messages)',
          'Mini-exhibition “Red & Identities”',
          'Inclusive Resources Desk',
          'Red Book (guestbook)',
        ],
      },
      {
        name: 'Red Circle — Sponsors & patrons',
        time: 'During the night',
        price: 'By invitation',
        tagline: 'The premium, discreet space',
        desc: 'A discreet premium space, integrated into the Ballroom hall, to showcase partners without creating a visible hierarchy.',
        features: [
          'Premium welcome drink',
          'Dedicated host',
          'Partner ↔ artist networking space',
          'Partner Red Card',
          'Red Portrait (sent after the event)',
        ],
      },
      {
        name: 'Grand Ballroom night',
        time: '19:00 – 01:00',
        price: '€17 · €14 students & associations',
        tagline: 'The artistic and performative heart',
        desc: 'Ten categories, live performances and a RED LIGHT PARTY until the end of the night.',
        features: [
          '10 competition categories',
          'Opening & closing live',
          'Red Candy Room & Red Wall',
          'Red Light Party — DJ set',
        ],
      },
    ],
  },
  programme: {
    eyebrow: 'How the night unfolds',
    title: 'A red night, minute by minute',
    timeline: [
      {
        time: '19:00',
        title: 'Doors open',
        desc: 'RED CANDY ROOM (make-up & glitter bar by Candice Mack — €8) and RED WALL, the evolving Polaroid wall.',
      },
      { time: '19:30', title: 'Opening live — Bo The Qu-inG', desc: '“Red Awakening”' },
      { time: '19:40', title: 'RED PROCESSION', desc: 'Ceremonial entrance of the guests.' },
      { time: '19:50', title: 'Opening MC + DJ', desc: 'Vinii Revlon & our DJ.' },
      {
        time: '20:00',
        title: 'The 10 categories — part 1',
        desc: 'Red Runway, Face, Performance, Best Dressed, Lip Sync Battle.',
      },
      { time: '—', title: 'Artist break', desc: 'Live show + a 20-minute intermission.' },
      { time: '—', title: 'The 10 categories — part 2', desc: 'Sex Siren, Body, Hair, Make-Up, Tag Team.' },
      { time: '22:30', title: 'Finals + RED TROPHY CEREMONY', desc: 'The red trophies ceremony.' },
      { time: '22:50', title: 'Closing live — Bo The Qu-inG', desc: '“Red Ascension”' },
      { time: '23:00', title: 'RED LIGHT PARTY', desc: 'DJ set.' },
      { time: '01:00', title: 'End & Polaroid collection', desc: '' },
    ],
    categoriesTitle: 'The 10 categories',
    categories: [
      { name: 'Red Runway OTA', theme: 'Walk like fire' },
      { name: 'Face', theme: 'Glow in red' },
      { name: 'Performance OTA', theme: 'Heatwave' },
      { name: 'Best Dressed', theme: 'Red couture' },
      { name: 'Lip Sync Battle', theme: 'Red spotlight' },
      { name: 'Sex Siren', theme: 'Red allure' },
      { name: 'Body', theme: 'Red silhouette' },
      { name: 'Hair', theme: 'Red crown' },
      { name: 'Make-Up', theme: 'Red face art' },
      { name: 'Tag Team', theme: 'Double heat' },
    ],
    photoAlt: 'The dance floor during the grand Ballroom night',
    photoCaption: 'The night is only beginning',
  },
  partners: {
    eyebrow: 'Partner benefits',
    title: 'Why take part?',
    subtitle:
      'A clear, rewarding and structuring collaboration framework — for economic, institutional, cultural and media players.',
    groups: [
      {
        audience: 'Sponsors & patrons',
        benefits: [
          'Premium visibility within a major cultural event',
          'Access to the Red Circle',
          'Privileged meetings with artists & the team',
          'Red Portrait (premium post-event content)',
          'Association with a strong, inclusive and modern identity',
          'Real social impact: support for queer culture',
          'Presence in press & communication materials',
        ],
      },
      {
        audience: 'Institutional partners',
        benefits: [
          'Alignment with cultural policies (diversity, inclusion, youth, live arts)',
          'Territorial visibility',
          'Presence in the Red Forum',
          'Meetings with associations, artists and local players',
          'Participation in a structuring project for the community',
        ],
      },
      {
        audience: 'Companies',
        benefits: [
          'Concrete CSR engagement',
          'Visibility among a young, creative, engaged audience',
          'Cultural sponsorship opportunities',
          'Integration into a premium event with a strong visual identity',
          'Access to a growing artistic & cultural network',
        ],
      },
      {
        audience: 'Media',
        benefits: [
          'Access to major personalities',
          'Strong visual content',
          'Interviews available',
          'Coverage of an unprecedented event in the Grand Est region',
        ],
      },
    ],
  },
  values: {
    eyebrow: 'Vision & stakes',
    title: 'Much more than a night',
    quote:
      '“Create a space where human meets human, where assumptions fall away, and where culture becomes a social lever.”',
    items: [
      {
        title: 'Vision & ambition',
        desc: 'RED LIGHT SPECIAL is the 2026 edition of Ballroom Strasbourg: a major event celebrating Ballroom culture and its artistic excellence, diversity and queer visibility, inclusion, citizenship and transmission — and Strasbourg as a queer European cultural capital.',
      },
      {
        title: 'Social impact',
        desc: 'A safe space, designed to foster encounters, dialogue and mutual understanding, to give visibility to queer and allied communities, to deconstruct stereotypes and encourage social cohesion.',
      },
      {
        title: 'Educational dimension',
        desc: 'Introductory workshops on Ballroom codes, conferences on gender, inclusion and representation, encounters between artists, institutions, students and audiences. An educational laboratory where pedagogy accompanies performance.',
      },
      {
        title: 'Cultural reach',
        desc: 'Ballroom culture as a living heritage, the diversity of queer artistic expressions, the meeting of art, fashion, sport, citizenship and innovation.',
      },
      {
        title: 'Technological innovation',
        desc: 'An immersive stage design blending intelligent lighting, laser and satin universes, modern visual effects in the service of emotion. Technology magnifies the human and amplifies the artistic narrative.',
      },
      {
        title: 'Breaking down assumptions',
        desc: 'Deconstructing prejudice, fostering authentic encounters, celebrating human diversity and creating a space where everyone can be themselves.',
      },
    ],
    photoAlt: 'Audience & community — Ballroom night',
    photoCaption: 'Where human meets human',
  },
  tickets: {
    eyebrow: 'Ticketing',
    title: 'Join the legend',
    note: 'Booking recommended — limited seats.',
    standard: { name: 'Standard rate', price: '€17', note: 'Until 20 October, then €20.' },
    student: { name: 'Students & associations', price: '€14', note: 'Proof of status required.' },
    cta: 'Book my place',
    legal: 'Registration link coming soon.',
  },
  footer: {
    tagline: 'RED LIGHT SPECIAL — Ballroom Strasbourg Come Back',
    contact: 'Contact us',
    follow: 'Follow us',
    rights: 'Ballroom Strasbourg — RED LIGHT SPECIAL 2026',
  },
};
