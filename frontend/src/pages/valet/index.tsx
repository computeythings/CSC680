import Valet from "@/components/Valet";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ValetPage() {
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
    localStorage.setItem("redirect", "/valet/")
    router.push('/login/')
    return null
  }
  // Redirect unauthorized roles
  if (!["admin","valet"].includes(user.role)) {
    return router.push('/')
  }
  localStorage.removeItem("redirect")
  return (
    <Valet />
  );
}
