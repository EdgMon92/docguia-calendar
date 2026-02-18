import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white px-4 flex items-center lg:hidden">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="ml-4 flex items-center">
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
        <span className="ml-2 text-lg font-semibold text-gray-900">Docguía</span>
      </div>
    </header>
  )
}