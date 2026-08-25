import { User } from '@supabase/supabase-js';

export const ADMIN_EMAILS: string[] = [
    // Renseigner ici les adresses email des administrateurs ou via NEXT_PUBLIC_ADMIN_EMAILS / ADMIN_EMAILS
];

/**
 * Check if a given email is in the admin list
 */
export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    
    // Check built-in list
    if (ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === cleanEmail)) {
        return true;
    }

    // Check environment variable list if configured
    const envAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS;
    if (envAdminEmails) {
        const list = envAdminEmails.split(',').map(e => e.trim().toLowerCase());
        if (list.includes(cleanEmail)) {
            return true;
        }
    }

    return false;
}

/**
 * Check if a Supabase User object has admin privileges
 */
export function isAdminUser(user: User | null | undefined): boolean {
    if (!user) return false;

    // Check email
    if (user.email && isAdminEmail(user.email)) {
        return true;
    }

    // Check metadata
    const meta = user.user_metadata || {};
    if (meta.role === 'admin' || meta.is_admin === true || meta.role === 'administrator') {
        return true;
    }

    return false;
}

/**
 * Client-side helper checking local storage and user metadata
 */
export function checkIsAdminClient(user?: User | null): boolean {
    if (user && isAdminUser(user)) return true;

    if (typeof window !== 'undefined') {
        try {
            // 1. Direct profile
            const savedProfile = localStorage.getItem('kompas_user_profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                if (parsed.email && isAdminEmail(parsed.email)) return true;
                if (parsed.role === 'admin' || parsed.isAdmin === true) return true;
            }

            // 2. Direct email keys
            const emailKeys = ['kompas_user_email', 'user_email', 'email', 'userEmail'];
            for (const k of emailKeys) {
                const val = localStorage.getItem(k);
                if (val && isAdminEmail(val)) return true;
            }

            // 3. Supabase Auth localStorage tokens (sb-*-auth-token)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('sb-') || key.includes('auth-token') || key.includes('supabase'))) {
                    const item = localStorage.getItem(key);
                    if (item && (item.includes('"role":"admin"') || item.includes('"is_admin":true'))) {
                        return true;
                    }
                }
            }
        } catch {
            // Ignore storage errors
        }
    }

    return false;
}

