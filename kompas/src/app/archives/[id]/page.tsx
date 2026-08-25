import { redirect } from 'next/navigation';

export default async function ArchivesIdRedirectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    redirect(`/cctl/${id}`);
}
