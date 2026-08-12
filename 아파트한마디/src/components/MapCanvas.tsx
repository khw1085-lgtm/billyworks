import { Minus, Plus } from 'lucide-react'
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

function translucentColor(color: string, alpha = .78) {
  if (color.startsWith('#')) {
    const value = color.slice(1)
    const channels = value.length === 3
      ? value.split('').map((channel) => Number.parseInt(channel + channel, 16))
      : [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)].map((channel) => Number.parseInt(channel, 16))
    return `rgba(${channels.join(', ')}, ${alpha})`
  }
  const channels = color.match(/\d+/g)?.slice(0, 3)
  return channels ? `rgba(${channels.join(', ')}, ${alpha})` : color
}

function clusterStyle(size: number) {
  return {
    width: `${size}px`, height: `${size}px`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(119, 119, 112, .78)', color: '#fff', border: '0', borderRadius: '50%', textAlign: 'center', fontWeight: '700', lineHeight: '1', boxShadow: '0 3px 12px rgba(25,25,22,.18)',
  }
}

function markerImage(maps: any, apartment: Apartment) {
  const active = apartment.postCount >= 10
  const size = active ? 42 : apartment.postCount ? 32 : 18
  const { positive, negative } = sentimentCounts(apartment)
  const fill = sentimentColor(positive, negative)
  const label = apartment.postCount ? `<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-size="${active ? 13 : 11}" font-weight="700">${apartment.postCount}</text>` : ''
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
    <div className="marker-layer">{visible.map((apartment) => { const { positive, negative } = sentimentCounts(apartment); const label = sentimentLabel(positive, negative); return <button key={apartment.id} className={`map-marker ${apartment.postCount >= 10 ? 'active' : ''} ${apartment.trending ? 'trending' : ''} ${selectedId === apartment.id ? 'selected' : ''}`} style={{ left: `${apartment.x}%`, top: `${apartment.y}%`, backgroundColor: sentimentColor(positive, negative) }} onClick={() => onSelect(apartment)} aria-label={`${apartment.name}, 장점 ${positive}개, 불만 ${negative}개, ${label}`}><b>{apartment.postCount || ''}</b></button> })}{zoom < 1.15 ? <button className="map-cluster sentiment-cluster cluster-enter" style={{ width: fallbackClusterSize, height: fallbackClusterSize, backgroundColor: translucentColor(sentimentColor(clusterCounts.positive, clusterCounts.negative)) }} onClick={() => onZoom(1.2)} aria-label={`숨겨진 단지 2개, ${clusterLabel}, 확대해서 보기`}><strong>2</strong></button> : null}</div>
    <ZoomControl onIn={() => onZoom(Math.min(1.35, zoom + .1))} onOut={() => onZoom(Math.max(.85, zoom - .1))} />
    <SentimentLegend />
    <p className="map-attribution">Kakao JavaScript 키를 연결하면 실제 지도가 표시됩니다</p>
  </section>
}

function SentimentLegend() {
  return <div className="sentiment-legend" aria-label="지도 색상과 원 크기 안내"><div><span><i className="positive" />장점 많음</span><b aria-hidden="true" /><span><i className="negative" />불만 많음</span></div><small>원 크기 = 포함 단지 수</small></div>
}

function ZoomControl({ onIn, onOut }: { onIn: () => void; onOut: () => void }) {
  return <div className="zoom-control" aria-label="지도 확대 축소"><button onClick={onIn} aria-label="지도 확대"><Plus size={18} /></button><button onClick={onOut} aria-label="지도 축소"><Minus size={18} /></button></div>
}

export function MapCanvas(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const clustererRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const hasAnimatedClustersRef = useRef(false)
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
    let revealTimer = 0
    let safetyTimer = 0
    let revealScheduled = false
    const loadingStartedAt = performance.now()
    setInitialClustersReady(false)
    const revealClusters = () => {
      if (revealScheduled) return
      revealScheduled = true
      const minimumLoadingTime = 650
      const delay = Math.max(0, minimumLoadingTime - (performance.now() - loadingStartedAt))
      revealTimer = window.setTimeout(() => {
        if (active) setInitialClustersReady(true)
      }, delay)
    }
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
        const animateInitialClusters = clusters.length > 0 && !hasAnimatedClustersRef.current
        clusters.forEach((cluster, index) => {
          const counts = cluster.getMarkers().reduce((total: { positive: number; negative: number }, marker: any) => ({ positive: total.positive + (marker.__sentiment?.positive ?? 0), negative: total.negative + (marker.__sentiment?.negative ?? 0) }), { positive: 0, negative: 0 })
          const content = cluster.getClusterMarker().getContent()
          if (content instanceof HTMLElement) {
            const count = document.createElement('strong')
            count.textContent = String(cluster.getSize())
            content.replaceChildren(count)
            content.classList.add('sentiment-cluster')
            if (animateInitialClusters) {
              content.classList.add('cluster-enter')
              content.style.animationDelay = `${Math.min(index * 16, 160)}ms`
            }
            content.style.background = translucentColor(sentimentColor(counts.positive, counts.negative))
            content.title = `${sentimentLabel(counts.positive, counts.negative)} · 장점 ${counts.positive} · 불만 ${counts.negative}`
            content.setAttribute('aria-label', content.title)
          }
        })
        if (animateInitialClusters) hasAnimatedClustersRef.current = true
        if (clusters.length > 0) revealClusters()
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
      safetyTimer = window.setTimeout(revealClusters, 5000)
      updateBounds()
    }).catch(() => active && setSdkState('fallback'))
    return () => { active = false; window.clearTimeout(revealTimer); window.clearTimeout(safetyTimer); clustererRef.current?.clear(); window.removeEventListener('hanmadi:locate', locate) }
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
  return <section className={`map-canvas kakao-map-shell ${mapReady ? '' : 'is-loading'}`} aria-label="Kakao 아파트 지도" aria-busy={!mapReady}><div className="kakao-map" ref={containerRef} />{!mapReady ? <div className="map-loading" role="status"><span>불러오는 중</span></div> : null}<ZoomControl onIn={zoomIn} onOut={zoomOut} /><SentimentLegend /><p className="map-attribution">© Kakao</p></section>
}
