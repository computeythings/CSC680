import ValetParking from "@/components/ValetParking";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ValetParkingPage() {
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
    localStorage.setItem("redirect", "/valet/parking/")
    router.push('/login/')
    return null
  }
  // Redirect unauthorized roles
  if (!["admin","valet"].includes(user.role)) {
    return router.push('/')
  }
  localStorage.removeItem("redirect")
  return (
    <ValetParking />
  );
}
