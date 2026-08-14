import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export function ReportDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState('광고·중개업자 의심')
  const reasons = ['광고·중개업자 의심', '허위 정보', '개인정보 노출', '이해관계 미표시', '욕설·비방']
  return <div className="modal-backdrop"><section className="report-dialog" role="dialog" aria-modal="true" aria-labelledby="report-title"><header><AlertTriangle size={21} /><h2 id="report-title">게시물 신고</h2><button autoFocus className="icon-button" onClick={onClose} aria-label="닫기"><X size={20} /></button></header><p>검토가 필요한 이유를 선택해주세요. 신고자의 정보는 작성자에게 공개되지 않습니다.</p><div>{reasons.map(item => <label key={item}><input type="radio" name="reason" checked={reason === item} onChange={() => setReason(item)} /><span>{item}</span></label>)}</div><footer><button className="secondary-button" onClick={onClose}>취소</button><button className="danger-button" onClick={onDone}>신고 접수</button></footer></section></div>
}
