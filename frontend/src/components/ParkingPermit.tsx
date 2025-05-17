import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function ParkingPermit() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
      setIsLoading(false)
  }, [user, router])
  if (isLoading) {
    return null
  }
  if (!user) {
    localStorage.setItem("redirect", "/parking/permit/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")

  return (
    <div className="w-full content-center ">
        <div className="flex flex-grow items-center justify-center">
            <h2 className="text-black bg-white text-5xl font-bold w-1/3 text-center border shadow-lg py-4">PARKING PERMITS</h2>
        </div>
        <img src={'/images/parkingimg.jpg'} className="m-auto"/>
    </div>
  );
}
