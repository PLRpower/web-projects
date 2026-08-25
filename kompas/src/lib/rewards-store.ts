export interface ContributionRecord {
    id: string;
    type: 'livrable_upload' | 'prosit_upload' | 'correction_vote' | 'cctl_upload';
    title: string;
    awardedAt: string;
    bonusMonths: number;
    aiCredits: number;
}

export interface UserRewardsProfile {
    totalContributions: number;
    livrablesPublishedCount: number;
    prositsPublishedCount: number;
    bonusMonthsEarned: number; // Max 1 bonus month via crowdsourcing
    aiCreditsBalance: number;
    contributorBadge: 'Membre' | 'Apprenti Contributeur' | 'Contributeur Actif' | 'Major Contributeur CESI';
    badgeColor: string;
    history: ContributionRecord[];
}

export const LIVRABLES_REWARD_THRESHOLD = 5; // 5 livrables = 1 mois premium
export const PROSITS_REWARD_THRESHOLD = 10;   // 10 prosits = 1 mois premium
export const MAX_CROWDSOURCED_PREMIUM_MONTHS = 1; // Limite stricte de 1 mois

const DEFAULT_REWARDS_PROFILE: UserRewardsProfile = {
    totalContributions: 0,
    livrablesPublishedCount: 0,
    prositsPublishedCount: 0,
    bonusMonthsEarned: 0,
    aiCreditsBalance: 20, // 20 free starter credits
    contributorBadge: 'Membre',
    badgeColor: 'text-text-muted',
    history: []
};

const REWARDS_STORAGE_KEY = 'kompas_rewards_data';

/**
 * Loads user rewards profile from localStorage with fallback and migration.
 */
export function getUserRewardsProfile(): UserRewardsProfile {
    if (typeof window === 'undefined') return DEFAULT_REWARDS_PROFILE;
    try {
        const saved = localStorage.getItem(REWARDS_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...DEFAULT_REWARDS_PROFILE,
                ...parsed,
                livrablesPublishedCount: parsed.livrablesPublishedCount ?? (parsed.history?.filter((h: any) => h.type === 'livrable_upload' || h.type === 'livrable_share').length || 0),
                prositsPublishedCount: parsed.prositsPublishedCount ?? (parsed.history?.filter((h: any) => h.type === 'prosit_upload').length || 0),
                bonusMonthsEarned: Math.min(MAX_CROWDSOURCED_PREMIUM_MONTHS, parsed.bonusMonthsEarned ?? 0)
            };
        }
    } catch (e) {
        console.warn('Failed to parse rewards profile:', e);
    }
    return DEFAULT_REWARDS_PROFILE;
}

/**
 * Saves user rewards profile and emits sync event.
 */
export function saveUserRewardsProfile(profile: UserRewardsProfile) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(profile));
        window.dispatchEvent(new Event('kompas_rewards_updated'));
    } catch (e) {
        console.error('Failed to save rewards profile:', e);
    }
}

/**
 * Resolves the contributor badge based on total valid contributions.
 */
export function resolveContributorBadge(total: number): { badge: UserRewardsProfile['contributorBadge']; color: string } {
    if (total >= 10) {
        return { badge: 'Major Contributeur CESI', color: 'text-amber-400' };
    } else if (total >= 5) {
        return { badge: 'Contributeur Actif', color: 'text-emerald-400' };
    } else if (total >= 1) {
        return { badge: 'Apprenti Contributeur', color: 'text-blue-400' };
    }
    return { badge: 'Membre', color: 'text-text-muted' };
}

/**
 * Sync user profile to grant Premium access when reward is claimed.
 */
function applyPremiumRewardToLocalProfile(badge: string, credits: number) {
    try {
        const savedUserProfile = localStorage.getItem('kompas_user_profile');
        const userProfile = savedUserProfile ? JSON.parse(savedUserProfile) : {};

        const updatedUserProfile = {
            ...userProfile,
            is_premium: true,
            subscription_tier: 'Premium',
            subscription_plan: 'crowdsourced_bonus',
            contributorBadge: badge,
            aiCredits: credits
        };

        localStorage.setItem('kompas_user_profile', JSON.stringify(updatedUserProfile));
        window.dispatchEvent(new Event('kompas_profile_updated'));
    } catch (e) {
        console.warn('Failed to update local user profile with reward:', e);
    }
}

export interface ContributionResult {
    success: boolean;
    unlockedReward: boolean;
    earnedMonths: number;
    earnedCredits: number;
    totalCredits: number;
    currentCount: number;
    targetCount: number;
    remaining: number;
    isMaxLimitReached: boolean;
    newBadge: UserRewardsProfile['contributorBadge'];
    rewardReason?: string;
}

/**
 * Records a validated Livrable publication.
 * Unlocks +1 Month Premium & +50 AI credits when reaching 5 published livrables (Max 1 month).
 */
export function recordLivrableContribution(title: string): ContributionResult {
    if (typeof window === 'undefined') {
        return {
            success: false,
            unlockedReward: false,
            earnedMonths: 0,
            earnedCredits: 0,
            totalCredits: 20,
            currentCount: 0,
            targetCount: LIVRABLES_REWARD_THRESHOLD,
            remaining: LIVRABLES_REWARD_THRESHOLD,
            isMaxLimitReached: false,
            newBadge: 'Membre'
        };
    }

    const currentProfile = getUserRewardsProfile();
    const newLivrablesCount = currentProfile.livrablesPublishedCount + 1;
    const newTotal = currentProfile.totalContributions + 1;
    const { badge, color } = resolveContributorBadge(newTotal);

    const canEarnBonusMonth = currentProfile.bonusMonthsEarned < MAX_CROWDSOURCED_PREMIUM_MONTHS;
    const isMilestoneReached = newLivrablesCount >= LIVRABLES_REWARD_THRESHOLD;
    const shouldAwardReward = isMilestoneReached && canEarnBonusMonth;

    const earnedMonths = shouldAwardReward ? 1 : 0;
    const earnedCredits = shouldAwardReward ? 50 : 10; // +10 credits for regular contribution, +50 on milestone

    const newRecord: ContributionRecord = {
        id: `contrib-livrable-${Date.now().toString(36)}`,
        type: 'livrable_upload',
        title,
        awardedAt: new Date().toISOString(),
        bonusMonths: earnedMonths,
        aiCredits: earnedCredits
    };

    const newBonusMonthsTotal = currentProfile.bonusMonthsEarned + earnedMonths;
    const newCreditsBalance = currentProfile.aiCreditsBalance + earnedCredits;

    const updatedProfile: UserRewardsProfile = {
        totalContributions: newTotal,
        livrablesPublishedCount: newLivrablesCount,
        prositsPublishedCount: currentProfile.prositsPublishedCount,
        bonusMonthsEarned: newBonusMonthsTotal,
        aiCreditsBalance: newCreditsBalance,
        contributorBadge: badge,
        badgeColor: color,
        history: [newRecord, ...currentProfile.history]
    };

    saveUserRewardsProfile(updatedProfile);

    if (shouldAwardReward) {
        applyPremiumRewardToLocalProfile(badge, newCreditsBalance);
    }

    return {
        success: true,
        unlockedReward: shouldAwardReward,
        earnedMonths,
        earnedCredits,
        totalCredits: newCreditsBalance,
        currentCount: newLivrablesCount,
        targetCount: LIVRABLES_REWARD_THRESHOLD,
        remaining: Math.max(0, LIVRABLES_REWARD_THRESHOLD - newLivrablesCount),
        isMaxLimitReached: newBonusMonthsTotal >= MAX_CROWDSOURCED_PREMIUM_MONTHS,
        newBadge: badge,
        rewardReason: shouldAwardReward
            ? 'Palier de 5 Livrables d\'ingénierie validés atteint !'
            : undefined
    };
}

/**
 * Records a validated Prosit publication.
 * Unlocks +1 Month Premium & +50 AI credits when reaching 10 published prosits (Max 1 month).
 */
export function recordPrositContribution(title: string): ContributionResult {
    if (typeof window === 'undefined') {
        return {
            success: false,
            unlockedReward: false,
            earnedMonths: 0,
            earnedCredits: 0,
            totalCredits: 20,
            currentCount: 0,
            targetCount: PROSITS_REWARD_THRESHOLD,
            remaining: PROSITS_REWARD_THRESHOLD,
            isMaxLimitReached: false,
            newBadge: 'Membre'
        };
    }

    const currentProfile = getUserRewardsProfile();
    const newPrositsCount = currentProfile.prositsPublishedCount + 1;
    const newTotal = currentProfile.totalContributions + 1;
    const { badge, color } = resolveContributorBadge(newTotal);

    const canEarnBonusMonth = currentProfile.bonusMonthsEarned < MAX_CROWDSOURCED_PREMIUM_MONTHS;
    const isMilestoneReached = newPrositsCount >= PROSITS_REWARD_THRESHOLD;
    const shouldAwardReward = isMilestoneReached && canEarnBonusMonth;

    const earnedMonths = shouldAwardReward ? 1 : 0;
    const earnedCredits = shouldAwardReward ? 50 : 5; // +5 credits for each prosit, +50 on milestone

    const newRecord: ContributionRecord = {
        id: `contrib-prosit-${Date.now().toString(36)}`,
        type: 'prosit_upload',
        title,
        awardedAt: new Date().toISOString(),
        bonusMonths: earnedMonths,
        aiCredits: earnedCredits
    };

    const newBonusMonthsTotal = currentProfile.bonusMonthsEarned + earnedMonths;
    const newCreditsBalance = currentProfile.aiCreditsBalance + earnedCredits;

    const updatedProfile: UserRewardsProfile = {
        totalContributions: newTotal,
        livrablesPublishedCount: currentProfile.livrablesPublishedCount,
        prositsPublishedCount: newPrositsCount,
        bonusMonthsEarned: newBonusMonthsTotal,
        aiCreditsBalance: newCreditsBalance,
        contributorBadge: badge,
        badgeColor: color,
        history: [newRecord, ...currentProfile.history]
    };

    saveUserRewardsProfile(updatedProfile);

    if (shouldAwardReward) {
        applyPremiumRewardToLocalProfile(badge, newCreditsBalance);
    }

    return {
        success: true,
        unlockedReward: shouldAwardReward,
        earnedMonths,
        earnedCredits,
        totalCredits: newCreditsBalance,
        currentCount: newPrositsCount,
        targetCount: PROSITS_REWARD_THRESHOLD,
        remaining: Math.max(0, PROSITS_REWARD_THRESHOLD - newPrositsCount),
        isMaxLimitReached: newBonusMonthsTotal >= MAX_CROWDSOURCED_PREMIUM_MONTHS,
        newBadge: badge,
        rewardReason: shouldAwardReward
            ? 'Palier de 10 Prosits PBL validés atteint !'
            : undefined
    };
}

/**
 * Returns current contribution progress and goals.
 */
export function getRewardProgressStats(): {
    livrables: { current: number; target: number; remaining: number; completed: boolean };
    prosits: { current: number; target: number; remaining: number; completed: boolean };
    bonusMonthsEarned: number;
    isMaxLimitReached: boolean;
    aiCreditsBalance: number;
    badge: string;
} {
    const profile = getUserRewardsProfile();
    return {
        livrables: {
            current: profile.livrablesPublishedCount,
            target: LIVRABLES_REWARD_THRESHOLD,
            remaining: Math.max(0, LIVRABLES_REWARD_THRESHOLD - profile.livrablesPublishedCount),
            completed: profile.livrablesPublishedCount >= LIVRABLES_REWARD_THRESHOLD
        },
        prosits: {
            current: profile.prositsPublishedCount,
            target: PROSITS_REWARD_THRESHOLD,
            remaining: Math.max(0, PROSITS_REWARD_THRESHOLD - profile.prositsPublishedCount),
            completed: profile.prositsPublishedCount >= PROSITS_REWARD_THRESHOLD
        },
        bonusMonthsEarned: profile.bonusMonthsEarned,
        isMaxLimitReached: profile.bonusMonthsEarned >= MAX_CROWDSOURCED_PREMIUM_MONTHS,
        aiCreditsBalance: profile.aiCreditsBalance,
        badge: profile.contributorBadge
    };
}

/**
 * Backward compatibility alias for any legacy caller.
 */
export function claimContributionReward(params: {
    type: 'cctl_upload' | 'correction_vote' | 'livrable_share';
    title: string;
    bonusMonths?: number;
    aiCredits?: number;
}) {
    if (params.type === 'livrable_share') {
        return recordLivrableContribution(params.title);
    }
    const profile = getUserRewardsProfile();
    return {
        success: true,
        earnedMonths: 0,
        earnedCredits: params.aiCredits ?? 10,
        totalCredits: profile.aiCreditsBalance,
        newBadge: profile.contributorBadge,
        isFirstContribution: profile.totalContributions === 0
    };
}
