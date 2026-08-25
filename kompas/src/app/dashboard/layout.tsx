import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileHeader from '@/components/dashboard/MobileHeader';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col md:flex-row">
            <Sidebar />
            <MobileHeader />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
