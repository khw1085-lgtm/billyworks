import { readFile } from 'node:fs/promises'

let cache

async function getApartments() {
  if (!cache) {
    const file = new URL('../public/data/apartments.json', import.meta.url)
    cache = JSON.parse(await readFile(file, 'utf8'))
  }
  return cache
}

function numberParam(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export default async function handler(request, response) {
  const { south, west, north, east, limit } = request.query
  const bounds = {
    south: numberParam(south, 33),
    west: numberParam(west, 124),
    north: numberParam(north, 39),
    east: numberParam(east, 132),
  }
  const max = Math.min(numberParam(limit, 25000), 25000)
  const all = await getApartments()
  const matches = all.filter((item) => item.latitude >= bounds.south && item.latitude <= bounds.north && item.longitude >= bounds.west && item.longitude <= bounds.east)

  response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
  response.status(200).json({ apartments: matches.slice(0, max), total: matches.length, truncated: matches.length > max })
}
