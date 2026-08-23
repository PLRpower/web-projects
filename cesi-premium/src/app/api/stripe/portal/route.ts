import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Non authentifié' }, { status: 401 });
        }

        let customerId = user.user_metadata?.stripe_customer_id;

        // If no customer ID in metadata, try finding by email in Stripe
        if (!customerId && user.email) {
            const customers = await stripe.customers.list({ email: user.email, limit: 1 });
            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                // Update Supabase user metadata
                await supabase.auth.updateUser({
                    data: { stripe_customer_id: customerId }
                }).catch(() => {});
            }
        }

        if (!customerId) {
            return NextResponse.json(
                { success: false, error: 'Aucun abonnement Stripe actif trouvé pour ce compte' },
                { status: 404 }
            );
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/dashboard/profile`,
        });

        return NextResponse.json({ success: true, url: portalSession.url });
    } catch (error: any) {
        console.error('Stripe Portal error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Impossible d\'accéder au portail de facturation' },
            { status: 500 }
        );
    }
}
