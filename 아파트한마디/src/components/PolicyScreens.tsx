import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import { navigate } from '../lib/navigation'
import type { Post } from '../types'

export function RightsScreen() {
  return <main className="policy-page" id="main-content"><button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={18} />지도로 돌아가기</button><span className="eyebrow"><ShieldCheck size={15} />운영 원칙</span><h1>권리침해 및<br />삭제 요청</h1><p>특정 개인을 식별할 수 있는 정보, 협박, 불법 콘텐츠는 빠르게 검토합니다. 욕설이나 거친 표현만 있다는 이유로 삭제하지 않습니다.</p><section><h2>접수할 수 있는 내용</h2><ul><li>이름, 동·호수, 전화번호, 차량번호 등 개인정보</li><li>구체적인 폭행·살해 협박 또는 특정인 공격</li><li>불법 촬영물, 성적 모욕, 광고·반복 도배</li></ul></section><a className="primary-button" href="mailto:report@apartment-hanmadi.kr"><Mail size={17} />report@apartment-hanmadi.kr</a></main>
}

export function AdminScreen({ posts, onHide, onDelete }: { posts: Post[]; onHide: (id: string) => void; onDelete: (id: string) => void }) {
  return <main className="admin-page" id="main-content"><button className="back-link" onClick={() => navigate('/')}><ArrowLeft size={18} />서비스로 돌아가기</button><span className="eyebrow">샘플 관리자 도구</span><h1>게시물 검토</h1><p>실서비스에서는 별도 인증과 서버 권한이 필요합니다. 현재는 숨김·삭제 상태 전환을 검증하는 데모입니다.</p><div>{posts.map((post) => <article key={post.id}><span>{post.status}</span><p>{post.content}</p><footer><button onClick={() => onHide(post.id)}>임시 숨김</button><button onClick={() => onDelete(post.id)}>삭제</button></footer></article>)}</div></main>
}
