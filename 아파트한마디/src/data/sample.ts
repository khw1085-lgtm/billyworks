import type { Apartment, Category, Post } from '../types'

export const categories: Category[] = ['층간소음', '주차', '관리비', '엘리베이터', '하자', '냄새', '교통', '관리사무소', '이웃', '택배', '기타']

export const apartments: Apartment[] = [
  { id: 'mapo-raemian', name: '마포래미안푸르지오', address: '서울 마포구 마포대로 195', region: '서울 마포구', x: 38, y: 41, householdCount: 3885, postCount: 38, trending: true, topics: ['주차', '엘리베이터', '관리비'] },
  { id: 'heliocity', name: '헬리오시티', address: '서울 송파구 송파대로 345', region: '서울 송파구', x: 68, y: 62, householdCount: 9510, postCount: 24, topics: ['주차', '층간소음', '택배'] },
  { id: 'eunpyeong-lotte', name: '은평롯데캐슬', address: '서울 은평구 진관3로 70', region: '서울 은평구', x: 26, y: 22, householdCount: 1618, postCount: 8, topics: ['교통', '냄새', '관리비'] },
  { id: 'seongsu-trimage', name: '트리마제', address: '서울 성동구 왕십리로 16', region: '서울 성동구', x: 56, y: 46, householdCount: 688, postCount: 13, topics: ['관리비', '이웃', '주차'] },
  { id: 'gwanggyo-class', name: '광교중흥S클래스', address: '경기 수원시 영통구 광교호수공원로 277', region: '경기 수원시', x: 74, y: 78, householdCount: 2231, postCount: 5, topics: ['엘리베이터', '하자', '교통'] },
  { id: 'dasan-centreville', name: '다산센트레빌', address: '경기 남양주시 다산중앙로 82번길 15', region: '경기 남양주시', x: 81, y: 31, householdCount: 1423, postCount: 17, trending: true, topics: ['층간소음', '관리사무소', '주차'] },
  { id: 'mokdong-7', name: '목동신시가지7단지', address: '서울 양천구 목동로 212', region: '서울 양천구', x: 22, y: 58, householdCount: 2550, postCount: 0, topics: ['주차', '하자', '관리비'] },
]

export const seedPosts: Post[] = [
  { id: 'p1', apartmentId: 'mapo-raemian', anonymousId: '익명 182', category: '엘리베이터', content: '아침마다 엘리베이터 기다리다가 속 터진다. 출근 시간엔 한 번 놓치면 거의 5분을 더 기다려야 함.', agreeCount: 128, sameCount: 74, commentCount: 24, createdAt: '12분 전', status: 'visible' },
  { id: 'p2', apartmentId: 'mapo-raemian', anonymousId: '익명 529', category: '주차', content: '여기 주차가 진짜 짜증 나는 이유는 밤 10시만 넘으면 이중주차가 기본이라는 거. 연락처도 없는 차가 꼭 있다.', agreeCount: 93, sameCount: 61, commentCount: 18, createdAt: '1시간 전', status: 'visible' },
  { id: 'p3', apartmentId: 'heliocity', anonymousId: '익명 044', category: '택배', content: '단지가 넓은 건 알겠는데 오배송이 너무 잦다. 동 표기 안내부터 제대로 정비했으면 좋겠다.', agreeCount: 76, sameCount: 39, commentCount: 11, createdAt: '2시간 전', status: 'visible' },
  { id: 'p4', apartmentId: 'dasan-centreville', anonymousId: '익명 731', category: '층간소음', content: '밤마다 가장 스트레스받는 건 위층 발망치. 관리사무소에 얘기해도 안내방송 한 번으로 끝이다.', agreeCount: 164, sameCount: 102, commentCount: 31, createdAt: '28분 전', status: 'visible' },
  { id: 'p5', apartmentId: 'seongsu-trimage', anonymousId: '익명 306', category: '관리비', content: '관리비는 더럽게 비싼데 공용시설 점검 공지는 늘 늦다. 내역도 좀 알아보기 쉽게 공개했으면.', agreeCount: 57, sameCount: 42, commentCount: 8, createdAt: '오늘 09:14', status: 'visible' },
]
