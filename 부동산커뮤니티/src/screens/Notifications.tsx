import { BadgeCheck, Bell, Heart, MessageCircle } from 'lucide-react'

const notices = [[MessageCircle, '아현이웃님이 회원님의 리포트에 댓글을 남겼어요.', '“애오개역까지는 실제로 얼마나 걸리나요?”', '12분 전'], [Heart, '회원님의 실거주 후기가 100명에게 도움됐어요.', '마포래미안푸르지오 교통 후기', '1시간 전'], [Bell, '관심 단지에 새로운 인증 후기가 등록됐어요.', '헬리오시티 · 주차 이야기', '3시간 전'], [BadgeCheck, '거주 인증이 완료됐습니다.', '공개 화면에는 대략적인 거주 기간만 표시돼요.', '어제']] as const

export function Notifications() {
  return <main className="simple-page" id="main-content"><header className="simple-heading"><div><p>새 소식</p><h1>알림</h1></div><button>모두 읽음</button></header><div className="notification-list">{notices.map(([Icon, title, body, time], index) => <article className={index < 2 ? 'unread' : ''} key={title}><span className="notice-icon"><Icon size={19} /></span><div><strong>{title}</strong><p>{body}</p><small>{time}</small></div></article>)}</div></main>
}
