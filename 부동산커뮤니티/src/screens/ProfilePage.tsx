import { BadgeCheck, Bell, Bookmark, ChevronRight, EyeOff, FileText, MapPin, Settings, ShieldCheck } from 'lucide-react'

export function ProfilePage() {
  const menu = [[FileText, '내가 작성한 글', '12'], [Bookmark, '저장한 글', '38'], [MapPin, '관심 단지와 지역', '7'], [ShieldCheck, '거주 인증 관리', '완료'], [Bell, '알림 설정', ''], [EyeOff, '차단 사용자', ''], [Settings, '개인정보 및 공개 범위', '']] as const
  return <main className="simple-page" id="main-content"><section className="profile-hero"><span className="avatar profile-avatar">현</span><div><h1>현욱</h1><p>@hyunwookim</p><span className="verification"><BadgeCheck size={14} />현재 거주 인증</span></div><button>프로필 편집</button></section><section className="profile-stats"><div><strong>12</strong><span>작성한 글</span></div><div><strong>486</strong><span>받은 도움돼요</span></div><div><strong>8</strong><span>답변</span></div></section><div className="profile-menu">{menu.map(([Icon, label, value]) => <button key={label}><span className="menu-icon"><Icon size={19} /></span><strong>{label}</strong>{value && <small>{value}</small>}<ChevronRight size={18} /></button>)}</div></main>
}
