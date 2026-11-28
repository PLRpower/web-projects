import Stripe from 'stripe';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is missing in environment variables');
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-02-24.acacia' as any,
            typescript: true,
        });
    }
    return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
    get(_target, prop, receiver) {
        const instance = getStripe();
        const value = Reflect.get(instance, prop, receiver);
        return typeof value === 'function' ? value.bind(instance) : value;
    },
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
