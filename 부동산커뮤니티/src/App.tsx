import { useEffect, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { BottomNavigation } from './components/BottomNavigation'
import { Composer } from './components/Composer'
import { DesktopSidebar } from './components/DesktopSidebar'
import { ReportDialog } from './components/ReportDialog'
import { RightRail } from './components/RightRail'
import { ComplexDetail } from './screens/ComplexDetail'
import { HomeFeed } from './screens/HomeFeed'
import { MapExplore } from './screens/MapExplore'
import { Notifications } from './screens/Notifications'
import { ProfilePage } from './screens/ProfilePage'
import { ReportDetail } from './screens/ReportDetail'
import { SearchPage } from './screens/SearchPage'
import type { View } from './types'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [composer, setComposer] = useState(false)
  const [report, setReport] = useState(false)
  const [toast, setToast] = useState('')
  const navigate = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); navigate('search') }
      if (event.key === 'Escape') { setComposer(false); setReport(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const content = document.getElementById('app-content')
    if (composer || report) content?.setAttribute('inert', '')
    else content?.removeAttribute('inert')
  }, [composer, report])

  return <div className="app-shell">
    <div id="app-content">
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
      <DesktopSidebar active={view} onNavigate={navigate} onWrite={() => setComposer(true)} />
      <div className="content-shell"><AppHeader onNavigate={navigate} unread={2} /><div className={view === 'map' ? 'page-layout map-layout' : 'page-layout'}>
        {view === 'home' && <HomeFeed onComplex={() => navigate('complex')} onPost={() => navigate('report')} onReport={() => setReport(true)} />}
        {view === 'complex' && <ComplexDetail onBack={() => navigate('home')} onPost={() => navigate('report')} onReport={() => setReport(true)} />}
        {view === 'report' && <ReportDetail onBack={() => navigate('home')} />}
        {view === 'map' && <MapExplore onComplex={() => navigate('complex')} />}
        {view === 'search' && <SearchPage onComplex={() => navigate('complex')} onPost={() => navigate('report')} />}
        {view === 'notifications' && <Notifications />}{view === 'profile' && <ProfilePage />}
        {view === 'home' && <RightRail onComplex={() => navigate('complex')} />}
      </div></div>
      <BottomNavigation active={view} onNavigate={navigate} onWrite={() => setComposer(true)} />
    </div>
    {composer && <Composer onClose={() => setComposer(false)} onComplete={() => { setComposer(false); notify('실거주 이야기가 등록됐어요') }} />}
    {report && <ReportDialog onClose={() => setReport(false)} onDone={() => { setReport(false); notify('신고가 접수됐어요. 빠르게 검토할게요') }} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </div>
}
