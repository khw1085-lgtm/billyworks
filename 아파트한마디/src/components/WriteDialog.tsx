import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Bot, Frown, Smile, X } from 'lucide-react'
import { negativeCategories, positiveCategories } from '../data/sample'
import type { Apartment, Category, Sentiment } from '../types'

const negativeStarters = [
  '여기 주차가 진짜 짜증 나는 이유는…', '관리비는 비싼데…', '밤마다 가장 스트레스받는 건…',
]
const positiveStarters = ['살면서 가장 만족스러운 점은…', '다른 단지보다 특히 좋은 점은…', '이사 오길 잘했다고 느낄 때는…']

type Props = { apartment: Apartment; onClose: () => void; onSubmit: (sentiment: Sentiment, category: Category, content: string) => string | null }

export function WriteDialog({ apartment, onClose, onSubmit }: Props) {
  const [sentiment, setSentiment] = useState<Sentiment>('positive')
  const [category, setCategory] = useState<Category>('교통')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => closeRef.current?.focus(), [])
  const submit = () => {
    if (content.trim().length < 10) return setError('조금만 더 자세히 적어주세요. 최소 10자예요.')
    const result = onSubmit(sentiment, category, content)
    if (result) setError(result)
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="write-dialog" role="dialog" aria-modal="true" aria-labelledby="write-title">
        <header><button ref={closeRef} onClick={onClose} aria-label="글쓰기 닫기"><X size={21} /></button><span>로그인 없이 바로 등록</span></header>
        <div className="write-body">
          <span className="eyebrow">{apartment.address}</span>
          <h2 id="write-title">{apartment.name}에<br />한마디 남기기</h2>
          <p>살면서 좋았던 점과 아쉬웠던 점을 솔직하게 남겨주세요. 특정 사람의 신상 공개나 협박은 안 됩니다.</p>
          <fieldset className="sentiment-picker"><legend>어떤 이야기를 남길까요?</legend><div><button type="button" className={sentiment === 'positive' ? 'selected positive' : ''} aria-pressed={sentiment === 'positive'} onClick={() => { setSentiment('positive'); setCategory('교통'); setError('') }}><Smile size={19} /><span><b>장점</b><small>살아서 좋은 점</small></span></button><button type="button" className={sentiment === 'negative' ? 'selected negative' : ''} aria-pressed={sentiment === 'negative'} onClick={() => { setSentiment('negative'); setCategory('층간소음'); setError('') }}><Frown size={19} /><span><b>불만</b><small>개선이 필요한 점</small></span></button></div></fieldset>
          <fieldset><legend>{sentiment === 'positive' ? '무엇이 가장 좋았나요?' : '무엇 때문에 불편했나요?'}</legend><div className={`category-grid ${sentiment}`}>{(sentiment === 'positive' ? positiveCategories : negativeCategories).map((item) => <button type="button" className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></fieldset>
          <label htmlFor="hanmadi">한마디</label>
          <textarea id="hanmadi" value={content} maxLength={500} onChange={(event) => { setContent(event.target.value); setError('') }} placeholder={sentiment === 'positive' ? '이 아파트의 좋은 점을 알려주세요.' : '불편했던 점을 솔직하게 적어주세요.'} />
          <div className="starters" aria-label="추천 시작 문장"><span>이렇게 시작해보세요</span>{(sentiment === 'positive' ? positiveStarters : negativeStarters).map((starter) => <button type="button" key={starter} onClick={() => setContent(starter.replace('…', ' '))}><ArrowLeft size={14} />{starter}</button>)}</div>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <footer><button className={`primary-button sentiment-${sentiment}`} onClick={submit}>{sentiment === 'positive' ? '장점' : '불만'}으로 익명 등록</button><small><Bot size={13} /> 자동 봇·반복 등록 검사를 진행합니다. 특정인 식별 정보는 임시 숨김될 수 있어요.</small></footer>
      </section>
    </div>
  )
}
