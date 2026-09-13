import { createClient } from '@supabase/supabase-js';

export type StorageBucket = 'cctl' | 'prosits' | 'livrables';

export const STORAGE_BUCKETS = {
    CCTL: 'cctl' as StorageBucket,
    PROSITS: 'prosits' as StorageBucket,
    LIVRABLES: 'livrables' as StorageBucket,
};

function getStorageClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        '';

    if (!supabaseUrl || !supabaseKey) {
        console.warn('[Supabase Storage] Missing Supabase URL or Key');
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

/**
 * Upload a file to a Supabase storage bucket
 */
export async function uploadToSupabaseStorage(
    bucket: StorageBucket,
    filePath: string,
    fileBuffer: Buffer | Uint8Array,
    contentType: string = 'application/pdf',
    upsert: boolean = true
): Promise<{ success: boolean; error?: string; path?: string }> {
    try {
        const supabase = getStorageClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
                contentType,
                upsert,
            });

        if (error) {
            console.error(`[Supabase Storage] Upload error in bucket '${bucket}' at '${filePath}':`, error);
            return { success: false, error: error.message };
        }

        return { success: true, path: data?.path || filePath };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erreur inconnue de stockage';
        console.error(`[Supabase Storage] Unexpected upload error:`, e);
        return { success: false, error: message };
    }
}

/**
 * Download a file buffer from a Supabase storage bucket
 */
export async function downloadFromSupabaseStorage(
    bucket: StorageBucket,
    filePath: string
): Promise<Buffer | null> {
    try {
        const supabase = getStorageClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .download(filePath);

        if (error || !data) {
            console.warn(`[Supabase Storage] File not found or error in '${bucket}/${filePath}':`, error?.message);
            return null;
        }

        const arrayBuffer = await data.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (e: unknown) {
        console.error(`[Supabase Storage] Unexpected download error in '${bucket}/${filePath}':`, e);
        return null;
    }
}

/**
 * Delete a file or list of files from a Supabase storage bucket
 */
export async function deleteFromSupabaseStorage(
    bucket: StorageBucket,
    filePaths: string | string[]
): Promise<boolean> {
    try {
        const supabase = getStorageClient();
        const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
        const { error } = await supabase.storage
            .from(bucket)
            .remove(paths);

        if (error) {
            console.error(`[Supabase Storage] Delete error in bucket '${bucket}':`, error);
            return false;
        }

        return true;
    } catch (e: unknown) {
        console.error(`[Supabase Storage] Unexpected delete error:`, e);
        return false;
    }
}

/**
 * Get a public URL for a file in a public bucket
 */
export function getSupabasePublicUrl(
    bucket: StorageBucket,
    filePath: string
): string {
    const supabase = getStorageClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Generate a temporary signed download URL for private buckets
 */
export async function getSupabaseSignedUrl(
    bucket: StorageBucket,
    filePath: string,
    expiresInSeconds: number = 3600
): Promise<string | null> {
    try {
        const supabase = getStorageClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, expiresInSeconds);

        if (error || !data?.signedUrl) {
            console.error(`[Supabase Storage] Error generating signed URL for '${bucket}/${filePath}':`, error);
            return null;
        }

        return data.signedUrl;
    } catch (e: unknown) {
        console.error(`[Supabase Storage] Unexpected signed URL error:`, e);
        return null;
    }
}
