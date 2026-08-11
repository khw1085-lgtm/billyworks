import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bot, X } from 'lucide-react'
import { categories } from '../data/sample'
import type { Apartment, Category } from '../types'

const starters = [
  '여기 주차가 진짜 짜증 나는 이유는…', '관리비는 비싼데…', '밤마다 가장 스트레스받는 건…',
  '이사 오기 전에 알았으면 좋았을 점은…', '요즘 우리 단지에서 제일 심각한 건…', '솔직히 이 아파트 장점보다 단점은…',
]

type Props = { apartment: Apartment; onClose: () => void; onSubmit: (category: Category, content: string) => string | null }

export function WriteDialog({ apartment, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState<Category>('층간소음')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => closeRef.current?.focus(), [])
  const submit = () => {
    if (content.trim().length < 10) return setError('조금만 더 자세히 적어주세요. 최소 10자예요.')
    const result = onSubmit(category, content)
    if (result) setError(result)
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="write-dialog" role="dialog" aria-modal="true" aria-labelledby="write-title">
        <header><button ref={closeRef} onClick={onClose} aria-label="글쓰기 닫기"><X size={21} /></button><span>로그인 없이 바로 등록</span></header>
        <div className="write-body">
          <span className="eyebrow">{apartment.address}</span>
          <h2 id="write-title">{apartment.name}에<br />한마디 남기기</h2>
          <p>살면서 짜증 났던 점을 편하게 써주세요. 욕은 괜찮지만 특정 사람의 신상 공개나 협박은 안 됩니다.</p>
          <fieldset><legend>무엇 때문에 짜증 났나요?</legend><div className="category-grid">{categories.map((item) => <button type="button" className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></fieldset>
          <label htmlFor="complaint">한마디</label>
          <textarea id="complaint" value={content} maxLength={500} onChange={(event) => { setContent(event.target.value); setError('') }} placeholder="솔직하게 적어주세요." />
          <div className="starters" aria-label="추천 시작 문장"><span>이렇게 시작해보세요</span>{starters.slice(0, 3).map((starter) => <button type="button" key={starter} onClick={() => setContent(starter.replace('…', ' '))}><ArrowLeft size={14} />{starter}</button>)}</div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <footer><button className="primary-button" onClick={submit}>익명으로 등록</button><small><Bot size={13} /> 자동 봇·반복 등록 검사를 진행합니다. 특정인 식별 정보는 임시 숨김될 수 있어요.</small></footer>
      </section>
    </div>
  )
}
