'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function login(previousState: any, formData: FormData) {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        redirect('/')
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err; // Re-throw Next.js internal redirect
        }
        console.error('Supabase login error:', err);
        return { error: "Impossible de joindre le serveur Supabase. Vérifiez votre URL Supabase dans .env.local." }
    }
}

export async function signup(previousState: any, formData: FormData) {
    try {
        const supabase = await createClient()

        const email = formData.get('email') as string

        if (!email || !email.endsWith('@viacesi.fr')) {
            return { error: "Veuillez utiliser votre adresse email CESI (@viacesi.fr)" }
        }
        const password = formData.get('password') as string
        const firstname = formData.get('firstname') as string
        const lastname = formData.get('lastname') as string

        const data = {
            email,
            password,
            options: {
                data: {
                    firstname,
                    lastname,
                }
            }
        }

        const { error } = await supabase.auth.signUp(data)

        if (error) {
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        redirect('/')
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err; // Re-throw Next.js internal redirect
        }
        console.error('Supabase signup error:', err);
        return { error: "Impossible de joindre le serveur Supabase. Vérifiez votre URL Supabase dans .env.local." }
    }
}

function formatAuthError(error: any): string {
    const msg = (error?.message || error?.toString() || '').toLowerCase();
    if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        return "Limite d'envoi d'emails atteinte par Supabase (serveur d'email par défaut). Veuillez patienter quelques minutes avant de refaire une demande.";
    }
    if (msg.includes('invalid login credentials')) {
        return "Identifiants invalides. Vérifiez votre email et mot de passe.";
    }
    if (msg.includes('user already registered')) {
        return "Un compte existe déjà avec cette adresse email.";
    }
    if (msg.includes('password should be at least')) {
        return "Le mot de passe doit contenir au moins 6 caractères.";
    }
    return error?.message || "Une erreur est survenue lors de l'opération.";
}

export async function forgotPassword(previousState: any, formData: FormData) {
    try {
        const supabase = await createClient()
        const email = formData.get('email') as string

        if (!email) {
            return { error: "Veuillez renseigner votre adresse email." }
        }

        if (!email.endsWith('@viacesi.fr')) {
            return { error: "Veuillez utiliser votre adresse email CESI (@viacesi.fr)" }
        }

        const headersList = await headers()
        const host = headersList.get('host') || 'localhost:3000'
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
        const origin = `${protocol}://${host}`

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
            return { error: formatAuthError(error) }
        }

        return {
            success: true,
            email,
            message: "Un email contenant le lien de réinitialisation vous a été envoyé."
        }
    } catch (err: any) {
        console.error('Supabase forgot password error:', err);
        return { error: formatAuthError(err) }
    }
}

export async function verifyRecoveryOtpAndResetPassword(previousState: any, formData: FormData) {
    try {
        const supabase = await createClient()
        const email = (formData.get('email') as string)?.trim()
        const code = (formData.get('code') as string)?.trim()
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!email || !code) {
            return { error: "Veuillez renseigner votre email et le code de vérification." }
        }

        if (!password || password.length < 6) {
            return { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." }
        }

        if (password !== confirmPassword) {
            return { error: "Les deux mots de passe ne correspondent pas." }
        }

        // 1. Verify the OTP code
        const { error: otpError } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'recovery',
        })

        if (otpError) {
            return { error: `Code de vérification invalide ou expiré (${otpError.message}).` }
        }

        // 2. Update the user password
        const { error: updateError } = await supabase.auth.updateUser({ password })

        if (updateError) {
            return { error: `Erreur lors de la mise à jour : ${updateError.message}` }
        }

        revalidatePath('/', 'layout')
        redirect('/login?reset=success')
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err;
        }
        console.error('Supabase OTP reset error:', err);
        return { error: "Erreur lors de la réinitialisation du mot de passe." }
    }
}

export async function resetPassword(previousState: any, formData: FormData) {
    try {
        const supabase = await createClient()
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!password || password.length < 6) {
            return { error: "Le mot de passe doit contenir au moins 6 caractères." }
        }

        if (password !== confirmPassword) {
            return { error: "Les deux mots de passe ne correspondent pas." }
        }

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            return { error: error.message }
        }

        revalidatePath('/', 'layout')
        redirect('/login?reset=success')
    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
            throw err; // Re-throw Next.js internal redirect
        }
        console.error('Supabase update password error:', err);
        return { error: "Erreur lors de la mise à jour du mot de passe." }
    }
}
