import { ArrowRight, MapPin, TrendingUp } from 'lucide-react'
import { complexes } from '../data'

export function RightRail({ onComplex }: { onComplex: () => void }) {
  return <aside className="right-rail"><section className="rail-section local-pulse"><div className="eyebrow"><MapPin size={14} />우리 동네 지금</div><h2>아현동에서<br />많이 이야기해요</h2><div className="pulse-stat"><strong>38</strong><span>이번 주 새 이야기</span></div><button onClick={onComplex}>동네 소식 보기 <ArrowRight size={16} /></button></section><section className="rail-section"><div className="rail-title"><h2>관심 급상승 단지</h2><TrendingUp size={17} /></div><ol className="complex-ranking">{complexes.map((item, index) => <li key={item.name}><button onClick={onComplex}><b>{index + 1}</b><span><strong>{item.name}</strong><small>{item.location} · 후기 {item.reports}</small></span><em>{item.score}</em></button></li>)}</ol></section><p className="policy-note">살담은 정확한 동·호수와 인증 서류를 공개하지 않습니다. <button>운영 정책</button></p></aside>
}
