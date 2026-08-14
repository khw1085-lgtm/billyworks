export function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function apartmentPath(id: string) {
  return `/apartments/${id}`
}
