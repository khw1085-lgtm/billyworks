import { ArrowLeft, BadgeCheck, Heart, MessageCircle } from 'lucide-react'
import { posts } from '../data'
import { VerificationBadge } from '../components/VerificationBadge'

export function ReportDetail({ onBack }: { onBack: () => void }) {
  const post = posts[0]
  const sections = [
    ['가장 만족한 점', '아현역, 애오개역, 공덕역을 상황에 따라 골라 쓸 수 있다는 점입니다. 비 오는 날에는 단지 앞 버스를 타면 공덕역까지 10분 안쪽으로 이동해요.'],
    ['가장 불편한 점', '출근 시간 2호선은 혼잡도가 높고, 단지가 커서 동 위치에 따라 역까지 걷는 시간이 5분 이상 차이 납니다.'],
    ['교통 경험', '평일 오전 7시 50분에 집을 나서면 아현역 승강장까지 평균 11분, 시청역 사무실까지 문 앞 기준 31분 정도 걸렸습니다.'],
    ['소음과 이웃', '대로변에서 안쪽인 동은 차량 소음이 거의 없습니다. 아이가 많은 단지라 오후 시간대 놀이터 소리는 들리지만 밤에는 조용합니다.'],
    ['주차와 관리', '저녁 10시 이후에는 가까운 자리가 부족합니다. 관리사무소 민원 응답은 빠르고 공용부 청소 상태는 좋은 편입니다.'],
    ['육아·생활 편의', '단지 내 어린이집과 작은 도서관을 자주 이용합니다. 마트와 병원이 도보권이라 아이가 어릴 때 특히 편했습니다.']
  ]
  return <main className="report-page" id="main-content"><button className="back-button" onClick={onBack}><ArrowLeft size={20} />피드로 돌아가기</button><article className="report-article"><header><span className="post-topic">실거주 리포트 · 교통</span><h1>{post.summary}</h1><p>{post.complex} · {post.location}</p><div className="report-author"><span className="avatar">{post.avatar}</span><span><strong>{post.author}</strong><VerificationBadge status={post.verified} /></span><time>2026년 8월 11일</time></div></header><section className="condition-strip"><div><small>거주 형태</small><strong>자가</strong></div><div><small>거주 기간</small><strong>5년차</strong></div><div><small>가족 구성</small><strong>신혼</strong></div><div><small>만족도</small><strong>4.4 / 5</strong></div></section>{sections.map(([title, body]) => <section className="report-section" key={title}><h2>{title}</h2><p>{body}</p></section>)}<section className="return-intent"><BadgeCheck size={24} /><div><small>다시 이사 올 의향</small><strong>네, 다시 선택할 것 같아요</strong></div></section><footer className="report-footer"><button><Heart size={19} />도움됐어요 128</button><button><MessageCircle size={19} />댓글 24</button></footer></article><section className="comments"><h2>추가 질문과 답변 <span>24</span></h2><div className="comment"><span className="avatar avatar-small">이웃</span><p><strong>아현이웃</strong> <small>2시간 전</small><br />출근 시간에 애오개역을 이용하는 편이 더 나을 때도 있나요?</p></div><div className="comment reply"><span className="avatar avatar-small">ㅁㅍ</span><p><strong>마포새댁</strong> <small>작성자 · 1시간 전</small><br />5호선 방향이면 애오개역이 훨씬 편해요. 3단지 쪽에서는 도보 8분 정도입니다.</p></div><textarea aria-label="댓글 작성" placeholder="실거주자에게 추가로 궁금한 점을 물어보세요" /></section></main>
}
