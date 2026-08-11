# 아파트 한마디

로그인 없이 지도에서 아파트를 선택하고 생활 불편을 익명으로 남기는 모바일 우선 PWA 프로토타입입니다.

## 실행

```bash
npm install
npm run dev
```

## 구현된 흐름

- 지도 이동·확대/축소와 축척 기반 샘플 마커 클러스터
- 아파트 검색, 단지 패널/모바일 하단 시트, 단지 게시판
- 브라우저별 익명 ID 발급과 로그인 없는 10초 글쓰기
- 중복 등록·반복 반응 방지, 민감 정보·협박 패턴 사전 검사
- 공감, 나도 그래요, 댓글, 공유, 신고, 본인 글 삭제
- 최신/공감/댓글 정렬, 인기 불만, 권리침해 요청, 관리자 숨김/삭제
- PWA manifest 및 오프라인 앱 셸, Vercel SPA 경로 rewrite

## Kakao Maps 연결

카카오디벨로퍼스에서 앱의 카카오맵 사용 설정을 켜고 JavaScript 키에 로컬·배포 도메인을 등록한 뒤 환경변수를 설정합니다. REST API 키가 아니라 **JavaScript 키**를 사용해야 합니다.

```bash
cp .env.example .env.local
# .env.local의 VITE_KAKAO_MAP_JAVASCRIPT_KEY 입력
npm run dev
```

키가 있으면 Kakao Maps JavaScript SDK의 `clusterer,services` 라이브러리를 비동기로 불러와 실제 지도, 마커 클러스터, 현재 위치 이동, viewport 내 마커 갱신이 활성화됩니다. 키가 없거나 SDK가 실패하면 전체 흐름을 테스트할 수 있는 샘플 지도로 자동 전환합니다.

로컬 악용 방지 로직은 UX 프로토타입입니다. 운영 환경에서는 게시물·신고·rate limit·IP 솔트 해시를 서버와 PostgreSQL/Supabase로 이전해야 합니다.
