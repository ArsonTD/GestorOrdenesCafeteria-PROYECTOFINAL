import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { productosApi } from '../api/productos'
import type { Producto } from '../types'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { ConfirmDialog } from '../components/ConfirmDialog'

const currency = new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' })

export function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [disponible, setDisponible] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [toDelete, setToDelete] = useState<Producto | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setItems(await productosApi.getAll())
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al cargar' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setNombre('')
    setPrecio('')
    setDisponible(true)
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(p: Producto) {
    setEditing(p)
    setNombre(p.nombre)
    setPrecio(String(p.precio))
    setDisponible(p.disponible)
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nombreVal = nombre.trim()
    const precioVal = Number(precio)
    if (nombreVal.length < 2 || nombreVal.length > 100) {
      setFormError('El nombre debe tener entre 2 y 100 caracteres.')
      return
    }
    if (!precio || Number.isNaN(precioVal) || precioVal <= 0) {
      setFormError('El precio debe ser un número mayor que 0.')
      return
    }
    setSaving(true)
    setFormError(null)
    const payload = { nombre: nombreVal, precio: precioVal, disponible }
    try {
      if (editing) {
        await productosApi.update(editing.id, payload)
        setAlert({ type: 'success', message: 'Producto actualizado.' })
      } else {
        await productosApi.create(payload)
        setAlert({ type: 'success', message: 'Producto creado.' })
      }
      setModalOpen(false)
      await load()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await productosApi.remove(toDelete.id)
      setAlert({ type: 'success', message: 'Producto eliminado.' })
      setToDelete(null)
      await load()
    } catch (e) {
      setAlert({ type: 'error', message: e instanceof Error ? e.message : 'Error al eliminar' })
      setToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-sm text-stone-500">
            {loading ? 'Cargando…' : `${items.length} producto${items.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-stone-500">No hay productos registrados.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="w-16 px-5 py-3">#</th>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Disponible</th>
                <th className="px-5 py-3 text-right">Precio</th>
                <th className="w-40 px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3 text-stone-400">{p.id}</td>
                  <td className="px-5 py-3 font-medium text-stone-800">{p.nombre}</td>
                  <td className="px-5 py-3">
                    {p.disponible ? (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Sí
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-stone-700">
                    {currency.format(p.precio)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-2 rounded-md px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setToDelete(p)}
                      className="rounded-md px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
              placeholder="Ej. Café Latte"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Precio</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              checked={disponible}
              onChange={(e) => setDisponible(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            Disponible para la venta
          </label>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar producto"
        message={`¿Eliminar el producto "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
