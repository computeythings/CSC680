import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import UserForm from './UserForm';
import { ApiResponse, usersApi } from '@/services/ApiService';

export default function AddUser() {
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

    