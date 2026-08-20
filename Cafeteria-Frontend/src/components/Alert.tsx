import { useEffect } from 'react'

interface AlertProps {
  type: 'error' | 'success'
  message: string
  onClose: () => void
}

export function Alert({ type, message, onClose }: AlertProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-800 border-red-200'
      : 'bg-green-50 text-green-800 border-green-200'

  return (
    <div
      className={`fixed right-4 top-4 z-60 flex max-w-sm items-start gap-3 rounded-lg border px-4 py-3 ${styles}`}
      role="alert"
    >
      <span className="text-sm">{message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="ml-auto text-current/60 transition hover:text-current"
      >
        &times;
      </button>
    </div>
  )
}
