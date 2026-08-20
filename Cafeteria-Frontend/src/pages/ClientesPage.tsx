import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { clientesApi } from '../api/clientes'
import type { Cliente } from '../types'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { Alert } from '../components/Alert'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function ClientesPage() {
  const [items, setItems] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [toDelete, setToDelete] = useState<Cliente | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      setItems(await clientesApi.getAll())
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
    setTelefono('')
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(c: Cliente) {
    setEditing(c)
    setNombre(c.nombre)
    setTelefono(c.telefono ?? '')
    setFormError(null)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = nombre.trim()
    if (value.length < 2 || value.length > 120) {
      setFormError('El nombre debe tener entre 2 y 120 caracteres.')
      return
    }
    setSaving(true)
    setFormError(null)
    const payload = { nombre: value, telefono: telefono.trim() || null }
    try {
      if (editing) {
        await clientesApi.update(editing.id, payload)
        setAlert({ type: 'success', message: 'Cliente actualizado.' })
      } else {
        await clientesApi.create(payload)
        setAlert({ type: 'success', message: 'Cliente creado.' })
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
      await clientesApi.remove(toDelete.id)
      setAlert({ type: 'success', message: 'Cliente eliminado.' })
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
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-stone-500">
            {loading ? 'Cargando…' : `${items.length} cliente${items.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-stone-500">No hay clientes registrados.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="w-16 px-5 py-3">#</th>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="w-40 px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-5 py-3 text-stone-400">{c.id}</td>
                  <td className="px-5 py-3 font-medium text-stone-800">{c.nombre}</td>
                  <td className="px-5 py-3 text-stone-600">{c.telefono || '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openEdit(c)}
                      className="mr-2 rounded-md px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setToDelete(c)}
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
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
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
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Opcional"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
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
        title="Eliminar cliente"
        message={`¿Eliminar al cliente "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
