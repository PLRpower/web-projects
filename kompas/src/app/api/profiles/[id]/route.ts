import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getStudentProfile, StudentProfileData } from '@/lib/student-profiles';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'profiles.json');

async function ensureProfilesFile(): Promise<Record<string, StudentProfileData>> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        let existing: Record<string, StudentProfileData> = {};
        try {
            const data = await fs.readFile(DATA_FILE, 'utf-8');
            existing = JSON.parse(data);
        } catch {
            existing = {};
            await fs.writeFile(DATA_FILE, JSON.stringify({}, null, 2), 'utf-8');
        }
        return existing;
    } catch {
        return {};
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const profiles = await ensureProfilesFile();
        const profile = profiles[id] || getStudentProfile(id);
        return NextResponse.json({ success: true, profile });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updates = await request.json();
        const profiles = await ensureProfilesFile();

        const current = profiles[id] || getStudentProfile(id);
        const updated: StudentProfileData = {
            ...current,
            ...updates,
            id
        };

        profiles[id] = updated;
        await fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf-8');

        return NextResponse.json({ success: true, profile: updated });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const profiles = await ensureProfilesFile();

        if (profiles[id]) {
            delete profiles[id];
            await fs.writeFile(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
        }

        return NextResponse.json({ success: true, message: 'Profil réinitialisé' });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
