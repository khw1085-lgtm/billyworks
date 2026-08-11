import type { Complex, Post } from './types'

export const topics = ['전체', '교통', '층간소음', '주차', '관리비', '치안', '학군', '육아', '편의시설', '하자', '이웃', '재건축·개발']

export const posts: Post[] = [
  { id: 1, author: '마포새댁', avatar: 'ㅁㅍ', verified: 'current', complex: '마포래미안푸르지오', location: '서울 마포구 아현동', period: '2021.03 ~ 현재 · 5년차', family: '신혼 · 자가', topic: '교통', time: '12분 전', summary: '도보 시간은 있지만 대중교통 선택지가 많아요', content: '출근 시간대에 집에서 2호선 아현역 승강장까지 실제로 11분 정도 걸려요. 단지 안에서 걷는 시간이 생각보다 있지만 공덕까지 버스 선택지가 많아서 비 오는 날도 괜찮습니다. 오전 8시 10분 전후는 2호선이 가장 붐벼요.', helpful: 128, comments: 24, score: 4.4 },
  { id: 2, author: '두아이아빠', avatar: '두아', verified: 'past', complex: '헬리오시티', location: '서울 송파구 가락동', period: '2019.08 ~ 2024.02 · 4년 6개월', family: '초등 자녀 · 전세', topic: '주차', time: '1시간 전', content: '지하 주차장은 동마다 체감이 꽤 달랐습니다. 저녁 9시 전에는 자리를 찾을 만하지만 늦게 들어오면 연결 통로 쪽까지 가야 했어요. 대신 택배 차량과 입주민 차량 동선이 분리되어 아이와 다니기엔 안심됐습니다.', helpful: 93, comments: 18, score: 3.8 },
  { id: 3, author: '봄날의집', avatar: '봄날', verified: 'current', complex: '광교중흥S클래스', location: '경기 수원시 영통구', period: '2022.11 ~ 현재 · 3년차', family: '영유아 · 자가', topic: '육아', time: '어제', content: '호수공원을 유모차로 바로 나갈 수 있는 점이 가장 좋습니다. 국공립 어린이집은 대기가 길어서 이사 전에 미리 신청하는 편이 좋아요. 단지 상가 소아과는 평일 오후 대기가 30분 정도였습니다.', helpful: 214, comments: 37, score: 4.7 },
  { id: 4, author: '조용한밤', avatar: '조밤', verified: 'none', complex: '성수트리마제', location: '서울 성동구 성수동', period: '2025.01 ~ 현재 · 1년차', family: '1인 · 월세', topic: '층간소음', time: '2일 전', content: '대로변이 아닌 동인데도 주말 저녁 행사 소리가 들릴 때가 있습니다. 창문을 닫으면 생활에 방해될 정도는 아니고, 층간소음은 관리실 대응이 빠른 편이었어요.', helpful: 46, comments: 11, score: 4.1 }
]

export const complexes: Complex[] = [
  { name: '마포래미안푸르지오', location: '서울 마포구 아현동', reports: 284, residents: 128, score: 4.4, positive: ['교통 편리', '단지 관리', '상권'], negative: ['출근 혼잡', '주차 거리'] },
  { name: '헬리오시티', location: '서울 송파구 가락동', reports: 412, residents: 206, score: 4.2, positive: ['커뮤니티', '학군', '생활 인프라'], negative: ['단지 규모', '주차'] },
  { name: '광교중흥S클래스', location: '경기 수원시 영통구', reports: 176, residents: 91, score: 4.7, positive: ['공원', '육아 환경', '조망'], negative: ['어린이집 대기', '출퇴근'] }
]

export const livingScores = [['교통', 88], ['소음', 74], ['주차', 68], ['관리', 91], ['치안', 93], ['교육', 82], ['편의시설', 89], ['커뮤니티', 86]] as const
