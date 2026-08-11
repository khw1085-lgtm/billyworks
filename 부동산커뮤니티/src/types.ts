export type View = 'home' | 'search' | 'map' | 'notifications' | 'profile' | 'complex' | 'report'

export type Post = {
  id: number; author: string; avatar: string; verified: 'current' | 'past' | 'none'
  complex: string; location: string; period: string; family: string; topic: string
  time: string; content: string; summary?: string; helpful: number; comments: number; score: number
}

export type Complex = {
  name: string; location: string; reports: number; residents: number; score: number
  positive: string[]; negative: string[]
}
