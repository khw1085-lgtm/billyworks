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

## 모바일 앱 배포

현재 빌드는 반응형 PWA로, HTTPS 환경에 배포하면 Android의 `앱 설치` 버튼과 iOS Safari의 `홈 화면에 추가`를 통해 독립 앱처럼 실행할 수 있습니다. 모바일 안전 영역, 동적 화면 높이, 오프라인 앱 셸, 192·512px 및 iOS 전용 아이콘이 포함됩니다.

```bash
npm run build
# dist 결과물을 Vercel 또는 다른 HTTPS 호스팅에 배포
```

App Store·Google Play에 스토어 앱으로 제출할 때는 이 PWA 빌드를 Capacitor 웹뷰로 감싼 후 Apple/Google 개발자 계정, 서명 인증서, 스토어 메타데이터를 추가하면 됩니다. 현재 구조는 해당 랩핑을 전제로 경로와 안전 영역을 구성했습니다.

## Kakao Maps 연결

카카오디벨로퍼스에서 앱의 카카오맵 사용 설정을 켜고 JavaScript 키에 로컬·배포 도메인을 등록한 뒤 환경변수를 설정합니다. REST API 키가 아니라 **JavaScript 키**를 사용해야 합니다.

```bash
cp .env.example .env.local
# .env.local의 VITE_KAKAO_MAP_JAVASCRIPT_KEY 입력
npm run dev
```

키가 있으면 Kakao Maps JavaScript SDK의 `clusterer,services` 라이브러리를 비동기로 불러와 실제 지도, 마커 클러스터, 현재 위치 이동, viewport 내 마커 갱신이 활성화됩니다. 키가 없거나 SDK가 실패하면 전체 흐름을 테스트할 수 있는 샘플 지도로 자동 전환합니다.

## 전국 아파트 데이터 연결

지도는 현재 화면의 남·서·북·동 좌표만 `/api/apartments`에 전달하고 해당 영역의 단지를 받아 클러스터링합니다. 전국 화면에서도 전체 21,000여 단지를 누락하지 않도록 최대 25,000개까지 반환하며, 개발 환경은 `public/data/apartments.json`, Vercel은 동일 파일을 읽는 서버리스 API를 사용합니다.

공공데이터포털에서 `국토교통부_공동주택 단지 목록제공 서비스` 활용 신청을 완료한 뒤 `.env.local`에 서버 전용 키를 설정합니다. 이 두 키에는 `VITE_` 접두사를 붙이지 않습니다.

```bash
DATA_GO_KR_SERVICE_KEY=발급받은_일반_인증키
KAKAO_REST_API_KEY=카카오_앱_REST_API_키

# 처음에는 일부 단지만 검증
set -a; source .env.local; set +a
npm run data:import -- --limit=100

# 검증 후 전국 수집
npm run data:import
```

수집기는 K-apt 단지 코드를 기본 키로 중복을 제거하고 카카오 로컬 API로 주소를 좌표화합니다. 중간 좌표 결과는 `.cache/geocodes.json`에 체크포인트로 저장되므로 중단 후 다시 실행해도 이미 변환한 주소는 재호출하지 않습니다. 새 데이터 파일은 전체 작업이 성공한 뒤에만 기존 파일과 교체됩니다.

데이터가 커지면 [supabase/schema.sql](./supabase/schema.sql)의 PostGIS 테이블과 영역 조회 함수를 적용해 정적 JSON 대신 데이터베이스로 이전할 수 있습니다.

로컬 악용 방지 로직은 UX 프로토타입입니다. 운영 환경에서는 게시물·신고·rate limit·IP 솔트 해시를 서버와 PostgreSQL/Supabase로 이전해야 합니다.
