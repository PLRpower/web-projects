import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia' as any,
    typescript: true,
});

export const STRIPE_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Kompas Premium (Mensuel)',
        amount: 499, // in cents (4.99 €)
        currency: 'eur',
        interval: 'month' as const,
        description: 'Accès illimité à Kompas | CESI (Sans engagement)',
    },
    annual: {
        id: 'annual',
        name: 'Kompas Premium (Annuel)',
        amount: 3999, // in cents (39.99 €)
        currency: 'eur',
        interval: 'year' as const,
        description: 'Accès illimité pour toute l\'année académique (4 mois offerts)',
    },
} as const;

export type PlanType = keyof typeof STRIPE_PLANS;
