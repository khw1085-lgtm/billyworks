import { ArrowLeft, Flame } from 'lucide-react'
import { useState } from 'react'
import type { Apartment, Post } from '../types'
import { apartmentPath, navigate } from '../lib/navigation'
import { PostFeed } from './PostFeed'

type Props = { apartments: Apartment[]; posts: Post[]; onReact: (id: string, type: 'agree' | 'same') => void; onComment: (id: string) => void; onReport: (id: string) => void; onShare: (post: Post) => void; onDelete: (id: string) => void }

export function HotScreen(props: Props) {
  const [filter, setFilter] = useState('지금 뜨는 글')
  const hotPosts = [...props.posts].filter((post) => post.status === 'visible').sort((a, b) => b.agreeCount - a.agreeCount)
  return <main className="hot-page" id="main-content">
    <header className="section-header"><button onClick={() => navigate('/')} aria-label="뒤로"><ArrowLeft size={21} /></button><span><Flame size={18} />전국에서 반응이 커요</span><h1>인기 한마디</h1><p>장점과 불만을 가리지 않고 많은 사람이 공감한 실제 경험을 먼저 보여드려요.</p></header>
    <div className="filter-row">{['지금 뜨는 글', '오늘', '이번 주', '내 주변', '급증 아파트'].map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
    <div className="hot-apartment-links">{props.apartments.filter((item) => item.trending).map((item) => <button key={item.id} onClick={() => navigate(apartmentPath(item.id))}><Flame size={16} /><span><strong>{item.name}</strong><small>{item.region} · 장점 {item.positiveCount ?? 0} · 불만 {item.negativeCount ?? 0}</small></span></button>)}</div>
    <PostFeed posts={hotPosts} onReact={props.onReact} onComment={props.onComment} onReport={props.onReport} onShare={props.onShare} onDelete={props.onDelete} />
  </main>
}
