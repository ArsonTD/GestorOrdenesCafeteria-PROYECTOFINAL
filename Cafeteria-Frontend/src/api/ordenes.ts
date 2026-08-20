import { api } from './client'
import type { CrearOrden, Orden } from '../types'

export const ordenesApi = {
  getAll: () => api.get<Orden[]>('/ordenes'),
  getById: (id: number) => api.get<Orden>(`/ordenes/${id}`),
  crear: (data: CrearOrden) => api.post<Orden>('/ordenes', data),
  pagar: (id: number, metodoPago: string) =>
    api.post<Orden>(`/ordenes/${id}/pagar`, { metodoPago }),
  cancelar: (id: number) => api.post<Orden>(`/ordenes/${id}/cancelar`),
  remove: (id: number) => api.del<string>(`/ordenes/${id}`),
}
