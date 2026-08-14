import { Flag, Heart, MessageCircle, Share2, ThumbsUp, Trash2 } from 'lucide-react'
import type { Post } from '../types'

type Props = {
  posts: Post[]
  onReact: (postId: string, type: 'agree' | 'same') => void
  onComment: (postId: string) => void
  onReport: (postId: string) => void
  onShare: (post: Post) => void
  onDelete: (postId: string) => void
}

export function PostFeed({ posts, onReact, onComment, onReport, onShare, onDelete }: Props) {
  if (!posts.length) return <div className="empty-state"><h2>아직 한마디가 없어요</h2><p>눈치 보지 말고 첫 번째 이야기를 남겨보세요.</p></div>
  return <div className="post-feed">{posts.map((post) => (
    <article className={`post-item sentiment-${post.sentiment}`} key={post.id} id={post.id}>
      <header><strong>{post.anonymousId}</strong><time>{post.createdAt}</time><span className={`sentiment-badge ${post.sentiment}`}>{post.sentiment === 'positive' ? '장점' : '불만'}</span><span className="category-badge">{post.category}</span></header>
      <p>{post.content}</p>
      <footer>
        <button onClick={() => onReact(post.id, 'agree')} aria-label={`공감 ${post.agreeCount}`}><Heart size={18} /><span>공감</span><b>{post.agreeCount}</b></button>
        <button onClick={() => onReact(post.id, 'same')} aria-label={`나도 그래요 ${post.sameCount}`}><ThumbsUp size={18} /><span>나도 그래요</span><b>{post.sameCount}</b></button>
        <button onClick={() => onComment(post.id)} aria-label={`댓글 ${post.commentCount}`}><MessageCircle size={18} /><b>{post.commentCount}</b></button>
        <span className="action-spacer" />
        <button onClick={() => onShare(post)} aria-label="공유"><Share2 size={18} /></button>
        <button onClick={() => onReport(post.id)} aria-label="신고"><Flag size={18} /></button>
        {post.mine && <button onClick={() => onDelete(post.id)} aria-label="내 게시물 삭제"><Trash2 size={18} /></button>}
      </footer>
    </article>
  ))}</div>
}
