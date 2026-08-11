export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="brand" aria-label="살담 홈"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>{!compact && <strong>살담</strong>}</span>
}
