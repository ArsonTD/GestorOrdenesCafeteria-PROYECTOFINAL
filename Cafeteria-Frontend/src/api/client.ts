const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5288/api'

export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string[]>

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function buildError(res: Response): Promise<ApiError> {
  const text = await res.text()
  if (!text) return new ApiError(`Error ${res.status}`, res.status)

  try {
    const data = JSON.parse(text)
    if (data && typeof data === 'object' && data.errors) {
      const fieldErrors = data.errors as Record<string, string[]>
      const first = Object.values(fieldErrors).flat()[0]
      return new ApiError(first ?? data.title ?? 'Error de validación', res.status, fieldErrors)
    }
    if (typeof data === 'string') return new ApiError(data, res.status)
    return new ApiError(data.title ?? data.message ?? `Error ${res.status}`, res.status)
  } catch {
    return new ApiError(text, res.status)
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError('No se pudo conectar con la API. ¿Está el backend en ejecución?', 0)
  }

  if (!res.ok) throw await buildError(res)

  const text = await res.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
