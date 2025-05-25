import ParkingCheckout from "@/components/ParkingCheckout";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ParkingCheckoutPage() {
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
    localStorage.setItem("redirect", "/parking/checkout/")
    router.push('/login/')
    return null
  }
  // Redirect unauthorized roles
  if (!["admin","parking_attendant"].includes(user.role)) {
    return router.push('/')
  }
  localStorage.removeItem("redirect")
  return (
    <ParkingCheckout />
  );
}
