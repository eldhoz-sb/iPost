import { Link } from 'react-router-dom'

export default function Sidebar() {
  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Composer', path: '/composer' },
    { name: 'History', path: '/history' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' }

  ]

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">iPost</h1>
      <nav className="flex flex-col space-y-4">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="hover:bg-gray-800 p-2 rounded transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
