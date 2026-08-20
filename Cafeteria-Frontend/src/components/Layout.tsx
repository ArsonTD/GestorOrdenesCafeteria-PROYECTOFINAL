import { NavLink, Outlet } from 'react-router-dom'

function linkClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-amber-600 text-white'
      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
  }`
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-3">
          <NavLink to="/ordenes" className={linkClass}>
            Órdenes
          </NavLink>
          <NavLink to="/productos" className={linkClass}>
            Productos
          </NavLink>
          <NavLink to="/clientes" className={linkClass}>
            Clientes
          </NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-4">
          <span className="text-xl">☕</span>
          <span className="text-lg font-bold tracking-tight">Gestor de Órdenes Cafetería</span>
        </div>
      </footer>
    </div>
  )
}
