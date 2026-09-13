/**
 * User Resource Ownership Management
 * Handles tracking, persistence, and verification of user ownership for
 * CCTLs, Prosits, Livrables, Flashcards, and Fiches (Resources),
 * even when published in anonymous mode.
 */

export type OwnedResourceType = 'cctl' | 'prosit' | 'livrable' | 'resource' | 'flashcard';

export interface OwnershipUser {
    id?: string;
    email?: string;
    name?: string;
}

export interface ResourceOwnershipItem {
    id: string;
    authorId?: string;
    authorEmail?: string;
    authorName?: string;
    author?: string;
    isAnonymous?: boolean;
}

const OWNERSHIP_STORAGE_KEY = 'kompas_user_owned_resources';

/**
 * Retrieve list of resource IDs created/owned by the current user locally.
 */
export function getOwnedItemIds(type: OwnedResourceType): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(OWNERSHIP_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed[type]) ? parsed[type] : [];
    } catch {
        return [];
    }
}

/**
 * Save resource ownership to localStorage and trigger an update event.
 */
export function recordItemOwnership(type: OwnedResourceType, id: string): void {
    if (typeof window === 'undefined' || !id) return;
    try {
        const raw = localStorage.getItem(OWNERSHIP_STORAGE_KEY);
        const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
        const currentList = Array.isArray(map[type]) ? map[type] : [];
        if (!currentList.includes(id)) {
            map[type] = [id, ...currentList];
            localStorage.setItem(OWNERSHIP_STORAGE_KEY, JSON.stringify(map));
            window.dispatchEvent(new CustomEvent('kompas_ownership_updated', { detail: { type, id } }));
        }
    } catch (e) {
        console.error('Error recording item ownership:', e);
    }
}

/**
 * Remove resource ownership from localStorage.
 */
export function removeItemOwnership(type: OwnedResourceType, id: string): void {
    if (typeof window === 'undefined' || !id) return;
    try {
        const raw = localStorage.getItem(OWNERSHIP_STORAGE_KEY);
        if (!raw) return;
        const map: Record<string, string[]> = JSON.parse(raw);
        if (Array.isArray(map[type])) {
            map[type] = map[type].filter(itemId => itemId !== id);
            localStorage.setItem(OWNERSHIP_STORAGE_KEY, JSON.stringify(map));
            window.dispatchEvent(new CustomEvent('kompas_ownership_updated', { detail: { type, id } }));
        }
    } catch (e) {
        console.error('Error removing item ownership:', e);
    }
}

/**
 * Verify if the current user owns the given resource item.
 * Supports:
 * - Admin bypass (if isAdmin is true)
 * - LocalStorage registered ownership IDs (covers anonymous deposits on this device)
 * - Supabase User ID match (authorId)
 * - Email match (authorEmail)
 * - Public name match (only when non-anonymous)
 */
export function isItemOwner(
    type: OwnedResourceType,
    item: ResourceOwnershipItem | null | undefined,
    user?: OwnershipUser | null,
    isAdmin?: boolean
): boolean {
    if (!item) return false;
    if (isAdmin) return true;

    // 1. Check local storage owned IDs (works for anonymous deposits)
    const ownedIds = getOwnedItemIds(type);
    if (ownedIds.includes(item.id)) {
        return true;
    }

    // 2. Check Supabase User ID
    if (user?.id && item.authorId && user.id === item.authorId) {
        return true;
    }

    // 3. Check User Email
    if (user?.email && item.authorEmail && user.email.toLowerCase() === item.authorEmail.toLowerCase()) {
        return true;
    }

    // 4. Non-anonymous display name match
    if (!item.isAnonymous && user?.name) {
        const author = item.authorName || item.author;
        if (author && author.toLowerCase() === user.name.toLowerCase()) {
            return true;
        }
    }

    return false;
}

/**
 * Quick helper to check if a user or admin can manage (edit/delete) a resource.
 */
export function canManageResource(
    type: OwnedResourceType,
    item: ResourceOwnershipItem | null | undefined,
    user?: OwnershipUser | null,
    isAdmin?: boolean
): boolean {
    return Boolean(isAdmin || isItemOwner(type, item, user, isAdmin));
}
