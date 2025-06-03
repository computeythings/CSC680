import TrainingAdmin from "@/components/TrainingAdmin";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TrainingAdminPage() {
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
    localStorage.setItem("redirect", "/training/admin/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")
  return (
    <TrainingAdmin />
  );
}
