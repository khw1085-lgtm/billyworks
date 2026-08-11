import { Bell, Bookmark, Building2, Home, Map, PenLine, Search, UserRound } from 'lucide-react'
import { Brand } from './Brand'
import type { View } from '../types'

const items = [['home', '홈', Home], ['search', '탐색', Search], ['map', '지도', Map], ['notifications', '알림', Bell], ['profile', '마이', UserRound]] as const

export function DesktopSidebar({ active, onNavigate, onWrite }: { active: View; onNavigate: (view: View) => void; onWrite: () => void }) {
  return <aside className="desktop-sidebar">
    <button className="sidebar-brand" onClick={() => onNavigate('home')}><Brand /></button>
    <nav aria-label="주요 메뉴">{items.map(([id, label, Icon]) => <button key={id} className={active === id ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(id)}><Icon size={22} strokeWidth={1.8} /><span>{label}</span></button>)}<button className="nav-item" onClick={() => onNavigate('complex')}><Building2 size={22} /><span>관심 단지</span></button><button className="nav-item"><Bookmark size={22} /><span>저장한 글</span></button></nav>
    <button className="write-button" onClick={onWrite}><PenLine size={19} />이야기 쓰기</button>
    <button className="sidebar-profile" onClick={() => onNavigate('profile')}><span className="avatar">현</span><span><strong>현욱</strong><small>현재 거주 인증</small></span></button>
  </aside>
}
