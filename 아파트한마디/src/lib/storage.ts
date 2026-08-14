import type { Post, ReportReason } from '../types'

const POST_KEY = 'hanmadi:posts'
const ID_KEY = 'hanmadi:anonymous-id'
const ACTION_KEY = 'hanmadi:actions'
const REPORT_KEY = 'hanmadi:reports'

export function getAnonymousId() {
  const existing = localStorage.getItem(ID_KEY)
  if (existing) return existing
  const id = `익명 ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  localStorage.setItem(ID_KEY, id)
  return id
}

export function loadPosts(seed: Post[]) {
  try {
    const saved = JSON.parse(localStorage.getItem(POST_KEY) || '[]') as Post[]
    return [...saved.map((post) => ({ ...post, sentiment: post.sentiment ?? 'negative' as const })), ...seed]
  } catch {
    return seed
  }
}

export function saveOwnPosts(posts: Post[]) {
  localStorage.setItem(POST_KEY, JSON.stringify(posts.filter((post) => post.mine)))
}

export function actionOnce(action: string, id: string) {
  const key = `${action}:${id}`
  const actions = JSON.parse(localStorage.getItem(ACTION_KEY) || '[]') as string[]
  if (actions.includes(key)) return false
  localStorage.setItem(ACTION_KEY, JSON.stringify([...actions, key]))
  return true
}

export function canSubmit(content: string, posts: Post[]) {
  const normalized = content.trim().replace(/\s+/g, ' ')
  if (posts.some((post) => post.mine && post.content.replace(/\s+/g, ' ') === normalized)) {
    return '같은 내용을 반복해서 등록할 수 없어요.'
  }
  const lastAt = Number(localStorage.getItem('hanmadi:last-post-at') || 0)
  if (Date.now() - lastAt < 15_000) return '잠시 후 다시 등록해주세요. 도배 방지를 위해 15초 간격을 두고 있어요.'
  return null
}

export function markSubmitted() {
  localStorage.setItem('hanmadi:last-post-at', String(Date.now()))
}

export function saveReport(postId: string, reason: ReportReason, detail: string) {
  const reports = JSON.parse(localStorage.getItem(REPORT_KEY) || '[]') as unknown[]
  reports.push({ id: crypto.randomUUID(), postId, reason, detail, status: 'pending', createdAt: new Date().toISOString() })
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports))
}
