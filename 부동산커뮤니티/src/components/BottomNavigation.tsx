import { Home, Map, PenLine, Search, UserRound } from 'lucide-react'
import type { View } from '../types'

const items = [['home', '홈', Home], ['search', '탐색', Search], ['map', '지도', Map], ['profile', '마이', UserRound]] as const

export function BottomNavigation({ active, onNavigate, onWrite }: { active: View; onNavigate: (view: View) => void; onWrite: () => void }) {
  return <nav className="bottom-nav" aria-label="모바일 주요 메뉴">{items.slice(0, 2).map(([id, label, Icon]) => <NavItem key={id} id={id} label={label} Icon={Icon} active={active} onNavigate={onNavigate} />)}<button className="mobile-write" onClick={onWrite} aria-label="새 이야기 작성"><PenLine size={22} /></button>{items.slice(2).map(([id, label, Icon]) => <NavItem key={id} id={id} label={label} Icon={Icon} active={active} onNavigate={onNavigate} />)}</nav>
}

function NavItem({ id, label, Icon, active, onNavigate }: { id: View; label: string; Icon: typeof Home; active: View; onNavigate: (view: View) => void }) {
  return <button className={active === id ? 'bottom-item active' : 'bottom-item'} onClick={() => onNavigate(id)}><Icon size={21} /><small>{label}</small></button>
}
