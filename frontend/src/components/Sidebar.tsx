'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth';
import { useEffect, useState } from 'react';

interface MenuItem {
  name: string,
  href: string
}

export default function Sidebar() {
  const mainMenu = [{ name: 'Home', href: '/' }, { name: 'Users', href: '/users/' }, { name: 'Parking', href: '/parking/' }]
  const subMenus: Record<string, MenuItem[]> = {
    'users' : [{ name: 'Add User', href: '/users/add/' }, { name: 'Update User', href: '/users/update/' }, { name: 'Delete User', href: '/users/delete/' }],
    'parking': [{ name: 'Lots', href: '/parking/lots/' }, { name: 'Permit', href: '/parking/permit/' }, { name: 'Checkout', href: '/parking/checkout/' }]
  }
  const basePath = usePathname().split('/')[1]
  const { user, logout } = useAuth()
  const [menu, setMenu]  = useState<MenuItem[]>([])
  const [subMenu, setSubMenu]  = useState<MenuItem[]>([])
  useEffect(() => {
    if (user) {
      setMenu(mainMenu)
      setSubMenu(subMenus[basePath])
    } else {
      setMenu( basePath == 'login' ? [{ name: 'Home', href: '/' }] : [{ name: 'Login', href: '/login/' }])
    }
  }, [user, basePath])

  return (
    <aside className="flex flex-col bg-white p-4 shadow-lg w-1/10 min-w-48 border-r-[1px] border-black">
      <nav className="space-y-2 w-48">
        {menu.map( item => (
        <div key={item.name}>
          <Link 
            href={item.href} 
            className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer">
            {item.name}
          </Link>
          {item.href == `/${basePath}/` && subMenu && subMenu.map( subitem => (
          <div key={subitem.name}>
            <Link 
              href={subitem.href} 
              className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer ml-4">
              {subitem.name}
            </Link>
          </div>
          ))}
        </div>
        ))}
      </nav>
      <div className={`mt-auto ${user ? '' : 'hidden'}`}>
        <div className="flex flex-col text-black">
        {user ? `${user.firstName} ${user.lastName}` : ''}
        <span 
          onClick={logout}
          className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer">
          Logout
        </span>
        </div>
      </div>
    </aside>
  );
}
