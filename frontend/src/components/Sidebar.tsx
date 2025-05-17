'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth';
import { useEffect } from 'react';


export default function Sidebar() {
  const { user, logout, isClient } = useAuth()
  const currentPath = usePathname();
  if (!isClient) return null;
  const noAuthMenu = [{ name: 'Login', href: '/login/' }]
  const mainMenu = [{ name: 'Home', href: '/' }, { name: 'Users', href: '/users/' }, { name: 'Parking', href: '/parking/' }]

  const navItems: Record<string, { name: string; href: string }[]> = user ? {
      '' : [{ name: 'Users', href: '/users/' }, { name: 'Parking', href: '/parking/' }],
      'users' : [{ name: 'Home', href: '/' }, { name: 'Parking', href: '/parking/' }, { name: 'Add User', href: '/users/add' }, { name: 'Update User', href: '/users/update' }, { name: 'Delete User', href: '/users/delete' }],
      'parking' : [{ name: 'Home', href: '/' }, { name: 'Users', href: '/users/' }],
  } : {
      '' : [{ name: 'Login', href: '/login/' }],
      'login': [{ name: 'Home', href: '/' }]
  }
  const items = user ? mainMenu : noAuthMenu

  return (
    <aside className="flex flex-col bg-white p-4 shadow-lg w-1/10 min-w-48 border-r-1 border-black">
      <nav className="space-y-2 w-48">
        {items.map( item => (
        <div key={item.name}>
          <Link 
            href={item.href} 
            className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer">
            {item.name}
          </Link>
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
