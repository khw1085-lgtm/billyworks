import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const DATA_API = 'https://apis.data.go.kr/1613000/AptListService3/getTotalAptList3'
const KAKAO_GEOCODE_API = 'https://dapi.kakao.com/v2/local/search/address.json'
const KAKAO_KEYWORD_API = 'https://dapi.kakao.com/v2/local/search/keyword.json'
const outputFile = resolve('public/data/apartments.json')
const tempFile = `${outputFile}.next`
const cacheFile = resolve('.cache/geocodes.json')
const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY
const kakaoKey = process.env.KAKAO_REST_API_KEY
const rowLimit = Number(process.argv.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || 0)
const inspectOnly = process.argv.includes('--inspect')
const concurrency = Math.min(Number(process.env.IMPORT_CONCURRENCY || 12), 16)

if (!serviceKey) throw new Error('DATA_GO_KR_SERVICE_KEY가 필요합니다.')
if (!kakaoKey) throw new Error('KAKAO_REST_API_KEY가 필요합니다.')

const wait = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms))
const first = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim())

function responseBody(payload) {
  return payload?.response?.body ?? payload?.body ?? payload
}

function responseItems(payload) {
  const body = responseBody(payload)
  const items = body?.items?.item ?? body?.items ?? body?.item ?? []
  return Array.isArray(items) ? items : items ? [items] : []
}

async function fetchPage(pageNo, numOfRows = 1000) {
  const url = new URL(DATA_API)
  url.searchParams.set('serviceKey', serviceKey)
  url.searchParams.set('pageNo', String(pageNo))
  url.searchParams.set('numOfRows', String(numOfRows))
  url.searchParams.set('_type', 'json')
  const response = await fetch(url)
  if (!response.ok) throw new Error(`공공데이터 API 오류: ${response.status}`)
  const payload = await response.json()
  if (inspectOnly) {
    const body = responseBody(payload)
    console.log(JSON.stringify({
      payloadType: Array.isArray(payload) ? 'array' : typeof payload,
      payloadKeys: payload && !Array.isArray(payload) ? Object.keys(payload) : [],
      bodyType: Array.isArray(body) ? 'array' : typeof body,
      bodyKeys: body && !Array.isArray(body) ? Object.keys(body) : [],
      itemsType: Array.isArray(body?.items) ? 'array' : typeof body?.items,
      itemsKeys: body?.items && !Array.isArray(body.items) ? Object.keys(body.items) : [],
      firstItemKeys: Object.keys(responseItems(payload)[0] || {}),
      sampleItems: responseItems(payload).slice(0, 3),
      itemCount: responseItems(payload).length,
      totalCount: body?.totalCount,
    }, null, 2))
    process.exit(0)
  }
  const header = payload?.response?.header ?? payload?.header
  if (header?.resultCode && header.resultCode !== '00') throw new Error(`${header.resultCode}: ${header.resultMsg}`)
  return { items: responseItems(payload), totalCount: Number(responseBody(payload)?.totalCount || 0) }
}

async function fetchAll() {
  const firstPage = await fetchPage(1)
  const target = rowLimit ? Math.min(rowLimit, firstPage.totalCount || rowLimit) : firstPage.totalCount
  const result = firstPage.items.slice(0, target || undefined)
  const pages = Math.ceil((target || firstPage.totalCount || result.length) / 1000)
  for (let page = 2; page <= pages && (!rowLimit || result.length < rowLimit); page += 1) {
    const next = await fetchPage(page)
    result.push(...next.items)
    console.log(`단지 목록 ${Math.min(result.length, target || result.length).toLocaleString()}개 수집`)
    await wait(80)
  }
  return rowLimit ? result.slice(0, rowLimit) : result
}

function normalizeSource(item) {
  const id = String(first(item.kaptCode, item.kaptcode, item.aptCode, item.id) || '').trim()
  const name = String(first(item.kaptName, item.kaptname, item.aptName, item.name) || '').trim()
  const regionParts = [item.as1, item.as2, item.as3, item.as4].filter(Boolean)
  const region = String(first(item.region, item.bjdName, item.legaldongName, regionParts.join(' ')) || '').trim()
  const address = String(first(item.doroJuso, item.roadAddress, item.roadNameAddress, item.address, item.kaptAddr, region) || '').trim()
  return { id, name, region, address }
}

async function loadCache() {
  try { return JSON.parse(await readFile(cacheFile, 'utf8')) } catch { return {} }
}

async function geocode(query) {
  async function search(endpoint) {
    const url = new URL(endpoint)
    url.searchParams.set('query', query)
    const response = await fetch(url, { headers: { Authorization: `KakaoAK ${kakaoKey}` } })
    if (!response.ok) throw new Error(`카카오 지오코딩 오류: ${response.status}`)
    return (await response.json()).documents?.[0] || null
  }
  const match = await search(KAKAO_GEOCODE_API) || await search(KAKAO_KEYWORD_API)
  if (!match) return null
  return {
    latitude: Number(match.y),
    longitude: Number(match.x),
    address: match.road_address?.address_name || match.road_address_name || match.address?.address_name || match.address_name || query,
    region: [match.address?.region_1depth_name, match.address?.region_2depth_name].filter(Boolean).join(' ') || query.split(' ').slice(0, 2).join(' '),
  }
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length)
  let cursor = 0
  async function run() {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index])
      await wait(60)
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run))
  return results
}

const sources = (await fetchAll()).map(normalizeSource).filter((item) => item.id && item.name)
const deduped = [...new Map(sources.map((item) => [item.id, item])).values()]
const geocodeCache = await loadCache()
let completed = 0

const apartments = (await mapConcurrent(deduped, concurrency, async (item) => {
  const query = item.address && item.address !== item.region ? item.address : `${item.region} ${item.name}`.trim()
  let location = geocodeCache[query]
  if (location == null) {
    location = await geocode(query)
    geocodeCache[query] = location
  }
  completed += 1
  if (completed % 100 === 0) {
    await mkdir(dirname(cacheFile), { recursive: true })
    await writeFile(cacheFile, JSON.stringify(geocodeCache))
    console.log(`좌표 변환 ${completed.toLocaleString()} / ${deduped.length.toLocaleString()}`)
  }
  if (!location) return null
  return {
    id: item.id,
    name: item.name,
    address: location.address || item.address,
    region: location.region || item.region,
    latitude: location.latitude,
    longitude: location.longitude,
    x: 50,
    y: 50,
    householdCount: 0,
    postCount: 0,
    topics: [],
    source: 'k-apt',
  }
})).filter(Boolean)

await mkdir(dirname(cacheFile), { recursive: true })
await writeFile(cacheFile, JSON.stringify(geocodeCache))
await writeFile(tempFile, `${JSON.stringify(apartments)}\n`)
await rename(tempFile, outputFile)
console.log(`완료: 좌표가 확인된 전국 단지 ${apartments.length.toLocaleString()}개를 ${outputFile}에 저장했습니다.`)
