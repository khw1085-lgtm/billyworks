import { topics } from '../data'
const feeds = ['추천', '내가 사는 곳', '관심 지역', '팔로잉', '최신']

export function FeedControls({ feed, topic, onFeed, onTopic }: { feed: string; topic: string; onFeed: (value: string) => void; onTopic: (value: string) => void }) {
  return <div className="feed-controls"><div className="feed-tabs" role="tablist" aria-label="피드 종류">{feeds.map(item => <button key={item} role="tab" aria-selected={feed === item} className={feed === item ? 'active' : ''} onClick={() => onFeed(item)}>{item}</button>)}</div><div className="topic-scroll" aria-label="생활 주제 필터">{topics.map(item => <button key={item} aria-pressed={topic === item} className={topic === item ? 'topic-chip active' : 'topic-chip'} onClick={() => onTopic(item)}>{item}</button>)}</div></div>
}
