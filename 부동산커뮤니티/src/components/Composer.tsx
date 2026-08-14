import { ArrowLeft, ArrowRight, Building2, Camera, Check, ChevronRight, Eye, X } from 'lucide-react'
import { useState } from 'react'
import { topics } from '../data'

const types = ['실거주 후기', '질문', '생활 정보', '이사 고민', '장점·단점', '최근 변화', '관리·하자 문제']
const stepLabels = ['단지', '유형', '내용', '주제', '거주 조건', '사진', '공개 범위', '확인']

export function Composer({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [type, setType] = useState('실거주 후기')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['교통'])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const next = () => step === 7 ? onComplete() : setStep(step + 1)
  return <div className="modal-backdrop"><section className="composer-modal" role="dialog" aria-modal="true" aria-labelledby="composer-title">
    <header><button autoFocus className="icon-button" onClick={step ? () => setStep(step - 1) : onClose} aria-label={step ? '이전 단계' : '닫기'}>{step ? <ArrowLeft size={21} /> : <X size={21} />}</button><div><small>{step + 1} / 8</small><strong id="composer-title">{stepLabels[step]}</strong></div><button className="text-button" onClick={onClose}>임시저장</button></header>
    <div className="composer-progress"><i style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
    <div className="composer-body"><ComposerStep step={step} type={type} setType={setType} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} title={title} setTitle={setTitle} body={body} setBody={setBody} /></div>
    <footer><button className="primary-button wide" onClick={next}>{step === 7 ? <><Check size={18} />이야기 등록하기</> : <>다음 <ArrowRight size={18} /></>}</button></footer>
  </section></div>
}

type StepProps = { step: number; type: string; setType: (value: string) => void; selectedTopics: string[]; setSelectedTopics: (value: string[]) => void; title: string; setTitle: (value: string) => void; body: string; setBody: (value: string) => void }

function ComposerStep({ step, type, setType, selectedTopics, setSelectedTopics, title, setTitle, body, setBody }: StepProps) {
  if (step === 0) return <><h2>어디에서 살아본 경험인가요?</h2><p>정확한 동·호수는 다른 사람에게 공개되지 않아요.</p><button className="selection-row selected"><span className="result-icon"><Building2 size={21} /></span><span><strong>마포래미안푸르지오</strong><small>서울 마포구 아현동</small></span><Check size={18} /></button><button className="selection-row"><span>다른 지역 또는 단지 검색</span><ChevronRight size={18} /></button></>
  if (step === 1) return <><h2>어떤 이야기를 나누시나요?</h2><p>선택한 유형에 맞춰 작성 가이드를 보여드릴게요.</p><div className="type-grid">{types.map(item => <button className={type === item ? 'selected' : ''} onClick={() => setType(item)} key={item}>{item}{type === item && <Check size={16} />}</button>)}</div></>
  if (step === 2) return <><h2>구체적인 경험을 들려주세요</h2><p>언제, 어떤 상황에서 느낀 점인지 적으면 더 유용해요.</p><label className="form-field"><span>한 줄 요약</span><input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 출근 시간에도 버스 선택지가 많아요" maxLength={60} /><small>{title.length}/60</small></label><label className="form-field"><span>자세한 이야기</span><textarea value={body} onChange={e => setBody(e.target.value)} placeholder="실제 생활에서 겪은 상황을 구체적으로 알려주세요." /><small>{body.length}/1,500</small></label></>
  if (step === 3) return <><h2>관련된 생활 주제를 골라주세요</h2><p>최대 3개까지 선택할 수 있어요.</p><div className="topic-choice">{topics.slice(1).map(item => <button className={selectedTopics.includes(item) ? 'selected' : ''} onClick={() => setSelectedTopics(selectedTopics.includes(item) ? selectedTopics.filter(value => value !== item) : selectedTopics.length < 3 ? [...selectedTopics, item] : selectedTopics)} key={item}>{item}</button>)}</div></>
  if (step === 4) return <><h2>거주 당시 조건을 알려주세요</h2><p>비슷한 상황의 이웃이 후기를 이해하는 데 도움이 돼요.</p><div className="condition-form"><label>거주 형태<select><option>자가</option><option>전세</option><option>월세</option></select></label><label>가족 구성<select><option>신혼</option><option>1인</option><option>영유아</option><option>초등 자녀</option></select></label><label>거주 시작<input type="month" defaultValue="2021-03" /></label><label>거주 종료<select><option>현재 거주 중</option><option>과거 거주</option></select></label></div></>
  if (step === 5) return <><h2>사진을 추가하시겠어요?</h2><p>단지 전경이나 생활 환경을 보여주세요. 차량 번호와 사람 얼굴은 자동으로 가려져요.</p><button className="photo-drop"><Camera size={28} /><strong>사진 추가</strong><span>최대 8장 · JPG, PNG</span></button></>
  if (step === 6) return <><h2>공개 범위를 확인해주세요</h2><p>개인정보를 보호하면서 신뢰할 수 있는 정보만 공개해요.</p><label className="toggle-row"><span><strong>닉네임으로 작성</strong><small>실명은 공개되지 않아요</small></span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span><strong>대략적인 거주 기간 공개</strong><small>정확한 주소와 인증 서류는 비공개</small></span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span><strong>댓글과 추가 질문 허용</strong></span><input type="checkbox" defaultChecked /></label></>
  return <><h2>등록 전 마지막으로 확인해주세요</h2><p>등록 후에도 수정할 수 있으며 수정 이력이 표시됩니다.</p><div className="preview-card"><div className="preview-label"><Eye size={16} />미리보기</div><span className="post-topic">{selectedTopics[0] || '교통'}</span><h3>{title || '출근 시간에도 버스 선택지가 많아요'}</h3><p>{body || '실제로 살아본 경험이 이곳에 표시됩니다. 생활에서 느낀 구체적인 장점과 불편을 솔직하게 공유해주세요.'}</p><small>마포래미안푸르지오 · 신혼 · 자가 · 5년차</small></div></>
}
