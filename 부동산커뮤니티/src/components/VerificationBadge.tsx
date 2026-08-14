import { BadgeCheck, Clock3 } from 'lucide-react'

export function VerificationBadge({ status }: { status: 'current' | 'past' | 'none' }) {
  if (status === 'none') return <span className="verification neutral">미인증 후기</span>
  return <span className={status === 'current' ? 'verification' : 'verification past'}>{status === 'current' ? <BadgeCheck size={14} /> : <Clock3 size={13} />}{status === 'current' ? '현재 거주 인증' : '과거 거주 인증'}</span>
}
