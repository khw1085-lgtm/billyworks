import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export function CommentDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (content: string) => void }) {
  const [content, setContent] = useState('')
  return <div className="modal-backdrop"><section className="comment-dialog" role="dialog" aria-modal="true" aria-labelledby="comment-title">
    <header><h2 id="comment-title"><MessageCircle size={19} />익명 댓글</h2><button onClick={onClose} aria-label="댓글 닫기"><X size={20} /></button></header>
    <p>로그인 없이 등록됩니다. 특정인을 알아볼 수 있는 정보는 적지 마세요.</p>
    <textarea autoFocus value={content} onChange={(event) => setContent(event.target.value)} placeholder="댓글을 입력하세요" maxLength={300} />
    <footer><button className="text-button" onClick={onClose}>취소</button><button className="primary-button" disabled={content.trim().length < 2} onClick={() => onSubmit(content)}>댓글 등록</button></footer>
  </section></div>
}
