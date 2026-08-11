import { Bell, Search } from 'lucide-react'
import { Brand } from './Brand'
import type { View } from '../types'

export function AppHeader({ onNavigate, unread }: { onNavigate: (view: View) => void; unread: number }) {
  return <header className="app-header">
    <button className="mobile-brand" onClick={() => onNavigate('home')} aria-label="홈으로 이동"><Brand /></button>
    <button className="header-search" aria-label="통합 검색 열기" onClick={() => onNavigate('search')}><Search size={18} /><span>지역, 단지, 생활 이야기를 검색해보세요</span><kbd>⌘ K</kbd></button>
    <div className="header-actions"><button className="icon-button" aria-label={`알림 ${unread}개`} onClick={() => onNavigate('notifications')}><Bell size={21} />{unread > 0 && <span className="notification-dot" />}</button><button className="avatar avatar-small" aria-label="내 프로필" onClick={() => onNavigate('profile')}>현</button></div>
  </header>
}
