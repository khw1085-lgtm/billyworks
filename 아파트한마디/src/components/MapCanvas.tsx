import { Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getKakaoMaps, loadKakaoMaps } from '../lib/kakaoMaps'
import type { Apartment, MapBounds } from '../types'

type Props = {
  apartments: Apartment[]
  selectedId?: string
  zoom: number
  onZoom: (zoom: number) => void
  onSelect: (apartment: Apartment) => void
  onBoundsChange?: (bounds: MapBounds) => void
}

function markerImage(maps: any, apartment: Apartment) {
  const active = apartment.postCount >= 10
  const size = active ? 42 : apartment.postCount ? 32 : 18
  const fill = active ? '#e8482a' : apartment.postCount ? '#292927' : '#8e8e87'
  const label = apartment.postCount ? `<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-size="${active ? 13 : 11}" font-weight="700">${apartment.postCount}</text>` : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" stroke="white" stroke-width="3"/>${label}</svg>`
  return new maps.MarkerImage(`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, new maps.Size(size, size))
}

function FallbackMap({ apartments, selectedId, zoom, onZoom, onSelect }: Props) {
  const visible = zoom < 1.15 ? apartments.filter((_, index) => index % 2 === 0 || index < 3) : apartments
  return <section className="map-canvas fallback-map" aria-label="서울·경기 샘플 아파트 지도">
    <div className="map-grid" style={{ transform: `scale(${zoom})` }} aria-hidden="true"><span className="river" /><span className="district d1">은평구</span><span className="district d2">마포구</span><span className="district d3">성동구</span><span className="district d4">송파구</span></div>
    <div className="marker-layer">{visible.map((apartment) => <button key={apartment.id} className={`map-marker ${apartment.postCount >= 10 ? 'active' : ''} ${apartment.trending ? 'trending' : ''} ${selectedId === apartment.id ? 'selected' : ''}`} style={{ left: `${apartment.x}%`, top: `${apartment.y}%` }} onClick={() => onSelect(apartment)} aria-label={`${apartment.name}, 불만 ${apartment.postCount}개${apartment.trending ? ', 불타는 중' : ''}`}>{apartment.trending ? <span className="fire" aria-hidden="true">불타는 중</span> : null}<b>{apartment.postCount || ''}</b></button>)}{zoom < 1.15 ? <button className="map-cluster" onClick={() => onZoom(1.2)} aria-label="숨겨진 단지 2개 확대해서 보기"><b>2</b><span>단지</span></button> : null}</div>
    <ZoomControl onIn={() => onZoom(Math.min(1.35, zoom + .1))} onOut={() => onZoom(Math.max(.85, zoom - .1))} />
    <p className="map-attribution">Kakao JavaScript 키를 연결하면 실제 지도가 표시됩니다</p>
  </section>
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
  const key = import.meta.env.VITE_KAKAO_MAP_JAVASCRIPT_KEY || ''

  useEffect(() => { onSelectRef.current = props.onSelect }, [props.onSelect])
  useEffect(() => { onBoundsChangeRef.current = props.onBoundsChange }, [props.onBoundsChange])

  useEffect(() => {
    if (!key || !containerRef.current) { setSdkState('fallback'); return }
    let active = true
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
      clustererRef.current = new maps.MarkerClusterer({ map, averageCenter: true, minLevel: 6, disableClickZoom: false, styles: [{ width: '48px', height: '48px', background: '#292927', color: '#fff', border: '3px solid #fff', borderRadius: '50%', textAlign: 'center', fontWeight: '700', lineHeight: '42px' }] })
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
    return () => { active = false; clustererRef.current?.clear(); window.removeEventListener('hanmadi:locate', locate) }
  }, [key])

  useEffect(() => {
    if (sdkState !== 'ready' || !clustererRef.current) return
    const maps = getKakaoMaps()
    clustererRef.current.clear()
    markersRef.current = props.apartments.map((apartment) => {
      const marker = new maps.Marker({ position: new maps.LatLng(apartment.latitude, apartment.longitude), image: markerImage(maps, apartment), title: apartment.name })
      maps.event.addListener(marker, 'click', () => onSelectRef.current(apartment))
      return marker
    })
    clustererRef.current.addMarkers(markersRef.current)
  }, [props.apartments, sdkState])

  if (sdkState === 'fallback') return <FallbackMap {...props} />
  const zoomIn = () => mapRef.current?.setLevel(Math.max(1, mapRef.current.getLevel() - 1))
  const zoomOut = () => mapRef.current?.setLevel(Math.min(14, mapRef.current.getLevel() + 1))
  return <section className="map-canvas kakao-map-shell" aria-label="Kakao 아파트 지도"><div className="kakao-map" ref={containerRef} />{sdkState === 'loading' ? <div className="map-loading" role="status">카카오맵을 불러오는 중…</div> : null}<ZoomControl onIn={zoomIn} onOut={zoomOut} /><p className="map-attribution">© Kakao</p></section>
}
