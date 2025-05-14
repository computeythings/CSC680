import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function Users() {
  const { username } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
      setIsLoading(false)
  }, [username, router])
  if (isLoading) {
    return null
  }
  if (!username) {
    localStorage.setItem("redirect", "/users/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")

  return (
    <div className="w-full content-center ">
        <div className="flex flex-grow items-center justify-center">
            <h2 className="text-black bg-white text-5xl font-bold w-1/3 text-center border shadow-lg py-4">USER MANAGEMENT</h2>
        </div>
        <img src={'/images/userimg.jpg'} className="m-auto"/>
    </div>
  );
}
