import { api } from './client'
import type { Cliente, ClienteSave } from '../types'

export const clientesApi = {
  getAll: () => api.get<Cliente[]>('/clientes'),
  create: (data: ClienteSave) => api.post<Cliente>('/clientes', data),
  update: (id: number, data: ClienteSave) => api.put<Cliente>(`/clientes/${id}`, data),
  remove: (id: number) => api.del<string>(`/clientes/${id}`),
}
