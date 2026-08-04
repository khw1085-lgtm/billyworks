import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STORAGE_KEY = "billyworks-seo-backoffice-v2";
const SUPABASE_URL = "https://caileseujmagiwlqyimh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_O3T_0L0bMJjq276h3ZsdcA_3RzThdms";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const fallbackHeadings = [
  [1, "웹사이트를 통해 브랜드의 가능성을 확장합니다"],
  [2, "우리가 할 수 있는 일"],
  [3, "웹사이트 디자인"], [3, "Framer 웹사이트 개발"], [3, "UI/UX 디자인"],
  [3, "디자인 시스템"], [3, "마케팅"], [2, "일하는 방식"],
  [3, "01. 발견과 정의"], [3, "02. 기획과 디자인"], [3, "03. 개발과 검수"],
  [2, "프로젝트"], [3, "무신사 프로젝트"], [3, "직방 CEO 프로젝트"],
  [3, "호갱노노 프로젝트"], [2, "함께 좋은 웹사이트를 만들어볼까요?"],
].map(([level, text], index) => ({ key: `heading-${index}`, level, tag: `h${level}`, text, hidden: true, id: "" }));

const defaults = {
  page: {
    name: "Billyworks Home", slug: "/", status: "Published", index: true,
    title: "BillyWorks | 브랜드 웹사이트 디자인 에이전시",
    description: "브랜드 웹사이트, 인터랙티브 웹, UI/UX 디자인과 개발을 한 팀에서 제공합니다.",
    primaryKeyword: "웹사이트 디자인 에이전시", secondaryKeywords: "Framer, UI/UX, 브랜드 웹사이트",
    canonical: "https://billyworks.com/", language: "ko-KR", author: "Billyworks",
    ogTitle: "BillyWorks | 브랜드의 가능성을 확장합니다", ogDescription: "디자인부터 개발, 마케팅까지 한 팀에서.",
    ogImage: "https://billyworks.com/og-image.jpg", ogType: "website", twitterCard: "summary_large_image",
    allowFollow: true, noarchive: false, nosnippet: false, noimageindex: false,
    sitemapIncluded: true, priority: 1, changeFrequency: "weekly",
  },
  global: {
    siteName: "Billyworks", defaultTitle: "Billyworks", titleTemplate: "%page_title% | Billyworks",
    description: "브랜드의 가능성을 확장하는 웹사이트 디자인 에이전시", domain: "https://billyworks.com",
    language: "ko-KR", organization: "Billyworks", email: "billyworks@gmail.com",
    address: "서울특별시 서초구 사임당로 98 2F", twitterCard: "summary_large_image",
  },
  schema: { type: "Organization", name: "Billyworks", url: "https://billyworks.com", description: "브랜드 웹사이트 디자인 에이전시" },
  redirects: [{ source: "/works", destination: "/projects", type: 301, active: true, hits: 0 }],
  robots: "User-agent: *\nAllow: /\n\nDisallow: /admin\nDisallow: /preview\n\nSitemap: https://billyworks.com/sitemap.xml",
  integrations: { searchConsole: false, ga4: false, gtm: false, naver: false, clarity: false },
  quality: {
    mobileFriendly: false, coreWebVitals: false, imageAlt: false,
    brokenLinks: false, schemaValidated: false, sitemapSubmitted: false,
  },
};

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
const initialConfig = stored ? {
  ...structuredClone(defaults), ...stored,
  page: { ...defaults.page, ...stored.page },
  global: { ...defaults.global, ...stored.global },
  schema: { ...defaults.schema, ...stored.schema },
  integrations: { ...defaults.integrations, ...stored.integrations },
  quality: { ...defaults.quality, ...stored.quality },
} : structuredClone(defaults);
const state = {
  config: initialConfig, headings: fallbackHeadings, originalHeadings: new Map(),
  audit: { score: 84, issues: [], counts: {} }, sourcePath: "Vercel demo / browser storage", dirty: false,
  route: location.hash.slice(1) || "overview", pageTab: "basic", localApi: false,
  session: null, remoteLoaded: false,
};

const view = document.querySelector("#view");
const saveButton = document.querySelector("#save-button");
const saveState = document.querySelector("#save-state");
const toast = document.querySelector("#toast");
const authButton = document.querySelector("#auth-button");
const authDialog = document.querySelector("#auth-dialog");
const authForm = document.querySelector("#auth-form");
const authMessage = document.querySelector("#auth-message");

const esc = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const field = (label, name, value, help = "", type = "text") => `<label class="field"><span>${label}</span><input type="${type}" name="${name}" value="${esc(value)}" />${help ? `<small>${help}</small>` : ""}</label>`;
const textarea = (label, name, value, help = "") => `<label class="field field--wide"><span>${label}</span><textarea name="${name}" rows="5">${esc(value)}</textarea>${help ? `<small>${help}</small>` : ""}</label>`;
const toggle = (label, name, checked, help = "") => `<label class="toggle"><span><strong>${label}</strong>${help ? `<small>${help}</small>` : ""}</span><input type="checkbox" name="${name}" ${checked ? "checked" : ""} /><i></i></label>`;
const sectionTitle = (eyebrow, title, description = "") => `<div class="section-title"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${description ? `<p>${description}</p>` : ""}</div></div>`;

function seoChecks() {
  const { page:p, global:g, schema:s, robots, integrations:i, quality:q } = state.config;
  const h1Count = state.headings.filter(h => h.level === 1).length;
  return [
    {id:"title",area:"콘텐츠",title:"검색 결과 제목",detail:"고유한 Title을 30~60자로 유지",done:Boolean(p.title && p.title.length>=30 && p.title.length<=60),route:"pages",priority:"높음",auto:true},
    {id:"description",area:"콘텐츠",title:"Meta Description",detail:"핵심 제안을 담아 70~160자로 작성",done:Boolean(p.description && p.description.length>=70 && p.description.length<=160),route:"pages",priority:"높음",auto:true},
    {id:"keyword",area:"콘텐츠",title:"검색 의도와 핵심 키워드",detail:"페이지별 주·보조 키워드 정의",done:Boolean(p.primaryKeyword && p.secondaryKeywords),route:"pages",priority:"중간",auto:true},
    {id:"heading",area:"콘텐츠",title:"Heading 계층",detail:`H1은 정확히 1개, 현재 ${h1Count}개`,done:h1Count===1 && !state.audit.issues?.some(x=>x.severity==="error"),route:"pages",priority:"높음",auto:true},
    {id:"canonical",area:"기술 SEO",title:"Canonical URL",detail:"중복 페이지의 대표 URL 선언",done:Boolean(p.canonical?.startsWith("https://")),route:"pages",priority:"높음",auto:true},
    {id:"index",area:"기술 SEO",title:"색인·링크 추적 허용",detail:"index, follow 메타 확인",done:Boolean(p.index && p.allowFollow),route:"pages",priority:"높음",auto:true},
    {id:"language",area:"기술 SEO",title:"문서 언어",detail:"lang과 hreflang 기준 설정",done:Boolean(p.language && g.language),route:"global",priority:"중간",auto:true},
    {id:"robots",area:"크롤링",title:"robots.txt",detail:"크롤링 허용과 Sitemap 위치 선언",done:Boolean(robots.includes("User-agent:") && robots.includes("Sitemap:")),route:"sitemap",priority:"높음",auto:true},
    {id:"sitemap",area:"크롤링",title:"XML Sitemap",detail:"대상 페이지 포함 및 최신 상태 유지",done:Boolean(p.sitemapIncluded),route:"sitemap",priority:"높음",auto:true},
    {id:"sitemap-submit",area:"크롤링",title:"Sitemap 제출",detail:"Google·Naver 검색 도구에 제출 후 확인",done:q.sitemapSubmitted,route:"integrations",priority:"높음",manual:"sitemapSubmitted"},
    {id:"og",area:"소셜",title:"Open Graph",detail:"제목·설명·1200×630 대표 이미지",done:Boolean(p.ogTitle && p.ogDescription && p.ogImage),route:"pages",priority:"중간",auto:true},
    {id:"schema",area:"구조화 데이터",title:"Organization JSON-LD",detail:"조직명·URL·설명 필수 속성",done:Boolean(s.type && s.name && s.url && s.description),route:"schema",priority:"중간",auto:true},
    {id:"schema-test",area:"구조화 데이터",title:"리치 결과 검증",detail:"Schema.org 및 Google 도구 오류 0건 확인",done:q.schemaValidated,route:"schema",priority:"중간",manual:"schemaValidated"},
    {id:"search-console",area:"측정",title:"Google Search Console",detail:"색인·검색어·오류 모니터링 연결",done:i.searchConsole,route:"integrations",priority:"높음",auto:true},
    {id:"naver",area:"측정",title:"Naver Search Advisor",detail:"국내 검색 노출 및 사이트 소유 확인",done:i.naver,route:"integrations",priority:"높음",auto:true},
    {id:"analytics",area:"측정",title:"검색 성과 측정",detail:"GA4 또는 GTM 연결",done:i.ga4 || i.gtm,route:"integrations",priority:"중간",auto:true},
    {id:"mobile",area:"경험·성능",title:"모바일 사용성",detail:"반응형, 글자 크기, 터치 영역 실기기 확인",done:q.mobileFriendly,route:"pages",priority:"높음",manual:"mobileFriendly"},
    {id:"cwv",area:"경험·성능",title:"Core Web Vitals",detail:"LCP·INP·CLS를 실제 URL에서 측정",done:q.coreWebVitals,route:"integrations",priority:"높음",manual:"coreWebVitals"},
    {id:"alt",area:"이미지",title:"이미지 대체 텍스트",detail:"의미 있는 이미지 Alt와 장식 이미지 처리",done:q.imageAlt,route:"pages",priority:"중간",manual:"imageAlt"},
    {id:"links",area:"기술 SEO",title:"깨진 링크·리다이렉트",detail:"4xx, 체인, 루프 및 내부 링크 점검",done:q.brokenLinks,route:"redirects",priority:"중간",manual:"brokenLinks"},
  ];
}

function scoreData() {
  const checks=seoChecks(), done=checks.filter(x=>x.done), todo=checks.filter(x=>!x.done);
  return {checks,done,todo,score:Math.round(done.length/checks.length*100)};
}

function overview() {
  const { score, checks, done, todo } = scoreData();
  const excellent = score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 50 ? "Needs Improvement" : "Poor";
  const areas=[...new Set(checks.map(x=>x.area))];
  const taskCard=(item,success=false)=>`<article class="task-card ${success?"task-card--done":""}"><span class="task-state">${success?"✓ 목표 달성":item.priority+" 우선순위"}</span><div><b>${item.title}</b><small>${item.area}</small><p>${item.detail}</p></div>${item.manual?`<button class="button button--compact ${success?"button--ghost":"button--dark"}" data-manual-check="${item.manual}">${success?"완료 취소":"완료 처리"}</button>`:`<button class="text-button" data-route-link="${item.route}">${success?"설정 보기":"처리하기"}</button>`}</article>`;
  return `
    <section class="overview-hero">
      <div><p class="eyebrow">SEO GOAL PROGRESS</p><h2>${score}<span>%</span></h2><strong>${excellent}</strong><p>전체 ${checks.length}개 기준 중 ${done.length}개 달성 · ${todo.length}개 처리 필요</p></div>
      <div class="score-ring" style="--score:${score * 3.6}deg"><span>${score}</span></div>
    </section>
    <section class="metric-grid metric-grid--summary">${[["처리 필요",todo.length],["목표 달성",done.length],["자동 점검",checks.filter(x=>x.auto).length],["수동 검증",checks.filter(x=>x.manual).length]].map(([k,v],i)=>`<article class="metric metric--${i}"><span>${k}</span><strong>${v}</strong></article>`).join("")}</section>
    <section class="work-board"><div class="card work-column work-column--todo">${sectionTitle("TO DO","처리해야 할 내용","우선순위가 높은 항목부터 완료하세요.")}<div class="task-list">${todo.length?todo.map(x=>taskCard(x)).join(""):'<div class="empty-state">모든 SEO 목표를 달성했습니다.</div>'}</div></div><div class="card work-column work-column--done">${sectionTitle("DONE","목표 달성","현재 기준을 통과한 항목입니다.")}<div class="task-list">${done.map(x=>taskCard(x,true)).join("")}</div></div></section>
    <section class="card area-progress">${sectionTitle("SEO COVERAGE","영역별 점검 현황","콘텐츠부터 성능·측정까지 전체 범위를 한 번에 확인합니다.")}<div class="score-bars">${areas.map(area=>{const list=checks.filter(x=>x.area===area),value=list.filter(x=>x.done).length;return `<div><span>${area}<b>${value}/${list.length}</b></span><i><em style="width:${value/list.length*100}%"></em></i></div>`}).join("")}</div></section>`;
}

function pages() {
  if (state.pageTab !== "list") return pageEditor();
  const { score } = scoreData(); const p = state.config.page;
  return `${sectionTitle("PAGES","페이지 관리","사이트의 모든 페이지와 SEO 상태를 확인합니다.")}<div class="toolbar"><input placeholder="페이지명 또는 URL 검색"/><select><option>전체 상태</option><option>Published</option><option>Draft</option></select><select><option>Index / Noindex</option></select></div><div class="table-wrap"><table><thead><tr><th>페이지</th><th>URL</th><th>점수</th><th>Index</th><th>Title</th><th>Description</th><th>H1</th><th>Canonical</th><th>상태</th><th></th></tr></thead><tbody><tr><td><b>${p.name}</b></td><td>${p.slug}</td><td><span class="score-pill">${score}</span></td><td>${p.index?"Index":"Noindex"}</td><td>완료</td><td>완료</td><td>1개</td><td>${p.canonical?"완료":"누락"}</td><td>${p.status}</td><td><button class="text-button" data-edit-page>관리</button></td></tr></tbody></table></div>`;
}

const tabs = [["basic","Basic SEO"],["heading","Heading Structure"],["social","Social Share"],["indexing","Indexing"],["page-schema","Structured Data"],["images","Image SEO"],["advanced","Advanced"]];
function pageEditor() {
  const p = state.config.page;
  let body = "";
  if (state.pageTab === "basic") body = `<div class="form-grid">${field("Page Title","title",p.title,"권장 30~60자")}${field("URL Slug","slug",p.slug,"영문 소문자, 숫자, 하이픈")}${textarea("Meta Description","description",p.description,"권장 70~160자")}${field("Primary Keyword","primaryKeyword",p.primaryKeyword)}${field("Secondary Keywords","secondaryKeywords",p.secondaryKeywords,"쉼표로 구분")}${field("Canonical URL","canonical",p.canonical)}${field("Language","language",p.language)}${field("Author","author",p.author)}</div><div class="search-preview"><span>Google 검색 결과 미리보기</span><h3>${esc(p.title)}</h3><a>${esc(p.canonical)}</a><p>${esc(p.description)}</p></div>`;
  if (state.pageTab === "heading") body = headingEditor();
  if (state.pageTab === "social") body = `<div class="form-grid">${field("Open Graph Title","ogTitle",p.ogTitle)}${field("Open Graph Type","ogType",p.ogType)}${textarea("Open Graph Description","ogDescription",p.ogDescription)}${field("Open Graph Image","ogImage",p.ogImage,"권장 1200×630")}${field("Twitter Card Type","twitterCard",p.twitterCard)}${field("Twitter Title","twitterTitle",p.ogTitle)}${textarea("Twitter Description","twitterDescription",p.ogDescription)}${field("Twitter Image","twitterImage",p.ogImage)}</div><div class="social-preview"><div class="social-preview__image">1200 × 630</div><b>${esc(p.ogTitle)}</b><p>${esc(p.ogDescription)}</p><small>billyworks.com</small></div>`;
  if (state.pageTab === "indexing") body = `<div class="toggle-list">${toggle("Allow Index","index",p.index,"검색엔진 색인 허용")}${toggle("Allow Follow","allowFollow",p.allowFollow,"페이지 링크 추적 허용")}${toggle("Noarchive","noarchive",p.noarchive)}${toggle("Nosnippet","nosnippet",p.nosnippet)}${toggle("Noimageindex","noimageindex",p.noimageindex)}</div><pre class="code-preview">&lt;meta name="robots" content="${p.index?"index":"noindex"}, ${p.allowFollow?"follow":"nofollow"}"&gt;</pre>`;
  if (state.pageTab === "page-schema") body = schemaEditor();
  if (state.pageTab === "images") body = `<div class="table-wrap"><table><thead><tr><th>Thumbnail</th><th>파일명</th><th>Alt Text</th><th>크기</th><th>Format</th><th>Lazy</th><th>사용 위치</th></tr></thead><tbody><tr><td><span class="thumb">SVG</span></td><td>loader-cat.json</td><td>움직이는 고양이 로더</td><td>482×482</td><td>Lottie</td><td>—</td><td>Hero</td></tr><tr><td><span class="thumb">OG</span></td><td>og-image.jpg</td><td><input value="Billyworks 브랜드 웹사이트 디자인"/></td><td>1200×630</td><td>JPG</td><td>OFF</td><td>Social</td></tr></tbody></table></div>`;
  if (state.pageTab === "advanced") body = `<div class="form-grid">${textarea("Custom Head Code","customHead","","잘못된 코드는 저장 전 검사합니다.")}${textarea("Custom Body Code","customBody","")}${field("hreflang","hreflang","ko-KR")}${field("AMP URL","ampUrl","")}${field("RSS URL","rssUrl","")}${field("Web Manifest","manifest","/site.webmanifest")}${textarea("Custom Schema","customSchema","")}${field("Custom robots meta","customRobots","")}</div>`;
  return `<div class="page-editor-header"><button class="back-button" data-back-pages>← Pages</button><div><p class="eyebrow">PAGE SEO</p><h2>${p.name}</h2><span>${p.slug} · ${p.status}</span></div><button class="button button--ai">✦ Generate SEO</button></div><div class="tabs">${tabs.map(([id,label])=>`<button data-tab="${id}" class="${state.pageTab===id?"active":""}">${label}</button>`).join("")}</div><section class="card editor-card">${body}</section>`;
}

function headingEditor() {
  return `<div class="heading-summary">${[1,2,3,4].map(l=>`<div><span>H${l}${l===4?"~H6":""}</span><strong>${state.headings.filter(h=>l===4?h.level>=4:h.level===l).length}</strong></div>`).join("")}</div><div class="outline">${state.headings.map(h=>`<div class="heading-row" data-level="${h.level}"><span class="heading-tag">${h.tag}</span><input class="heading-input" data-heading-key="${h.key}" value="${esc(h.text)}"/><span class="heading-hidden">${h.hidden?"SEO text":"Visible"}</span></div>`).join("")}</div>`;
}
function globalSettings(){const g=state.config.global;return `${sectionTitle("GLOBAL SETTINGS","사이트 기본 SEO","페이지별 값이 없을 때 자동으로 적용됩니다.")}<section class="card editor-card"><div class="form-grid">${field("Site Name","siteName",g.siteName)}${field("Default Title","defaultTitle",g.defaultTitle)}${field("Title Template","titleTemplate",g.titleTemplate,"%page_title% 변수를 사용할 수 있습니다.")}${textarea("Default Meta Description","description",g.description)}${field("Default Canonical Domain","domain",g.domain)}${field("Site Language","language",g.language)}${field("Organization Name","organization",g.organization)}${field("Contact Email","email",g.email,"","email")}${field("Business Address","address",g.address)}${field("Default Twitter Card","twitterCard",g.twitterCard)}</div></section>`}
function schemaEditor(){const s=state.config.schema;const json=JSON.stringify({"@context":"https://schema.org","@type":s.type,name:s.name,url:s.url,description:s.description},null,2);return `<div class="form-grid">${field("Type","type",s.type)}${field("Name","name",s.name)}${field("URL","url",s.url)}${textarea("Description","schemaDescription",s.description)}</div><label class="field field--wide"><span>JSON-LD 미리보기</span><textarea class="code-area" rows="12" readonly>${esc(json)}</textarea></label>`}
function schema(){return `${sectionTitle("STRUCTURED DATA","구조화 데이터","페이지 유형을 선택하고 JSON-LD를 생성·검증합니다.")}<section class="card editor-card">${schemaEditor()}</section>`}
function redirects(){return `${sectionTitle("REDIRECTS","Redirect 관리","301·302·307·308 이동 규칙과 오류를 관리합니다.")}<div class="card editor-card"><div class="inline-form"><input name="redirectSource" placeholder="/old-page"/><span>→</span><input name="redirectDestination" placeholder="/new-page"/><select name="redirectType"><option>301</option><option>302</option><option>307</option><option>308</option></select><button class="button button--dark" data-add-redirect>추가</button></div><div class="table-wrap"><table><thead><tr><th>Source</th><th>Destination</th><th>Type</th><th>Active</th><th>Hits</th></tr></thead><tbody>${state.config.redirects.map(r=>`<tr><td>${esc(r.source)}</td><td>${esc(r.destination)}</td><td>${r.type}</td><td>${r.active?"ON":"OFF"}</td><td>${r.hits}</td></tr>`).join("")}</tbody></table></div></div>`}
function sitemap(){return `${sectionTitle("SITEMAP & ROBOTS","검색엔진 크롤링 설정")}<div class="two-column"><section class="card editor-card"><h3>Sitemap</h3>${toggle("Sitemap 활성화","sitemapIncluded",state.config.page.sitemapIncluded)}${field("Priority","priority",state.config.page.priority)}${field("Change Frequency","changeFrequency",state.config.page.changeFrequency)}<div class="url-box">https://billyworks.com/sitemap.xml</div></section><section class="card editor-card"><h3>robots.txt</h3>${textarea("robots.txt","robots",state.config.robots,"문법 검사 후 저장됩니다.")}</section></div>`}
function integrations(){const labels={searchConsole:"Google Search Console",ga4:"Google Analytics 4",gtm:"Google Tag Manager",naver:"Naver Search Advisor",clarity:"Microsoft Clarity"};return `${sectionTitle("INTEGRATIONS","외부 서비스 연동")}<div class="integration-grid">${Object.entries(labels).map(([k,l])=>`<article class="integration-card"><span>${l.slice(0,2).toUpperCase()}</span><div><h3>${l}</h3><p>${state.config.integrations[k]?"연결됨":"검색 데이터와 사이트 상태를 연동합니다."}</p></div><button class="button ${state.config.integrations[k]?"button--ghost":"button--dark"}" data-integration="${k}">${state.config.integrations[k]?"해제":"연결"}</button></article>`).join("")}</div>`}

const renderers={overview,pages,global:globalSettings,schema,redirects,sitemap,integrations};
const routeNames={overview:"SEO Overview",pages:"Pages",global:"Global Settings",schema:"Structured Data",redirects:"Redirects",sitemap:"Sitemap & Robots",integrations:"Integrations"};
function render(){document.querySelector("#route-title").textContent=routeNames[state.route]||"SEO";document.querySelector("#route-eyebrow").textContent=`SEO / ${state.route.toUpperCase()}`;document.querySelectorAll("[data-route]").forEach(a=>a.classList.toggle("active",a.dataset.route===state.route));view.innerHTML=(renderers[state.route]||overview)();bindView();}
function bindView(){view.querySelectorAll("[data-route-link]").forEach(b=>b.onclick=()=>go(b.dataset.routeLink));view.querySelectorAll("[data-manual-check]").forEach(b=>b.onclick=()=>{const key=b.dataset.manualCheck;state.config.quality[key]=!state.config.quality[key];markDirty();render()});view.querySelector("[data-edit-page]")?.addEventListener("click",()=>{state.pageTab="basic";render()});view.querySelector("[data-back-pages]")?.addEventListener("click",()=>{state.pageTab="list";render()});view.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.pageTab=b.dataset.tab;render()});view.querySelectorAll("input[name],textarea[name],select[name]").forEach(el=>{el.addEventListener("input",()=>updateConfig(el));el.addEventListener("change",()=>updateConfig(el))});view.querySelectorAll("[data-heading-key]").forEach(el=>el.oninput=()=>{const h=state.headings.find(x=>x.key===el.dataset.headingKey);h.text=el.value;markDirty()});view.querySelector("[data-add-redirect]")?.addEventListener("click",addRedirect);view.querySelectorAll("[data-integration]").forEach(b=>b.onclick=()=>{const k=b.dataset.integration;state.config.integrations[k]=!state.config.integrations[k];markDirty();render()})}
function updateConfig(el){const scope=state.route==="global"?state.config.global:state.route==="schema"||state.pageTab==="page-schema"?state.config.schema:state.config.page;let key=el.name;if(key==="schemaDescription")key="description";let value=el.type==="checkbox"?el.checked:el.type==="number"?Number(el.value):el.value;if(key==="robots")state.config.robots=value;else scope[key]=value;markDirty();if(["title","description","canonical","ogTitle","ogDescription"].includes(key)&&state.pageTab==="basic")render()}
function addRedirect(){const s=view.querySelector('[name="redirectSource"]').value.trim(),d=view.querySelector('[name="redirectDestination"]').value.trim(),t=Number(view.querySelector('[name="redirectType"]').value);if(!s||!d)return showToast("Source와 Destination을 입력하세요.");state.config.redirects.push({source:s,destination:d,type:t,active:true,hits:0});markDirty();render()}
function go(route){state.route=route;location.hash=route;if(route==="pages"&&!state.pageTab)state.pageTab="list";render();view.focus()}
function markDirty(){state.dirty=true;saveState.textContent="Unsaved Changes";saveState.classList.add("dirty")}
function showToast(message){toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2800)}

async function loadHeadings(){try{const r=await fetch("/api/document");if(!r.ok)throw new Error();const d=await r.json();state.headings=d.headings;state.audit=d.audit;state.sourcePath=d.sourcePath;state.localApi=true;document.querySelector("#source-state").textContent="실제 HTML 연결됨";document.querySelector("#preview-link").href=d.previewUrl}catch{document.querySelector("#source-state").textContent="배포 모드 · Supabase 저장";document.querySelector("#preview-link").href="/billywork.html"}state.originalHeadings=new Map(state.headings.map(h=>[h.key,h.text]));render()}
async function loadRemote(){
  if(!state.session)return;
  const {data,error}=await supabase.from("billyworks_seo_settings").select("config,headings,updated_at").eq("id","production").maybeSingle();
  if(error)throw error;
  if(data?.config){state.config={...state.config,...data.config,page:{...state.config.page,...data.config.page},global:{...state.config.global,...data.config.global},schema:{...state.config.schema,...data.config.schema},integrations:{...state.config.integrations,...data.config.integrations},quality:{...state.config.quality,...data.config.quality}};}
  if(Array.isArray(data?.headings)&&data.headings.length)state.headings=data.headings;
  state.remoteLoaded=true;localStorage.setItem(STORAGE_KEY,JSON.stringify(state.config));render();
}
async function saveRemote(){
  if(!state.session)return false;
  const payload={id:"production",config:state.config,headings:state.headings.map(({key,level,tag,text,hidden,id})=>({key,level,tag,text,hidden,id})),updated_by:state.session.user.id};
  const {error}=await supabase.from("billyworks_seo_settings").upsert(payload,{onConflict:"id"});
  if(error)throw error;return true;
}
async function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.config));if(state.localApi){const changed=state.headings.map(({key,text})=>({key,text}));const r=await fetch("/api/headings",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({headings:changed})});if(!r.ok){const e=await r.json();throw new Error(e.error)}}const remoteSaved=await saveRemote();state.dirty=false;saveState.textContent=remoteSaved?"Cloud Saved":"Local Saved";saveState.classList.remove("dirty");showToast(remoteSaved?"Supabase와 Billyworks 설정을 동기화했습니다.":"로컬에 저장했습니다. 클라우드 저장은 로그인 후 가능합니다.")}

function updateAuthUI(){authButton.textContent=state.session?state.session.user.email:"Supabase 로그인";document.querySelector("#source-state").textContent=state.session?"Supabase 동기화 연결됨":state.localApi?"실제 HTML 연결됨":"로그인 필요"}
authButton.onclick=async()=>{if(state.session){if(confirm("Supabase에서 로그아웃할까요?")){await supabase.auth.signOut();}}else authDialog.showModal()};
document.querySelector("#auth-close").onclick=()=>authDialog.close();
authForm.onsubmit=async e=>{e.preventDefault();const email=document.querySelector("#auth-email").value.trim();authMessage.textContent="로그인 링크를 보내는 중입니다…";const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}${location.pathname}`}});authMessage.textContent=error?error.message:"이메일을 확인해 로그인 링크를 열어주세요."};
supabase.auth.onAuthStateChange(async(_event,session)=>{state.session=session;updateAuthUI();if(session&&!state.remoteLoaded){try{await loadRemote();showToast("Supabase 설정을 불러왔습니다.")}catch(e){showToast(`Supabase 연결 오류: ${e.message}`)}}});

document.querySelectorAll("[data-route]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();go(a.dataset.route)}));
document.querySelector("#refresh-button").onclick=()=>loadHeadings();
saveButton.onclick=async()=>{saveButton.disabled=true;try{await save()}catch(e){showToast(e.message)}finally{saveButton.disabled=false}};
addEventListener("hashchange",()=>{state.route=location.hash.slice(1)||"overview";render()});
await loadHeadings();
const {data:{session}}=await supabase.auth.getSession();state.session=session;updateAuthUI();if(session){try{await loadRemote()}catch(e){showToast(`Supabase 연결 오류: ${e.message}`)}}
