export type Category = '층간소음' | '주차' | '관리비' | '엘리베이터' | '하자' | '냄새' | '교통' | '관리사무소' | '이웃' | '택배' | '기타'

export type Apartment = {
  id: string
  name: string
  address: string
  region: string
  x: number
  y: number
  householdCount: number
  postCount: number
  trending?: boolean
  topics: Category[]
}

export type Post = {
  id: string
  apartmentId: string
  anonymousId: string
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
