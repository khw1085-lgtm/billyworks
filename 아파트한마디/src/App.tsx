import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apartments, seedPosts } from './data/sample'
import type { Apartment, Category, MapBounds, Post, ReportReason } from './types'
import { AppHeader } from './components/AppHeader'
import { MapHome } from './components/MapHome'
import { BoardScreen } from './components/BoardScreen'
import { HotScreen } from './components/HotScreen'
import { SearchOverlay } from './components/SearchOverlay'
import { WriteDialog } from './components/WriteDialog'
import { ReportDialog } from './components/ReportDialog'
import { CommentDialog } from './components/CommentDialog'
import { AdminScreen, RightsScreen } from './components/PolicyScreens'
import { actionOnce, canSubmit, getAnonymousId, loadPosts, markSubmitted, saveOwnPosts, saveReport } from './lib/storage'
import { apartmentPath, navigate } from './lib/navigation'
import { fetchApartmentsInBounds } from './lib/apartmentApi'

type Sort = 'latest' | 'agree' | 'comments'

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [posts, setPosts] = useState<Post[]>(() => loadPosts(seedPosts))
  const [selected, setSelected] = useState<Apartment>()
  const [writing, setWriting] = useState<Apartment>()
  const [reporting, setReporting] = useState<string>()
  const [commenting, setCommenting] = useState<string>()
  const [sort, setSort] = useState<Sort>('latest')
  const [toast, setToast] = useState('')
  const [remoteApartments, setRemoteApartments] = useState<Apartment[]>([])
  const requestRef = useRef<AbortController | null>(null)

  const availableApartments = useMemo(() => {
    const merged = new Map(apartments.map((item) => [item.id, item]))
    remoteApartments.forEach((item) => merged.set(item.id, { ...item, postCount: posts.filter((post) => post.apartmentId === item.id && post.status === 'visible').length }))
    return [...merged.values()]
  }, [posts, remoteApartments])

  const loadMapBounds = useCallback((bounds: MapBounds) => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    fetchApartmentsInBounds(bounds, controller.signal)
      .then(({ apartments: next }) => setRemoteApartments(next))
      .catch((error) => { if (error instanceof Error && error.name !== 'AbortError') console.warn('전국 아파트 데이터를 불러오지 못했습니다.', error) })
  }, [])

  useEffect(() => { const listener = () => setPath(window.location.pathname); window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener) }, [])
  useEffect(() => saveOwnPosts(posts), [posts])
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer) }, [toast])

  const apartmentId = path.match(/^\/apartments\/([^/]+)/)?.[1]
  const boardApartment = useMemo(() => availableApartments.find((item) => item.id === apartmentId), [apartmentId, availableApartments])
  const reactTo = (id: string, type: 'agree' | 'same') => {
    if (!actionOnce(type, id)) return setToast('이미 반응을 남겼어요.')
    setPosts((items) => items.map((post) => post.id === id ? { ...post, [type === 'agree' ? 'agreeCount' : 'sameCount']: post[type === 'agree' ? 'agreeCount' : 'sameCount'] + 1 } : post))
  }
  const submitPost = (apartment: Apartment, category: Category, content: string) => {
    const sensitive = /(\d{2,4}-\d{3,4}-\d{4}|\d+동\s*\d+호|차량번호|죽여버|살해)/
    if (sensitive.test(content)) return '개인 식별 정보나 구체적인 협박으로 보이는 표현이 있어 등록할 수 없어요.'
    if (/https?:\/\//.test(content)) return '광고·도배 방지를 위해 링크가 포함된 글은 등록할 수 없어요.'
    const blocked = canSubmit(content, posts)
    if (blocked) return blocked
    const post: Post = { id: `p${Date.now()}`, apartmentId: apartment.id, anonymousId: getAnonymousId(), category, content: content.trim(), agreeCount: 0, sameCount: 0, commentCount: 0, createdAt: '방금 전', status: 'visible', mine: true }
    setPosts((items) => [post, ...items]); markSubmitted(); setWriting(undefined); setSelected(apartment); navigate(apartmentPath(apartment.id)); setToast('익명 한마디가 등록됐어요.'); return null
  }
  const sharePost = async (post: Post) => {
    const apartment = availableApartments.find((item) => item.id === post.apartmentId)
    const url = `${location.origin}${apartmentPath(post.apartmentId)}#${post.id}`
    try { if (navigator.share) await navigator.share({ title: `${apartment?.name} 익명 한마디`, text: post.content, url }); else { await navigator.clipboard.writeText(url); setToast('공유 링크를 복사했어요.') } } catch { /* user cancelled */ }
  }
  const deletePost = (id: string) => { setPosts((items) => items.map((post) => post.id === id ? { ...post, status: 'deleted' } : post)); setToast('게시물을 삭제했어요.') }
  const renderPage = () => {
    const common = { posts, onReact: reactTo, onComment: setCommenting, onReport: setReporting, onShare: sharePost, onDelete: deletePost }
    if (path === '/hot') return <HotScreen apartments={availableApartments} {...common} />
    if (path === '/report') return <RightsScreen />
    if (path === '/admin') return <AdminScreen posts={posts} onHide={(id) => setPosts((items) => items.map((post) => post.id === id ? { ...post, status: 'hidden' } : post))} onDelete={deletePost} />
    if (boardApartment) return <BoardScreen apartment={boardApartment} sort={sort} onSort={setSort} onWrite={() => setWriting(boardApartment)} {...common} />
    return <MapHome apartments={availableApartments} posts={posts} selected={selected} onSelect={setSelected} onWrite={setWriting} onBoundsChange={loadMapBounds} />
  }

  return <div className="app-shell"><a className="skip-link" href="#main-content">본문으로 건너뛰기</a><AppHeader onLocate={() => { window.dispatchEvent(new Event('hanmadi:locate')); setToast('현재 위치 주변으로 지도를 이동합니다.') }} onSearch={() => navigate('/search')} />{renderPage()}
    {path === '/search' && <SearchOverlay apartments={availableApartments} onClose={() => navigate('/')} onSelect={(item) => { setSelected(item); navigate('/') }} />}
    {writing && <WriteDialog apartment={writing} onClose={() => setWriting(undefined)} onSubmit={(category, content) => submitPost(writing, category, content)} />}
    {reporting && <ReportDialog onClose={() => setReporting(undefined)} onSubmit={(reason: ReportReason, detail) => { saveReport(reporting, reason, detail); setReporting(undefined); setToast('신고가 접수됐어요. 검토 전까지 바로 삭제되지는 않습니다.') }} />}
    {commenting && <CommentDialog onClose={() => setCommenting(undefined)} onSubmit={() => { setPosts((items) => items.map((post) => post.id === commenting ? { ...post, commentCount: post.commentCount + 1 } : post)); setCommenting(undefined); setToast('익명 댓글이 등록됐어요.') }} />}
    {toast && <div className="toast" role="status">{toast}</div>}
    <footer className="site-footer"><span>아파트 한마디</span><button onClick={() => navigate('/report')}>권리침해·삭제 요청</button><button onClick={() => navigate('/admin')}>관리자</button></footer>
  </div>
}
