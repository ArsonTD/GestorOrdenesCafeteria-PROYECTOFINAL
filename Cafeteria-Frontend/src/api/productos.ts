import { api } from './client'
import type { Producto, ProductoSave } from '../types'

export const productosApi = {
  getAll: () => api.get<Producto[]>('/productos'),
  create: (data: ProductoSave) => api.post<Producto>('/productos', data),
  update: (id: number, data: ProductoSave) => api.put<Producto>(`/productos/${id}`, data),
  remove: (id: number) => api.del<string>(`/productos/${id}`),
}
