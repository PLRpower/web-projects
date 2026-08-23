export interface ContributionRecord {
    id: string;
    type: 'cctl_upload' | 'correction_vote' | 'livrable_share';
    title: string;
    awardedAt: string;
    bonusMonths: number;
    aiCredits: number;
}

export interface UserRewardsProfile {
    totalContributions: number;
    aiCreditsBalance: number;
    bonusMonthsEarned: number;
    contributorBadge: 'Membre' | 'Apprenti Contributeur' | 'Contributeur Actif' | 'Major Contributeur CESI';
    badgeColor: string;
    history: ContributionRecord[];
}

const DEFAULT_REWARDS_PROFILE: UserRewardsProfile = {
    totalContributions: 0,
    aiCreditsBalance: 20, // 20 free starter credits
    bonusMonthsEarned: 0,
    contributorBadge: 'Membre',
    badgeColor: 'text-text-muted',
    history: []
};

const REWARDS_STORAGE_KEY = 'kompas_rewards_data';

/**
 * Loads user rewards profile from localStorage with fallback.
 */
export function getUserRewardsProfile(): UserRewardsProfile {
    if (typeof window === 'undefined') return DEFAULT_REWARDS_PROFILE;
    try {
        const saved = localStorage.getItem(REWARDS_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
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
function resolveContributorBadge(total: number): { badge: UserRewardsProfile['contributorBadge']; color: string } {
    if (total >= 5) {
        return { badge: 'Major Contributeur CESI', color: 'text-amber-400' };
    } else if (total >= 3) {
        return { badge: 'Contributeur Actif', color: 'text-emerald-400' };
    } else if (total >= 1) {
        return { badge: 'Apprenti Contributeur', color: 'text-blue-400' };
    }
    return { badge: 'Membre', color: 'text-text-muted' };
}

/**
 * Awards bonuses for a CCTL upload or contribution.
 * Automatically unlocks +1 Month Premium and +50 AI Credits.
 */
export function claimContributionReward(params: {
    type: 'cctl_upload' | 'correction_vote' | 'livrable_share';
    title: string;
    bonusMonths?: number;
    aiCredits?: number;
}): {
    success: boolean;
    earnedMonths: number;
    earnedCredits: number;
    totalCredits: number;
    newBadge: UserRewardsProfile['contributorBadge'];
    isFirstContribution: boolean;
} {
    if (typeof window === 'undefined') {
        return {
            success: false,
            earnedMonths: 0,
            earnedCredits: 0,
            totalCredits: 20,
            newBadge: 'Membre',
            isFirstContribution: false
        };
    }

    const bonusMonths = params.bonusMonths ?? 1;
    const aiCredits = params.aiCredits ?? 50;

    const currentProfile = getUserRewardsProfile();
    const newTotal = currentProfile.totalContributions + 1;
    const isFirstContribution = currentProfile.totalContributions === 0;
    const { badge, color } = resolveContributorBadge(newTotal);

    const newRecord: ContributionRecord = {
        id: `contrib-${Date.now().toString(36)}`,
        type: params.type,
        title: params.title,
        awardedAt: new Date().toISOString(),
        bonusMonths,
        aiCredits
    };

    const updatedProfile: UserRewardsProfile = {
        totalContributions: newTotal,
        aiCreditsBalance: currentProfile.aiCreditsBalance + aiCredits,
        bonusMonthsEarned: currentProfile.bonusMonthsEarned + bonusMonths,
        contributorBadge: badge,
        badgeColor: color,
        history: [newRecord, ...currentProfile.history]
    };

    saveUserRewardsProfile(updatedProfile);

    // Synchronize local user profile to grant Premium access immediately
    try {
        const savedUserProfile = localStorage.getItem('kompas_user_profile');
        const userProfile = savedUserProfile ? JSON.parse(savedUserProfile) : {};

        const updatedUserProfile = {
            ...userProfile,
            is_premium: true,
            subscription_tier: 'Premium',
            subscription_plan: 'crowdsourced_bonus',
            contributorBadge: badge,
            aiCredits: updatedProfile.aiCreditsBalance
        };

        localStorage.setItem('kompas_user_profile', JSON.stringify(updatedUserProfile));
        window.dispatchEvent(new Event('kompas_profile_updated'));
    } catch (e) {
        console.warn('Failed to update local user profile with reward:', e);
    }

    return {
        success: true,
        earnedMonths: bonusMonths,
        earnedCredits: aiCredits,
        totalCredits: updatedProfile.aiCreditsBalance,
        newBadge: badge,
        isFirstContribution
    };
}
