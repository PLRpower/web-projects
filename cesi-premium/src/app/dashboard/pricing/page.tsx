import Pricing from '@/components/Pricing';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isUserPremium } from '@/lib/subscription';

export default async function DashboardPricingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?redirectTo=/dashboard/pricing');
    }

    // If user is already Premium, they no longer need to see the pricing page
    if (isUserPremium(user)) {
        redirect('/dashboard/profile');
    }

    return <Pricing />;
}
