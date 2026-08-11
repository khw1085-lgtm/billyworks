import { ArrowRight, MessageCircle, PenLine, X } from 'lucide-react'
import type { Apartment, Post } from '../types'
import { apartmentPath, navigate } from '../lib/navigation'

type Props = { apartment: Apartment; posts: Post[]; onClose: () => void; onWrite: () => void }

export function ApartmentPanel({ apartment, posts, onClose, onWrite }: Props) {
  const recent = posts.filter((post) => post.apartmentId === apartment.id && post.status === 'visible').slice(0, 3)
  return (
    <aside className="apartment-panel" aria-label={`${apartment.name} 요약`}>
      <div className="sheet-handle" aria-hidden="true" />
      <header>
        <div><span className="eyebrow">불만 {apartment.postCount}개</span><h2>{apartment.name}</h2><p>{apartment.address}</p></div>
        <button className="icon-button" onClick={onClose} aria-label="단지 정보 닫기"><X size={20} /></button>
      </header>
      <div className="topic-summary"><span>많이 언급돼요</span>{apartment.topics.map((topic) => <b key={topic}>{topic}</b>)}</div>
      <div className="recent-list">
        {recent.length ? recent.map((post) => (
          <article key={post.id}><span>{post.category}</span><p>{post.content}</p><small><MessageCircle size={13} /> 댓글 {post.commentCount}</small></article>
        )) : <div className="empty-mini"><p>아직 등록된 한마디가 없어요.</p><span>첫 번째로 솔직하게 남겨보세요.</span></div>}
      </div>
      <div className="panel-actions">
        <button className="primary-button" onClick={onWrite}><PenLine size={18} />여기에 한마디 쓰기</button>
        <button className="text-button" onClick={() => navigate(apartmentPath(apartment.id))}>게시판 전체 보기 <ArrowRight size={17} /></button>
      </div>
    </aside>
  )
}
