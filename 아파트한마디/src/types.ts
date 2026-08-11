export type Sentiment = 'positive' | 'negative'

export type Category = '층간소음' | '주차' | '관리비' | '엘리베이터' | '하자' | '냄새' | '교통' | '관리사무소' | '이웃' | '택배' | '조경' | '보안' | '편의시설' | '교육' | '구조' | '기타'

export type Apartment = {
  id: string
  name: string
  address: string
  region: string
  latitude: number
  longitude: number
  x: number
  y: number
  householdCount: number
  postCount: number
  positiveCount?: number
  negativeCount?: number
  trending?: boolean
  topics: Category[]
  source?: 'k-apt' | 'sample'
}

export type MapBounds = {
  south: number
  west: number
  north: number
  east: number
}

export type Post = {
  id: string
  apartmentId: string
  anonymousId: string
  sentiment: Sentiment
  category: Category
  content: string
  agreeCount: number
  sameCount: number
  commentCount: number
  createdAt: string
  status: 'visible' | 'hidden' | 'deleted'
  mine?: boolean
}

export type ReportReason = '개인정보 노출' | '특정인 공격' | '협박' | '허위 사실' | '광고·도배' | '불법 콘텐츠'
