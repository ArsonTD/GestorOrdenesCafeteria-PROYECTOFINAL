import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ordenesApi } from '../api/ordenes'
import { clientesApi } from '../api/clientes'
import { productosApi } from '../api/productos'
import type { Cliente, Orden, Producto } from '../types'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { ConfirmDialog } from '../components/ConfirmDialog'

const currency = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' })
const METODOS = ['Efectivo', 'Tarjeta', 'Transferencia']

function fmtFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' })
}

function estadoBadge(estado: string) {
  if (estado === 'Pagada') return 'bg-green-100 text-green-800'
  if (estado === 'Cancelada') return 'bg-stone-200 text-stone-600'
  return 'bg-amber-100 text-amber-800'
}

interface Linea {
  productoId: string
  cantidad: string
}

export function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [clienteId, setClienteId] = useState('')
  const [lineas, setLineas] = useState<Linea[]>([{ productoId: '', cantidad: '1' }])
  const [createError, setCreateError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const [detalle, setDetalle] = useState<Orden | null>(null)

  const [pagarOrden, setPagarOrden] = useState<Orden | null>(null)
  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [paying, setPaying] = useState(false)

  const [cancelarOrden, setCancelarOrden] = useState<Orden | null>(null)
  const [canceling, setCanceling] = useState(false)

  const [eliminarOrden, setEliminarOrden] = useState<Orden | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [ords, cls, prods] = await Promise.all([
        ordenesApi.getAll(),
        clientesApi.getAll(),
        productosApi.getAll(),
      ])
      setOrdenes(ords)
      setClientes(cls)
      setProductos(prods)
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al cargar' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const productosDisponibles = productos.filter((p) => p.disponible)
  const puedeCrear = clientes.length > 0 && productosDisponibles.length > 0

  function openCreate() {
    setClienteId(clientes[0] ? String(clientes[0].id) : '')
    setLineas([{ productoId: '', cantidad: '1' }])
    setCreateError(null)
    setCreateOpen(true)
  }

  function updateLinea(idx: number, field: keyof Linea, value: string) {
    setLineas((prev) => prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l)))
  }

  function addLinea() {
    setLineas((prev) => [...prev, { productoId: '', cantidad: '1' }])
  }

  function removeLinea(idx: number) {
    setLineas((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)))
  }

  const totalCreate = lineas.reduce((sum, l) => {
    const prod = productos.find((p) => p.id === Number(l.productoId))
    const cant = Number(l.cantidad)
    if (!prod || Number.isNaN(cant) || cant < 1) return sum
    return sum + prod.precio * cant
  }, 0)

  async function handleCrear(e: FormEvent) {
    e.preventDefault()
    const clienteVal = Number(clienteId)
    if (!clienteId || Number.isNaN(clienteVal)) {
      setCreateError('Selecciona un cliente.')
      return
    }
    const detalles = lineas
      .filter((l) => l.productoId && Number(l.cantidad) >= 1)
      .map((l) => ({ productoId: Number(l.productoId), cantidad: Number(l.cantidad) }))
    if (detalles.length === 0) {
      setCreateError('Agrega al menos un producto con cantidad válida.')
      return
    }

    setCreating(true)
    setCreateError(null)
    try {
      await ordenesApi.crear({ clienteId: clienteVal, detalles })
      setAlert({ type: 'success', message: 'Orden creada.' })
      setCreateOpen(false)
      await load()
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : 'Error al crear la orden')
    } finally {
      setCreating(false)
    }
  }

  async function handlePagar(e: FormEvent) {
    e.preventDefault()
    if (!pagarOrden) return
    setPaying(true)
    try {
      await ordenesApi.pagar(pagarOrden.id, metodoPago)
      setAlert({ type: 'success', message: 'Orden pagada.' })
      setPagarOrden(null)
      await load()
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al pagar' })
      setPagarOrden(null)
    } finally {
      setPaying(false)
    }
  }

  async function handleCancelar() {
    if (!cancelarOrden) return
    setCanceling(true)
    try {
      await ordenesApi.cancelar(cancelarOrden.id)
      setAlert({ type: 'success', message: 'Orden cancelada.' })
      setCancelarOrden(null)
      await load()
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al cancelar' })
      setCancelarOrden(null)
    } finally {
      setCanceling(false)
    }
  }

  async function handleEliminar() {
    if (!eliminarOrden) return
    setDeleting(true)
    try {
      await ordenesApi.remove(eliminarOrden.id)
      setAlert({ type: 'success', message: 'Orden eliminada.' })
      setEliminarOrden(null)
      await load()
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al eliminar' })
      setEliminarOrden(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-sm text-stone-500">
            {loading ? 'Cargando…' : `${ordenes.length} orden${ordenes.length === 1 ? '' : 'es'}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          disabled={!puedeCrear}
          title={!puedeCrear ? 'Necesitas al menos un cliente y un producto disponible' : undefined}
          className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Nueva orden
        </button>
      </div>

      {!puedeCrear && !loading && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Para crear órdenes necesitas al menos un <strong>cliente</strong> y un{' '}
          <strong>producto disponible</strong>.
        </p>
      )}

      {loading ? (
        <Spinner />
      ) : ordenes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
          <p className="text-4xl">🧾</p>
          <p className="mt-2 text-sm text-stone-500">Aún no hay órdenes registradas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ordenes.map((o) => (
            <div key={o.id} className="flex flex-col rounded-xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
                <span className="font-semibold text-stone-800">Orden #{o.id}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoBadge(o.estado)}`}>
                  {o.estado}
                </span>
              </div>
              <div className="flex-1 space-y-1 px-4 py-3 text-sm">
                <p className="text-stone-700">
                  <span className="text-stone-400">Cliente:</span> {o.clienteNombre}
                </p>
                <p className="text-stone-500">{fmtFecha(o.fecha)}</p>
                <p className="text-stone-500">
                  {o.detalles.length} producto{o.detalles.length === 1 ? '' : 's'}
                  {o.metodoPago ? ` · ${o.metodoPago}` : ''}
                </p>
                <p className="pt-1 text-lg font-bold tabular-nums text-amber-700">
                  {currency.format(o.total)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-stone-100 px-4 py-3">
                <button
                  onClick={() => setDetalle(o)}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-stone-600 transition hover:bg-stone-100"
                >
                  Ver detalle
                </button>
                {o.estado === 'Pendiente' && (
                  <>
                    <button
                      onClick={() => {
                        setMetodoPago('Efectivo')
                        setPagarOrden(o)
                      }}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-green-700 transition hover:bg-green-50"
                    >
                      Pagar
                    </button>
                    <button
                      onClick={() => setCancelarOrden(o)}
                      className="rounded-md px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                <button
                  onClick={() => setEliminarOrden(o)}
                  className="ml-auto rounded-md px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={createOpen} title="Nueva orden" onClose={() => setCreateOpen(false)} wide>
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              <option value="" disabled>
                Selecciona un cliente
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Productos</label>
            <div className="space-y-2">
              {lineas.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={l.productoId}
                    onChange={(e) => updateLinea(idx, 'productoId', e.target.value)}
                    className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="">Producto…</option>
                    {productosDisponibles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({currency.format(p.precio)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={l.cantidad}
                    onChange={(e) => updateLinea(idx, 'cantidad', e.target.value)}
                    className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeLinea(idx)}
                    disabled={lineas.length === 1}
                    className="rounded-md px-2 py-1 text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    aria-label="Quitar"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLinea}
              className="mt-2 text-sm font-medium text-amber-700 hover:underline"
            >
              + Agregar producto
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-stone-200 pt-3">
            <span className="text-sm font-medium text-stone-500">Total</span>
            <span className="text-xl font-bold tabular-nums text-amber-700">
              {currency.format(totalCreate)}
            </span>
          </div>

          {createError && <p className="text-sm text-red-600">{createError}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {creating ? 'Creando…' : 'Crear orden'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={detalle !== null} title={`Orden #${detalle?.id ?? ''}`} onClose={() => setDetalle(null)}>
        {detalle && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">Cliente</span>
              <span className="font-medium text-stone-800">{detalle.clienteNombre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Estado</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoBadge(detalle.estado)}`}>
                {detalle.estado}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Fecha</span>
              <span className="text-stone-700">{fmtFecha(detalle.fecha)}</span>
            </div>
            {detalle.metodoPago && (
              <div className="flex justify-between">
                <span className="text-stone-400">Pago</span>
                <span className="text-stone-700">{detalle.metodoPago}</span>
              </div>
            )}
            <table className="w-full border-t border-stone-100 pt-2 text-left">
              <thead className="text-xs uppercase text-stone-400">
                <tr>
                  <th className="py-2">Producto</th>
                  <th className="py-2 text-center">Cant.</th>
                  <th className="py-2 text-right">P. Unit.</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {detalle.detalles.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2 text-stone-800">{d.productoNombre}</td>
                    <td className="py-2 text-center tabular-nums">{d.cantidad}</td>
                    <td className="py-2 text-right tabular-nums">{currency.format(d.precioUnitario)}</td>
                    <td className="py-2 text-right tabular-nums">{currency.format(d.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-stone-200 pt-3">
              <span className="font-medium text-stone-500">Total</span>
              <span className="text-lg font-bold tabular-nums text-amber-700">
                {currency.format(detalle.total)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={pagarOrden !== null}
        title={`Pagar orden #${pagarOrden?.id ?? ''}`}
        onClose={() => setPagarOrden(null)}
      >
        <form onSubmit={handlePagar} className="space-y-4">
          <p className="text-sm text-stone-600">
            Total a pagar:{' '}
            <span className="font-bold text-amber-700">
              {pagarOrden ? currency.format(pagarOrden.total) : ''}
            </span>
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            >
              {METODOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPagarOrden(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={paying}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {paying ? 'Procesando…' : 'Confirmar pago'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={cancelarOrden !== null}
        title="Cancelar orden"
        message={`¿Cancelar la orden #${cancelarOrden?.id}? Quedará marcada como Cancelada.`}
        loading={canceling}
        confirmLabel="Cancelar orden"
        onConfirm={handleCancelar}
        onCancel={() => setCancelarOrden(null)}
      />

      <ConfirmDialog
        open={eliminarOrden !== null}
        title="Eliminar orden"
        message={`¿Eliminar la orden #${eliminarOrden?.id}? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleEliminar}
        onCancel={() => setEliminarOrden(null)}
      />
    </div>
  )
}
