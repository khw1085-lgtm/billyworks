type KakaoWindow = Window & { kakao?: { maps: { load: (callback: () => void) => void } } }

const SCRIPT_ID = 'kakao-maps-sdk'

export function loadKakaoMaps(javaScriptKey: string) {
  return new Promise<void>((resolve, reject) => {
    if (!javaScriptKey) return reject(new Error('MISSING_KAKAO_KEY'))
    const kakaoWindow = window as KakaoWindow
    if (kakaoWindow.kakao?.maps) return kakaoWindow.kakao.maps.load(resolve)
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => kakaoWindow.kakao?.maps.load(resolve), { once: true })
      existing.addEventListener('error', () => reject(new Error('KAKAO_SDK_LOAD_FAILED')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(javaScriptKey)}&autoload=false&libraries=clusterer,services`
    script.onload = () => kakaoWindow.kakao?.maps.load(resolve)
    script.onerror = () => reject(new Error('KAKAO_SDK_LOAD_FAILED'))
    document.head.appendChild(script)
  })
}

export function getKakaoMaps() {
  return (window as unknown as { kakao: { maps: any } }).kakao.maps
}
