import { Flame, LocateFixed, Search } from 'lucide-react'
import { navigate } from '../lib/navigation'

type Props = { onLocate: () => void; onSearch: () => void }

export function AppHeader({ onLocate, onSearch }: Props) {
  return (
    <header className="app-header">
      <button className="brand" onClick={() => navigate('/')} aria-label="아파트 한마디 홈">
        <span className="brand-dot" aria-hidden="true" />
        <strong>아파트 한마디</strong>
      </button>
      <button className="search-trigger" onClick={onSearch} aria-label="아파트 또는 지역 검색">
        <Search size={18} aria-hidden="true" />
        <span>아파트 또는 지역 검색</span>
      </button>
      <nav aria-label="빠른 메뉴">
        <button className="header-action" onClick={onLocate} aria-label="현재 위치">
          <LocateFixed size={19} /><span>현재 위치</span>
        </button>
        <button className="header-action hot" onClick={() => navigate('/hot')} aria-label="인기 불만">
          <Flame size={19} /><span>인기 불만</span>
        </button>
      </nav>
    </header>
  )
}
