import { useMemo, useState } from 'react'
import { posts } from '../data'
import { FeedControls } from '../components/FeedControls'
import { ResidentPostCard } from '../components/ResidentPostCard'

export function HomeFeed({ onComplex, onReport, onPost }: { onComplex: () => void; onReport: () => void; onPost: () => void }) {
  const [feed, setFeed] = useState('추천')
  const [topic, setTopic] = useState('전체')
  const filtered = useMemo(() => topic === '전체' ? posts : posts.filter(post => post.topic === topic), [topic])
  return <main className="feed-column" id="main-content"><div className="mobile-page-title"><h1>오늘의 집 이야기</h1><span>8월 11일</span></div><FeedControls feed={feed} topic={topic} onFeed={setFeed} onTopic={setTopic} /><div className="feed-list">{filtered.length ? filtered.map((post, index) => <div className="feed-enter" style={{ '--delay': `${index * 45}ms` } as React.CSSProperties} key={post.id}><ResidentPostCard post={post} onComplex={onComplex} onOpen={onPost} onReport={onReport} /></div>) : <div className="empty-state"><h2>아직 이 주제의 이야기가 없어요</h2><p>첫 번째 실거주 경험을 들려주세요.</p></div>}</div></main>
}
