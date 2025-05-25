import Users from "@/components/Users";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UsersPage() {
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
    localStorage.setItem("redirect", "/users/")
    router.push('/login/')
    return null
  }
  // Redirect unauthorized roles
  if (!["admin"].includes(user.role)) {
    return router.push('/')
  }
  localStorage.removeItem("redirect")
  return (
    <Users />
  );
}
