import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PLANS, PlanType } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const plan: PlanType = body.plan === 'monthly' ? 'monthly' : 'annual';
        const planConfig = STRIPE_PLANS[plan];

        // 1. Get origin / base URL
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // 2. Identify Supabase user if logged in
        let userId: string | undefined;
        let userEmail: string | undefined;
        let customerId: string | undefined;

        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                userId = user.id;
                userEmail = user.email;
                customerId = user.user_metadata?.stripe_customer_id;
            }
        } catch (e) {
            console.warn('Could not load Supabase session for Stripe checkout:', e);
        }

        // 3. If customer already exists in Stripe, reuse; otherwise create or use email
        let customerParams: { customer?: string; customer_email?: string } = {};
        if (customerId) {
            customerParams = { customer: customerId };
        } else if (userEmail) {
            customerParams = { customer_email: userEmail };
        }

        // 4. Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            ...customerParams,
            line_items: [
                {
                    price_data: {
                        currency: planConfig.currency,
                        product_data: {
                            name: planConfig.name,
                            description: planConfig.description,
                            images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'],
                        },
                        unit_amount: planConfig.amount,
                        recurring: {
                            interval: planConfig.interval,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            client_reference_id: userId,
            metadata: {
                userId: userId || '',
                userEmail: userEmail || '',
                planType: plan,
            },
            subscription_data: {
                metadata: {
                    userId: userId || '',
                    userEmail: userEmail || '',
                    planType: plan,
                },
            },
            success_url: `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/pricing?canceled=true`,
        });

        return NextResponse.json({ success: true, url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Session error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erreur lors de la création de la session de paiement' },
            { status: 500 }
        );
    }
}
