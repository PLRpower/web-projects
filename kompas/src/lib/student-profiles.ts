export interface StudentProfileData {
    id: string;
    name: string;
    avatarInitial: string;
    campus: string;
    promo: string;
    specialty: string;
    bio: string;
    status: string;
    isOnline: boolean;
    level: number;
    levelTitle: string;
    xp: number;
    nextLevelXp: number;
    streakDays: number;
    completedCctlCount: number;
    averageScore: string;
    accuracyRate: string;
    topSkills: string[];
    joinedDate: string;
    tier: 'Découverte' | 'Premium' | 'Major de Promo';
}

export function getStudentProfile(identifier: string): StudentProfileData {
    const cleanName = identifier ? decodeURIComponent(identifier).replace(/[-_]/g, ' ') : 'Élève-Ingénieur';
    const initial = cleanName.charAt(0).toUpperCase() || 'E';

    return {
        id: identifier || 'student',
        name: cleanName,
        avatarInitial: initial,
        campus: 'CESI Campus',
        promo: 'A3',
        specialty: 'Cycle Ingénieur',
        bio: 'Élève-Ingénieur au CESI sur Kompas.',
        status: 'En ligne',
        isOnline: true,
        level: 1,
        levelTitle: 'Élève-Ingénieur CESI',
        xp: 0,
        nextLevelXp: 1000,
        streakDays: 0,
        completedCctlCount: 0,
        averageScore: '--',
        accuracyRate: '0%',
        topSkills: ['Ingénierie & Tronc Commun', 'CCTL', 'Prosits PBL'],
        joinedDate: new Date().getFullYear().toString(),
        tier: 'Découverte'
    };
}
