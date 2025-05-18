import React, { useEffect, useState } from 'react'
import Password from "@/components/Password"
import Username from "@/components/Username"
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { usersApi } from '@/services/ApiService';

export default function Login() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedPassword, setSelectedPassword] = useState("")
  const [passwords, setPasswords] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<Set<string>>(new Set());
  const addPassword = (value: string) => {
    setPasswords(prev => new Set(prev).add(value));
  };
   const addUser = (value: string) => {
    setUsers(prev => new Set(prev).add(value));
  };

  useEffect(() => {
    usersApi.getLoginList().then(res => {
      if (res.statusCode == 200) {
        res.data.data.forEach((creds: any) => {
          addPassword(creds["passwordstring"])
          addUser(creds["user"])
        })
      } else {
        alert("unable to contact login server.")
      }
    }).finally(() =>{
      setIsLoading(false)
    })
  }, [user, router])
  if (isLoading) {
    return null
  }
  if (user) {
    const redirect = localStorage.getItem("redirect")
    router.push(redirect || '/')
    return null
  }
  const handleUser = (text: string) => {
    setSelectedUser(prev => (prev === text ? "" : text))
  }
  
  const handlePassword = (text: string) => {
    setSelectedPassword(prev => (prev === text ? "" : text))
  }


  const handleSubmit = () => {
    login(selectedUser, selectedPassword).then(res => {
      if (!res) {
        alert("TODO: error stuff")
        setSelectedUser("")
        setSelectedPassword("")
      }
    })
  }

  return (
    <div className="w-full flex items-center justify-center p-0">
        {[...passwords].map(pwd => (
            <Password
            key={pwd}
            text={pwd}
            isSelected={selectedPassword === pwd}
            onClick={() => handlePassword(pwd)}
            />
        ))}
        {[...users].map(username => (
            <Username
            key={username}
            text={username}
            isSelected={selectedUser === username}
            onClick={() => handleUser(username)}
            />
        ))}
        
        <div className="flex items-center justify-center">
            <button
                onClick={handleSubmit}
                type="submit"
                className={`bg-white p-2 ${(selectedUser !== '' && selectedPassword != '') ?'text-blue-500 underline hover:text-blue-700 cursor-pointer' : 'text-white'}`}>
                SUBMIT
            </button>
        </div>
    </div>
  )
  
}