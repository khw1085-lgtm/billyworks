import { ArrowLeft, Bookmark, Map, Users } from 'lucide-react'
import { useState } from 'react'
import { complexes, livingScores, posts } from '../data'
import { ResidentPostCard } from '../components/ResidentPostCard'

export function ComplexDetail({ onBack, onPost, onReport }: { onBack: () => void; onPost: () => void; onReport: () => void }) {
  const [tab, setTab] = useState('한눈에 보기')
  const [saved, setSaved] = useState(false)
  const complex = complexes[0]
  const tabs = ['실거주 피드', '한눈에 보기', '장점·단점', 'Q&A', '생활 정보']
  return <main className="detail-page" id="main-content">
    <button className="back-button" onClick={onBack}><ArrowLeft size={20} />돌아가기</button>
    <section className="complex-hero"><div><p>{complex.location}</p><h1>{complex.name}</h1><span>4,885세대 · 2014년 입주</span></div><div className="hero-buttons"><button className="secondary-button"><Map size={17} />지도에서 보기</button><button className={saved ? 'primary-button saved' : 'primary-button'} onClick={() => setSaved(!saved)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />{saved ? '관심 단지 저장됨' : '관심 단지 저장'}</button></div></section>
    <section className="complex-stats" aria-label="단지 실거주 통계"><div><strong>{complex.reports}</strong><span>실거주 리포트</span></div><div><strong>{complex.residents}</strong><span>인증 거주자</span></div><div><strong>{complex.score}</strong><span>평균 만족도 / 5</span></div></section>
    <div className="detail-tabs" role="tablist">{tabs.map(item => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    {tab === '실거주 피드' ? <div>{posts.slice(0, 2).map(post => <ResidentPostCard key={post.id} post={post} onComplex={() => {}} onOpen={onPost} onReport={onReport} />)}</div> : <ComplexOverview tab={tab} />}
  </main>
}

function ComplexOverview({ tab }: { tab: string }) {
  if (tab === 'Q&A') return <section className="empty-state roomy"><Users size={26} /><h2>궁금한 점을 물어보세요</h2><p>현재 거주 인증자 128명이 답변을 기다리고 있어요.</p><button className="primary-button">질문 작성하기</button></section>
  return <div className="overview-grid"><section className="overview-section"><div className="section-heading"><div><p>실거주 만족도</p><h2>생활 항목별 평가</h2></div><span>인증 거주자 128명의 응답</span></div><div className="score-list">{livingScores.map(([label, score]) => <div className="score-item" key={label}><span>{label}</span><div className="score-track"><i style={{ width: `${score}%` }} /></div><b>{(score / 20).toFixed(1)}</b></div>)}</div></section><section className="pros-cons"><div className="section-heading"><div><p>자주 언급된 경험</p><h2>장점과 불편</h2></div></div><div className="keyword-group positive"><strong>좋았어요</strong><p>교통 선택지가 많아요 <b>86</b></p><p>단지 관리가 꼼꼼해요 <b>61</b></p><p>생활 상권이 가까워요 <b>58</b></p></div><div className="keyword-group negative"><strong>아쉬워요</strong><p>출근 시간 혼잡해요 <b>43</b></p><p>동에 따라 주차 거리가 길어요 <b>31</b></p></div></section></div>
}
