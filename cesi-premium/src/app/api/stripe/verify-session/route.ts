import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ success: false, error: 'Session ID requis' }, { status: 400 });
        }

        // 1. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'customer'],
        });

        if (!session || (session.payment_status !== 'paid' && session.status !== 'complete')) {
            return NextResponse.json({ success: false, error: 'Paiement non confirmé' }, { status: 400 });
        }

        const planType = session.metadata?.planType || 'annual';
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

        // 2. Update Supabase User Metadata if session exists
        try {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                await supabase.auth.updateUser({
                    data: {
                        is_premium: true,
                        subscription_tier: 'Premium',
                        subscription_plan: planType,
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        subscription_created_at: new Date().toISOString(),
                    }
                });
            }
        } catch (supaErr) {
            console.warn('Could not sync to Supabase user in verify-session:', supaErr);
        }

        return NextResponse.json({
            success: true,
            isPremium: true,
            plan: planType,
            customerEmail: session.customer_details?.email,
        });
    } catch (error: any) {
        console.error('Verify session error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Erreur lors de la vérification de la session' },
            { status: 500 }
        );
    }
}
