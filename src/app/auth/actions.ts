'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(previousState: any, formData: FormData) {
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
}

export async function signup(previousState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    if (!email.endsWith('@viacesi.fr')) {
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
}
