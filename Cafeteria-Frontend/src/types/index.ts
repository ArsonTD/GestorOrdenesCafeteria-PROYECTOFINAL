export interface Producto {
  id: number
  nombre: string
  precio: number
  disponible: boolean
}

export interface ProductoSave {
  nombre: string
  precio: number
  disponible: boolean
}

export interface Cliente {
  id: number
  nombre: string
  telefono?: string | null
}

export interface ClienteSave {
  nombre: string
  telefono?: string | null
}

export interface DetalleOrden {
  id: number
  productoId: number
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Orden {
  id: number
  clienteId: number
  clienteNombre: string
  fecha: string
  estado: string
  metodoPago?: string | null
  fechaPago?: string | null
  total: number
  detalles: DetalleOrden[]
}

export interface CrearOrdenItem {
  productoId: number
  cantidad: number
}

export interface CrearOrden {
  clienteId: number
  detalles: CrearOrdenItem[]
}
