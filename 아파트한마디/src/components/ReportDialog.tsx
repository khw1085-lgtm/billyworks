import { useState } from 'react'
import { X } from 'lucide-react'
import type { ReportReason } from '../types'

const reasons: ReportReason[] = ['개인정보 노출', '특정인 공격', '협박', '허위 사실', '광고·도배', '불법 콘텐츠']
type Props = { onClose: () => void; onSubmit: (reason: ReportReason, detail: string) => void }

export function ReportDialog({ onClose, onSubmit }: Props) {
  const [reason, setReason] = useState<ReportReason>('개인정보 노출')
  const [detail, setDetail] = useState('')
  return <div className="modal-backdrop"><section className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title">
    <header><h2 id="report-title">게시물 신고</h2><button onClick={onClose} aria-label="신고 닫기"><X size={20} /></button></header>
    <p>욕설만으로 삭제하지 않습니다. 아래 운영 원칙에 해당하는 경우만 신고해주세요.</p>
    <fieldset><legend>신고 사유</legend>{reasons.map((item) => <label key={item}><input type="radio" name="reason" checked={reason === item} onChange={() => setReason(item)} />{item}</label>)}</fieldset>
    <label htmlFor="report-detail">추가 설명 <span>선택</span></label><textarea id="report-detail" value={detail} onChange={(event) => setDetail(event.target.value)} />
    <footer><button className="text-button" onClick={onClose}>취소</button><button className="primary-button" onClick={() => onSubmit(reason, detail)}>신고 접수</button></footer>
  </section></div>
}
