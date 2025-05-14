'use client';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth';
import { useEffect } from 'react';


export default function Sidebar() {
  const { username, logout, isClient } = useAuth()
  const currentPath = usePathname();
  if (!isClient) return null;

  const navItems: Record<string, { name: string; href: string }[]> = username ? {
      '' : [{ name: 'Users', href: '/users/' }],
      'users' : [{ name: 'Home', href: '/' }, { name: 'Add User', href: '/users/add' }, { name: 'Update User', href: '/users/update' }, { name: 'Delete User', href: '/users/delete' }],
  } : {
      '' : [{ name: 'Login', href: '/login/' }],
      'login': [{ name: 'Home', href: '/' }]
  }
  const items = navItems[currentPath.split('/')[1]] ?? [];

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
      <div className={`mt-auto ${username ? '' : 'hidden'}`}>
        <div className="flex flex-col text-black">
        {username ? `User: ${username}` : ''}
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
