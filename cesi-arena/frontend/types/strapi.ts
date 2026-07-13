export interface Media {
    id: number
    documentId: string
    url: string
    mime: string
    name: string
    alternativeText?: string
    caption?: string
    width?: number
    height?: number
    formats?: any
    previewUrl?: string
}

export interface Campus {
    id: number
    documentId: string
    name: string
    address?: string
    country?: string
    picture?: Media
    events?: Event[]
}

export interface Event {
    id: number
    documentId: string
    name: string
    description?: string
    start_date: string
    end_data?: string
    open_inscriptions: boolean
    type?: string
    picture?: Media
    campuses?: Campus[]
    games?: Game[]
}

export interface Game {
    id: number
    documentId: string
    name: string
    description?: string
    type?: string
    picture?: Media
    banner?: Media
    events?: Event[]
}

export interface Leaderboard {
    id: number
    documentId: string
    rank?: number
    victories?: number
}

export interface Match {
    id: number
    documentId: string
    score?: string
    start_date?: string
    hasBeenPlayed?: boolean
    team1?: Team
    team2?: Team
    winner?: Team
    game?: Game
}

export interface Player {
    id: number
    documentId: string
    pseudo?: string
    avatar?: Media[]
    team?: Team
    user?: User
}

export interface Team {
    id: number
    documentId: string
    name?: string
    acronym?: string
    logo?: Media
    captain?: Player
    players?: Player[]
}

export interface User {
    id: number
    documentId: string
    username: string
    email: string
    confirmed: boolean
    blocked: boolean
}
