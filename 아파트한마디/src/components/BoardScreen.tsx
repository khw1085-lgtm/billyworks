import { ArrowLeft, ChevronDown, PenLine } from 'lucide-react'
import { categories } from '../data/sample'
import { navigate } from '../lib/navigation'
import type { Apartment, Post } from '../types'
import { PostFeed } from './PostFeed'

type Sort = 'latest' | 'agree' | 'comments'
type Props = {
  apartment: Apartment; posts: Post[]; sort: Sort; onSort: (sort: Sort) => void; onWrite: () => void
  onReact: (id: string, type: 'agree' | 'same') => void; onComment: (id: string) => void; onReport: (id: string) => void; onShare: (post: Post) => void; onDelete: (id: string) => void
}

export function BoardScreen(props: Props) {
  const visible = props.posts.filter((post) => post.apartmentId === props.apartment.id && post.status === 'visible')
  const sorted = [...visible].sort((a, b) => props.sort === 'agree' ? b.agreeCount - a.agreeCount : props.sort === 'comments' ? b.commentCount - a.commentCount : Number(b.id.slice(1)) - Number(a.id.slice(1)))
  return <main className="board-page" id="main-content">
    <header className="board-header"><button onClick={() => navigate('/')} aria-label="지도로 돌아가기"><ArrowLeft size={21} /></button><div><span>{props.apartment.region}</span><h1>{props.apartment.name}</h1><p>{props.apartment.address}</p></div><button className="primary-button compact" onClick={props.onWrite}><PenLine size={17} />한마디</button></header>
    <section className="board-summary"><span>여기서 많이 나와요</span><div>{props.apartment.topics.map((topic, index) => <b key={topic}><i>{index + 1}</i>{topic}</b>)}</div></section>
    <div className="board-controls"><strong>익명 한마디 <b>{visible.length}</b></strong><label>정렬<select value={props.sort} onChange={(event) => props.onSort(event.target.value as Sort)}><option value="latest">최신순</option><option value="agree">공감순</option><option value="comments">댓글순</option></select><ChevronDown size={15} /></label></div>
    <PostFeed posts={sorted} onReact={props.onReact} onComment={props.onComment} onReport={props.onReport} onShare={props.onShare} onDelete={props.onDelete} />
    <button className="floating-write" onClick={props.onWrite}><PenLine size={20} />여기에 한마디 쓰기</button>
    <div className="all-topics" aria-label="제공되는 불만 주제">{categories.map((category) => <span key={category}>{category}</span>)}</div>
  </main>
}
