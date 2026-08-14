import { Building2, ChevronUp, LocateFixed, MapPin, SlidersHorizontal } from 'lucide-react'
import { complexes } from '../data'

export function MapExplore({ onComplex }: { onComplex: () => void }) {
  return <main className="map-page" id="main-content">
    <div className="map-toolbar"><button><SlidersHorizontal size={17} />필터</button><button>아파트·오피스텔</button><button>인증 후기만</button><button>만족도 4.0+</button></div>
    <div className="map-canvas" aria-label="서울 지역 실거주 리포트 지도">
      <div className="river" /><span className="district d1">마포구</span><span className="district d2">용산구</span><span className="district d3">성동구</span><span className="district d4">송파구</span>
      <button className="map-pin p1" onClick={onComplex}><span>마포래미안</span><b>후기 284</b></button><button className="map-pin p2"><span>한남더힐</span><b>후기 96</b></button><button className="map-pin p3"><span>트리마제</span><b>4.1</b></button><button className="map-pin p4"><span>헬리오시티</span><b>후기 412</b></button><button className="locate-button" aria-label="내 위치"><LocateFixed size={20} /></button>
    </div>
    <section className="map-sheet"><div className="sheet-handle" /><div className="sheet-heading"><div><small>현재 지도 영역</small><h1>주목할 단지 24곳</h1></div><button aria-label="단지 목록 펼치기"><ChevronUp size={20} /></button></div><div className="map-complex-list">{complexes.map(item => <button key={item.name} onClick={onComplex}><span className="map-thumb"><Building2 size={24} /></span><span><strong>{item.name}</strong><small><MapPin size={12} />{item.location}</small><em>실거주 후기 {item.reports} · 인증 {item.residents}명</em></span><b>{item.score}</b></button>)}</div></section>
  </main>
}
