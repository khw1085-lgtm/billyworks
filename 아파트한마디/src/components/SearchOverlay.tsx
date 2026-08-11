import { Search, X } from 'lucide-react'
import { useMemo, useRef, useState, useEffect } from 'react'
import type { Apartment } from '../types'

type Props = { apartments: Apartment[]; onClose: () => void; onSelect: (apartment: Apartment) => void }

export function SearchOverlay({ apartments, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => inputRef.current?.focus(), [])
  const results = useMemo(() => apartments.filter((item) => `${item.name} ${item.address} ${item.region}`.includes(query.trim())).slice(0, 6), [apartments, query])
  return <div className="search-overlay" role="dialog" aria-modal="true" aria-label="아파트 검색">
    <header><Search size={20} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="아파트 또는 지역을 검색하세요" aria-label="검색어" /><button onClick={onClose} aria-label="검색 닫기"><X size={21} /></button></header>
    <div className="search-results"><p>{query ? `검색 결과 ${results.length}개` : '많이 찾는 아파트'}</p>{results.map((apartment) => <button key={apartment.id} onClick={() => onSelect(apartment)}><span><strong>{apartment.name}</strong><small>{apartment.address}</small></span><b>{apartment.postCount}개</b></button>)}</div>
  </div>
}
