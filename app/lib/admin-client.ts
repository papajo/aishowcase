export function getAuthHeaders(): Record<string, string> {
  const auth = sessionStorage.getItem("admin_auth")
  if (auth) {
    return { Authorization: `Basic ${auth}` }
  }
  return {}
}

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
    },
  })
}
