import { User } from '@supabase/supabase-js';
import { isAdminUser, isAdminEmail } from '@/lib/admin';

export type SubscriptionPlan = 'free' | 'monthly' | 'annual';
export type SubscriptionTier = 'Découverte' | 'Premium';

export interface UserSubscriptionDetails {
    tier: SubscriptionTier;
    plan: SubscriptionPlan;
    isPremium: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    expiresAt?: string;
    subscribedAt?: string;
}

/**
 * Extract subscription info from Supabase user object or localStorage fallback
 */
export function getUserSubscription(user: User | null): UserSubscriptionDetails {
    if (!user) {
        // Check localStorage as client fallback if available
        if (typeof window !== 'undefined') {
            try {
                const localProfile = localStorage.getItem('kompas_user_profile');
                if (localProfile) {
                    const parsed = JSON.parse(localProfile);
                    if (
                        parsed.isPremium ||
                        parsed.subscriptionTier === 'Premium' ||
                        parsed.subscriptionTier === 'Ultime' ||
                        parsed.role === 'admin' ||
                        isAdminEmail(parsed.email)
                    ) {
                        return {
                            tier: 'Premium',
                            plan: parsed.subscriptionPlan || 'annual',
                            isPremium: true,
                            expiresAt: parsed.subscriptionExpiresAt,
                            subscribedAt: parsed.subscriptionSubscribedAt,
                        };
                    }
                }
            } catch (e) {
                console.error('Error reading local subscription fallback:', e);
            }
        }
        return {
            tier: 'Découverte',
            plan: 'free',
            isPremium: false,
        };
    }

    const meta = user.user_metadata || {};
    const isPremium = Boolean(
        isAdminUser(user) ||
        meta.is_premium === true ||
        meta.subscription_tier === 'Premium' ||
        meta.subscription_tier === 'Ultime' ||
        meta.role === 'admin'
    );

    return {
        tier: isPremium ? 'Premium' : 'Découverte',
        plan: (meta.subscription_plan as SubscriptionPlan) || (isPremium ? 'annual' : 'free'),
        isPremium,
        stripeCustomerId: meta.stripe_customer_id,
        stripeSubscriptionId: meta.stripe_subscription_id,
        expiresAt: meta.subscription_expires_at,
        subscribedAt: meta.subscription_created_at,
    };
}

/**
 * Check if the user has full premium access
 */
export function isUserPremium(user: User | null): boolean {
    return getUserSubscription(user).isPremium;
}

/**
 * Check if user can access full CCTL questions
 * Free tier is limited to 15 questions per test or 3 free CCTLs
 */
export function checkCCTLLimit(user: User | null, questionIndex: number): { allowed: boolean; reason?: string } {
    if (isUserPremium(user)) {
        return { allowed: true };
    }

    const FREE_QUESTION_LIMIT = 15;
    if (questionIndex >= FREE_QUESTION_LIMIT) {
        return {
            allowed: false,
            reason: `Limite du compte Découverte atteinte (${FREE_QUESTION_LIMIT} questions/jour). Passez à Kompas Premium pour un accès illimité à toutes les annales.`
        };
    }

    return { allowed: true };
}

/**
 * Check if user can use AI Tutor features
 */
export function checkAITutorAccess(user: User | null): { allowed: boolean; reason?: string } {
    if (isUserPremium(user)) {
        return { allowed: true };
    }

    return {
        allowed: false,
        reason: 'Le tuteur IA avec explication pas-à-pas et corrections détaillées est réservé aux membres Kompas Premium.'
    };
}
