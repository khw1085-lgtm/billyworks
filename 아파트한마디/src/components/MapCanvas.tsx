import { Building2, Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getKakaoMaps, loadKakaoMaps } from '../lib/kakaoMaps'
import { sentimentColor, sentimentCounts, sentimentLabel } from '../lib/sentiment'
import type { Apartment, MapBounds } from '../types'

type Props = {
  apartments: Apartment[]
  selectedId?: string
  zoom: number
  onZoom: (zoom: number) => void
  onSelect: (apartment: Apartment) => void
  onBoundsChange?: (bounds: MapBounds) => void
}

const clusterSizes = [48, 60, 76, 92]

function clusterStyle(size: number) {
  return {
    width: `${size}px`, height: `${size}px`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: '#777770', color: '#fff', border: '3px solid #fff', borderRadius: '50%', textAlign: 'center', fontWeight: '700', lineHeight: '1', boxShadow: '0 3px 12px rgba(25,25,22,.24)',
  }
}

function markerImage(maps: any, apartment: Apartment) {
  const active = apartment.postCount >= 10
  const { positive, negative } = sentimentCounts(apartment)
  const hasOpinion = positive + negative > 0
  const size = active ? 42 : hasOpinion ? 32 : 30
  const fill = hasOpinion ? sentimentColor(positive, negative) : '#181816'
  const building = '<path d="M9 23V7c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v16M6 23h16M12 9h1M16 9h1M12 13h1M16 13h1M12 17h1M16 17h1" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  const label = hasOpinion ? `<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-size="${active ? 13 : 11}" font-weight="700">${apartment.postCount}</text>` : building
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" stroke="white" stroke-width="3"/>${label}</svg>`
  return new maps.MarkerImage(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, new maps.Size(size, size))
}

function FallbackMap({ apartments, selectedId, zoom, onZoom, onSelect }: Props) {
  const visible = zoom < 1.15 ? apartments.filter((_, index) => index % 2 === 0 || index < 3) : apartments
  const clusterCounts = visible.reduce((total, apartment) => ({ positive: total.positive + (apartment.positiveCount ?? 0), negative: total.negative + (apartment.negativeCount ?? 0) }), { positive: 0, negative: 0 })
  const clusterLabel = sentimentLabel(clusterCounts.positive, clusterCounts.negative)
  const fallbackClusterSize = zoom < 1 ? 76 : 60
  return <section className="map-canvas fallback-map" aria-label="서울·경기 샘플 아파트 지도">
    <div className="map-grid" style={{ transform: `scale(${zoom})` }} aria-hidden="true"><span className="river" /><span className="district d1">은평구</span><span className="district d2">마포구</span><span className="district d3">성동구</span><span className="district d4">송파구</span></div>
    <div className="marker-layer">{visible.map((apartment) => { const { positive, negative } = sentimentCounts(apartment); const hasOpinion = positive + negative > 0; const label = sentimentLabel(positive, negative); return <button key={apartment.id} className={`map-marker ${apartment.postCount >= 10 ? 'active' : ''} ${hasOpinion ? '' : 'neutral'} ${apartment.trending ? 'trending' : ''} ${selectedId === apartment.id ? 'selected' : ''}`} style={{ left: `${apartment.x}%`, top: `${apartment.y}%`, backgroundColor: hasOpinion ? sentimentColor(positive, negative) : '#181816' }} onClick={() => onSelect(apartment)} aria-label={`${apartment.name}, 장점 ${positive}개, 불만 ${negative}개, ${label}`}>{hasOpinion ? <b>{apartment.postCount}</b> : <Building2 size={15} strokeWidth={2.2} aria-hidden="true" />}</button> })}{zoom < 1.15 ? <button className="map-cluster sentiment-cluster" style={{ width: fallbackClusterSize, height: fallbackClusterSize, backgroundColor: sentimentColor(clusterCounts.positive, clusterCounts.negative) }} onClick={() => onZoom(1.2)} aria-label={`숨겨진 단지 2개, ${clusterLabel}, 확대해서 보기`}><strong>2<small>단지</small></strong></button> : null}</div>
    <ZoomControl onIn={() => onZoom(Math.min(1.35, zoom + .1))} onOut={() => onZoom(Math.max(.85, zoom - .1))} />
    <SentimentLegend />
    <p className="map-attribution">Kakao JavaScript 키를 연결하면 실제 지도가 표시됩니다</p>
  </section>
}

function SentimentLegend() {
  return <div className="sentiment-legend" aria-label="지도 색상과 원 크기 안내"><div><span><i className="positive" />장점 많음</span><b aria-hidden="true" /><span><i className="negative" />불만 많음</span></div><small>원 크기 = 포함 단지 수</small></div>
}

function MapLoadingOverlay({ ready }: { ready: boolean }) {
  return <div className={`map-loading ${ready ? 'is-ready' : ''}`} role={ready ? undefined : 'status'} aria-hidden={ready} aria-live="polite"><div className="ios-spinner" aria-hidden="true" /><span>아파트 지도를 불러오는 중</span></div>
}

function ZoomControl({ onIn, onOut }: { onIn: () => void; onOut: () => void }) {
  return <div className="zoom-control" aria-label="지도 확대 축소"><button onClick={onIn} aria-label="지도 확대"><Plus size={18} /></button><button onClick={onOut} aria-label="지도 축소"><Minus size={18} /></button></div>
}

export function MapCanvas(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const clustererRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const onSelectRef = useRef(props.onSelect)
  const onBoundsChangeRef = useRef(props.onBoundsChange)
  const [sdkState, setSdkState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [initialClustersReady, setInitialClustersReady] = useState(false)
  const key = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY || ''

  useEffect(() => { onSelectRef.current = props.onSelect }, [props.onSelect])
  useEffect(() => { onBoundsChangeRef.current = props.onBoundsChange }, [props.onBoundsChange])

  useEffect(() => {
    if (!key || !containerRef.current) { setSdkState('fallback'); return }
    let active = true
    const loadingStartedAt = performance.now()
    let revealTimer = 0
    let loadingFallback = 0
    let revealScheduled = false
    const revealMap = () => {
      if (revealScheduled) return
      revealScheduled = true
      window.clearTimeout(loadingFallback)
      const minimumVisibleTime = Math.max(0, 700 - (performance.now() - loadingStartedAt))
      revealTimer = window.setTimeout(() => active && setInitialClustersReady(true), minimumVisibleTime)
    }
    setInitialClustersReady(false)
    loadingFallback = window.setTimeout(revealMap, 8000)
    const locate = () => navigator.geolocation?.getCurrentPosition(({ coords }) => {
      if (!active || !mapRef.current) return
      const maps = getKakaoMaps()
      mapRef.current.setCenter(new maps.LatLng(coords.latitude, coords.longitude))
      mapRef.current.setLevel(4)
    })
    loadKakaoMaps(key).then(() => {
      if (!active || !containerRef.current) return
      const maps = getKakaoMaps()
      const map = new maps.Map(containerRef.current, { center: new maps.LatLng(37.5237, 126.9846), level: 9 })
      mapRef.current = map
      clustererRef.current = new maps.MarkerClusterer({
        map, averageCenter: true, minLevel: 6, disableClickZoom: false,
        calculator: (size: number) => size < 20 ? 0 : size < 100 ? 1 : size < 500 ? 2 : 3,
        styles: clusterSizes.map(clusterStyle),
      })
      maps.event.addListener(clustererRef.current, 'clustered', (clusters: any[]) => {
        clusters.forEach((cluster) => {
          const counts = cluster.getMarkers().reduce((total: { positive: number; negative: number }, marker: any) => ({ positive: total.positive + (marker.__sentiment?.positive ?? 0), negative: total.negative + (marker.__sentiment?.negative ?? 0) }), { positive: 0, negative: 0 })
          const content = cluster.getClusterMarker().getContent()
          if (content instanceof HTMLElement) {
            const count = document.createElement('strong')
            const unit = document.createElement('small')
            count.textContent = String(cluster.getSize())
            unit.textContent = '단지'
            count.append(unit)
            content.replaceChildren(count)
            content.classList.add('sentiment-cluster')
            content.style.background = sentimentColor(counts.positive, counts.negative)
            content.title = `${sentimentLabel(counts.positive, counts.negative)} · 장점 ${counts.positive} · 불만 ${counts.negative}`
            content.setAttribute('aria-label', content.title)
          }
        })
        if (markersRef.current.length >= 20 && clusters.length > 0) revealMap()
      })
      const updateBounds = () => {
        const bounds = map.getBounds()
        onBoundsChangeRef.current?.({
          south: bounds.getSouthWest().getLat(),
          west: bounds.getSouthWest().getLng(),
          north: bounds.getNorthEast().getLat(),
          east: bounds.getNorthEast().getLng(),
        })
      }
      maps.event.addListener(map, 'idle', updateBounds)
      window.addEventListener('hanmadi:locate', locate)
      setSdkState('ready')
      updateBounds()
    }).catch(() => active && setSdkState('fallback'))
    return () => { active = false; window.clearTimeout(loadingFallback); window.clearTimeout(revealTimer); clustererRef.current?.clear(); window.removeEventListener('hanmadi:locate', locate) }
  }, [key])

  useEffect(() => {
    if (sdkState !== 'ready' || !clustererRef.current) return
    const maps = getKakaoMaps()
    clustererRef.current.clear()
    markersRef.current = props.apartments.map((apartment) => {
      const marker = new maps.Marker({ position: new maps.LatLng(apartment.latitude, apartment.longitude), image: markerImage(maps, apartment), title: apartment.name })
      marker.__sentiment = sentimentCounts(apartment)
      maps.event.addListener(marker, 'click', () => onSelectRef.current(apartment))
      return marker
    })
    clustererRef.current.addMarkers(markersRef.current)
  }, [props.apartments, sdkState])

  if (sdkState === 'fallback') return <FallbackMap {...props} />
  const mapReady = sdkState === 'ready' && initialClustersReady
  const zoomIn = () => mapRef.current?.setLevel(Math.max(1, mapRef.current.getLevel() - 1))
  const zoomOut = () => mapRef.current?.setLevel(Math.min(14, mapRef.current.getLevel() + 1))
  return <section className="map-canvas kakao-map-shell" aria-label="Kakao 아파트 지도" aria-busy={!mapReady}><div className="kakao-map" ref={containerRef} /><MapLoadingOverlay ready={mapReady} />{mapReady ? <><ZoomControl onIn={zoomIn} onOut={zoomOut} /><SentimentLegend /><p className="map-attribution">© Kakao</p></> : null}</section>
}
