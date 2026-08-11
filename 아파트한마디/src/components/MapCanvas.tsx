import { Minus, Plus } from 'lucide-react'
import type { Apartment } from '../types'

type Props = {
  apartments: Apartment[]
  selectedId?: string
  zoom: number
  onZoom: (zoom: number) => void
  onSelect: (apartment: Apartment) => void
}

export function MapCanvas({ apartments, selectedId, zoom, onZoom, onSelect }: Props) {
  const visible = zoom < 1.15 ? apartments.filter((_, index) => index % 2 === 0 || index < 3) : apartments
  return (
    <section className="map-canvas" aria-label="서울·경기 샘플 아파트 지도">
      <div className="map-grid" style={{ transform: `scale(${zoom})` }} aria-hidden="true">
        <span className="river" />
        <span className="district d1">은평구</span><span className="district d2">마포구</span>
        <span className="district d3">성동구</span><span className="district d4">송파구</span>
      </div>
      <div className="marker-layer">
        {visible.map((apartment) => (
          <button
            key={apartment.id}
            className={`map-marker ${apartment.postCount >= 10 ? 'active' : ''} ${apartment.trending ? 'trending' : ''} ${selectedId === apartment.id ? 'selected' : ''}`}
            style={{ left: `${apartment.x}%`, top: `${apartment.y}%` }}
            onClick={() => onSelect(apartment)}
            aria-label={`${apartment.name}, 불만 ${apartment.postCount}개${apartment.trending ? ', 불타는 중' : ''}`}
          >
            {apartment.trending && <span className="fire" aria-hidden="true">불타는 중</span>}
            <b>{apartment.postCount || ''}</b>
          </button>
        ))}
        {zoom < 1.15 ? <button className="map-cluster" onClick={() => onZoom(1.2)} aria-label="숨겨진 단지 2개 확대해서 보기"><b>2</b><span>단지</span></button> : null}
      </div>
      <div className="zoom-control" aria-label="지도 확대 축소">
        <button onClick={() => onZoom(Math.min(1.35, zoom + .1))} aria-label="지도 확대"><Plus size={18} /></button>
        <button onClick={() => onZoom(Math.max(.85, zoom - .1))} aria-label="지도 축소"><Minus size={18} /></button>
      </div>
      <p className="map-attribution">샘플 지도 · Kakao Maps 연결 준비</p>
    </section>
  )
}
