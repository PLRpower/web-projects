'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com'

    if (token && typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(token, {
        api_host: host,
        persistence: 'memory', // Mode cookieless : aucune donnee dans les cookies ou localStorage
        person_profiles: 'identified_only', // Aucun profil anonyme stocke dans PostHog
        capture_pageview: true, // Suivi automatique des changements de page
        capture_pageleave: true,
        autocapture: true,
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
