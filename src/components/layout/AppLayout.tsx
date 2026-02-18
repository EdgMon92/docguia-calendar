import { ReactNode, useState } from 'react'
import { Home, Calendar, Users, CreditCard, Bell, Gift, Building2, DollarSign, FileText } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Header } from './Header'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300',
          isMobile && !sidebarOpen && '-translate-x-full absolute inset-y-0 left-0 z-40',
          isMobile && sidebarOpen && 'absolute inset-y-0 left-0 z-40'
        )}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <span className="ml-2 text-lg font-semibold text-gray-900">Docguía</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavItem icon={Home} label="Inicio" />
          <NavItem icon={Calendar} label="Calendario" active />
          <NavItem icon={Users} label="Pacientes" />
          <NavItem icon={CreditCard} label="Cobros" />

          <NavSection title="GESTIÓN" className="mt-6">
            <NavItem icon={Bell} label="Recordatorios" />
            <NavItem icon={Gift} label="Referidos" />
          </NavSection>

          <NavSection title="CONFIGURACIÓN" className="mt-6">
            <NavItem icon={Building2} label="Consultorios" />
            <NavItem icon={DollarSign} label="Servicios" />
            <NavItem icon={FileText} label="Plantillas" />
          </NavSection>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
              C
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. Carlos Parra</p>
              <p className="text-xs text-gray-500">Cuenta Demo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isMobile && <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay para cerrar sidebar en mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium',
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  )
}

interface NavSectionProps {
  title: string
  children: ReactNode
  className?: string
}

function NavSection({ title, children, className }: NavSectionProps) {
  return (
    <div className={className}>
      <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}