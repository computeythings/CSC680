import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
      setIsLoading(false)
  }, [user, router])
  if (isLoading) {
    return null
  }
  localStorage.removeItem("redirect")
  return (
    <div className="flex flex-grow items-center justify-center">
        <h2 className="text-black bg-white p-12 text-5xl font-bold max-w-100 text-center border shadow-lg">
        { user ? `Welcome, ${user.firstName}` : 'EMPLOYEE PORTAL'}
        </h2>
    </div>
  );
}
