import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import UserForm from './UserForm';
import { ApiResponse, usersApi } from '@/services/ApiService';

export default function AddUser() {
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
    localStorage.setItem("redirect", "/users/add/")
    router.push('/login/')
    return null
  }
  localStorage.removeItem("redirect")

  const addUser = (data: any): Promise<ApiResponse<any>> => {
    return usersApi.addUser(data)
  }

  return (
    <div className="w-full content-center">
        <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
            <UserForm title="Add User" onSubmit={addUser}/>
        </div>
    </div>
  );
}

    