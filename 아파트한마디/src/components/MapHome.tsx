import { useState } from 'react'
import { ChevronDown, LocateFixed } from 'lucide-react'
import type { Apartment, MapBounds, Post } from '../types'
import { ApartmentPanel } from './ApartmentPanel'
import { MapCanvas } from './MapCanvas'

type Props = { apartments: Apartment[]; posts: Post[]; selected?: Apartment; onSelect: (item?: Apartment) => void; onWrite: (item: Apartment) => void; onBoundsChange: (bounds: MapBounds) => void }

export function MapHome({ apartments, posts, selected, onSelect, onWrite, onBoundsChange }: Props) {
  const [zoom, setZoom] = useState(1)
  return <main className="map-home" id="main-content">
    <div className="map-message"><span>전국 아파트 장단점 지도</span><h1>살아보니 어때요?<br />좋은 점도, 불편한 점도.</h1><p>로그인 없이 지도에서 아파트를 찍고 실제 경험을 솔직하게 남겨보세요.</p></div>
    <button className="mobile-area"><LocateFixed size={16} />서울·경기 샘플 지역<ChevronDown size={16} /></button>
    <MapCanvas apartments={apartments} selectedId={selected?.id} zoom={zoom} onZoom={setZoom} onSelect={onSelect} onBoundsChange={onBoundsChange} />
    {selected && <ApartmentPanel apartment={selected} posts={posts} onClose={() => onSelect(undefined)} onWrite={() => onWrite(selected)} />}
  </main>
}
