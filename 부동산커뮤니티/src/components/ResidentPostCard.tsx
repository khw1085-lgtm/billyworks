import { Bookmark, Heart, MessageCircle, MoreHorizontal, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { Post } from '../types'
import { VerificationBadge } from './VerificationBadge'

export function ResidentPostCard({ post, onComplex, onOpen, onReport }: { post: Post; onComplex: () => void; onOpen: () => void; onReport: () => void }) {
  const [helpful, setHelpful] = useState(false)
  const [saved, setSaved] = useState(false)
  return <article className="post-card">
    <header className="post-author"><span className="avatar post-avatar">{post.avatar}</span><div className="author-copy"><strong>{post.author}</strong><VerificationBadge status={post.verified} /><span>{post.time}</span></div><button className="icon-button more-button" aria-label="게시물 메뉴" onClick={onReport}><MoreHorizontal size={20} /></button></header>
    <button className="residence-context" onClick={onComplex}><span><strong>{post.complex}</strong><small>{post.location}</small></span><span><b>{post.score.toFixed(1)}</b><small>{post.period}</small></span></button>
    <button className="post-body" onClick={onOpen}><span className="post-topic">{post.topic}</span>{post.summary && <h2>{post.summary}</h2>}<p>{post.content}</p><span className="resident-meta">{post.family}</span></button>
    <footer className="post-actions"><button className={helpful ? 'action active' : 'action'} aria-pressed={helpful} onClick={() => setHelpful(!helpful)}><Heart size={18} fill={helpful ? 'currentColor' : 'none'} />도움돼요 <b>{post.helpful + (helpful ? 1 : 0)}</b></button><button className="action" onClick={onOpen}><MessageCircle size={18} />댓글 <b>{post.comments}</b></button><span className="action-spacer" /><button className={saved ? 'action icon-only active' : 'action icon-only'} aria-label="저장" aria-pressed={saved} onClick={() => setSaved(!saved)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button><button className="action icon-only" aria-label="공유"><Share2 size={19} /></button></footer>
  </article>
}
