import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize admin/service Supabase client if service key exists, or standard client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    try {
        if (webhookSecret && signature) {
            event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        } else {
            // Fallback for development/testing without webhook secret configured
            event = JSON.parse(rawBody);
        }
    } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as any;
                const userId = session.metadata?.userId || session.client_reference_id;
                const userEmail = session.customer_details?.email || session.metadata?.userEmail;
                const planType = session.metadata?.planType || 'annual';
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                console.log(`✅ Checkout completed for user ${userId || userEmail} (${planType})`);

                if (userId) {
                    await supabaseAdmin.auth.admin.updateUserById(userId, {
                        user_metadata: {
                            is_premium: true,
                            subscription_tier: 'Premium',
                            subscription_plan: planType,
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            subscription_created_at: new Date().toISOString(),
                        }
                    }).catch(err => console.warn('Supabase admin update error (non-fatal):', err));
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as any;
                const customerId = subscription.customer;

                console.log(`⚠️ Subscription canceled for customer ${customerId}`);

                // Find user by stripe_customer_id and revoke premium
                const { data: users } = await supabaseAdmin.auth.admin.listUsers();
                const matchedUser = users?.users.find(u => u.user_metadata?.stripe_customer_id === customerId);

                if (matchedUser) {
                    await supabaseAdmin.auth.admin.updateUserById(matchedUser.id, {
                        user_metadata: {
                            is_premium: false,
                            subscription_tier: 'Découverte',
                            subscription_plan: 'free',
                            subscription_canceled_at: new Date().toISOString(),
                        }
                    }).catch(err => console.warn('Supabase revoke error:', err));
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as any;
                console.log(`💰 Payment succeeded for invoice ${invoice.id}`);
                break;
            }

            default:
                console.log(`Unhandled Stripe event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Error processing Stripe webhook:', err);
        return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
    }
}
