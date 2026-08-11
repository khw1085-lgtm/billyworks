import type { Apartment, Sentiment } from '../types'

export const SENTIMENT_COLORS = {
  positive: '#278a57',
  negative: '#e34832',
  neutral: '#777770',
} as const

export function sentimentCounts(apartment: Pick<Apartment, 'positiveCount' | 'negativeCount'>) {
  return { positive: apartment.positiveCount ?? 0, negative: apartment.negativeCount ?? 0 }
}

export function sentimentColor(positive: number, negative: number) {
  const total = positive + negative
  if (!total) return SENTIMENT_COLORS.neutral
  const positiveRatio = positive / total
  const negativeRgb = [227, 72, 50]
  const positiveRgb = [39, 138, 87]
  const rgb = negativeRgb.map((value, index) => Math.round(value + (positiveRgb[index] - value) * positiveRatio))
  return `rgb(${rgb.join(', ')})`
}

export function dominantSentiment(positive: number, negative: number): Sentiment | 'neutral' {
  if (positive === negative) return 'neutral'
  return positive > negative ? 'positive' : 'negative'
}

export function sentimentLabel(positive: number, negative: number) {
  const dominant = dominantSentiment(positive, negative)
  if (dominant === 'positive') return '장점이 더 많아요'
  if (dominant === 'negative') return '불만이 더 많아요'
  return positive + negative ? '장점과 불만이 비슷해요' : '아직 한마디가 없어요'
}
