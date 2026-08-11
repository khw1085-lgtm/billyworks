import type { Apartment, MapBounds } from '../types'

type ApartmentResponse = {
  apartments: Apartment[]
  total: number
  truncated?: boolean
}

const MAX_VISIBLE_APARTMENTS = 25000

export async function fetchApartmentsInBounds(bounds: MapBounds, signal?: AbortSignal) {
  const params = new URLSearchParams({
    south: String(bounds.south),
    west: String(bounds.west),
    north: String(bounds.north),
    east: String(bounds.east),
    limit: String(MAX_VISIBLE_APARTMENTS),
  })
  const response = await fetch(`/api/apartments?${params}`, { signal })
  if (!response.ok) throw new Error(`APARTMENT_API_${response.status}`)
  return response.json() as Promise<ApartmentResponse>
}
