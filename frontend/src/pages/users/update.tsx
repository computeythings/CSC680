import UpdateUser from "@/components/UpdateUser";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UpdateUserPage() {
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
    localStorage.setItem("redirect", "/users/update/")
    router.push('/login/')
    return null
  }
  // Redirect unauthorized roles
  if (!["admin"].includes(user.role)) {
    return router.push('/')
  }
  localStorage.removeItem("redirect")
  return (
    <UpdateUser />
  );
}
