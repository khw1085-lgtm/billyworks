import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dataFile = fileURLToPath(new URL('./public/data/apartments.json', import.meta.url))

function apartmentApi() {
  return {
    name: 'local-apartment-api',
    configureServer(server: { middlewares: { use: (path: string, handler: (request: { url?: string }, response: { setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use('/api/apartments', async (request, response, next) => {
        try {
          const url = new URL(request.url || '/', 'http://localhost')
          const number = (name: string, fallback: number) => Number(url.searchParams.get(name)) || fallback
          const bounds = { south: number('south', 33), west: number('west', 124), north: number('north', 39), east: number('east', 132) }
          const limit = Math.min(number('limit', 25000), 25000)
          const all = JSON.parse(await readFile(dataFile, 'utf8')) as Array<{ latitude: number; longitude: number }>
          const matches = all.filter((item) => item.latitude >= bounds.south && item.latitude <= bounds.north && item.longitude >= bounds.west && item.longitude <= bounds.east)
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ apartments: matches.slice(0, limit), total: matches.length, truncated: matches.length > limit }))
        } catch { next() }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apartmentApi()],
  server: { host: '127.0.0.1' },
})
