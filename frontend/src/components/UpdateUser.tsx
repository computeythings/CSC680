import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import UserSearch from './UserSearch';
import UserForm from './UserForm';
import { ApiResponse, usersApi } from '@/services/ApiService';

export default function UpdateUser() {
    const { user } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [foundUser, setFoundUser] = useState<null | {
        firstname: string;
        lastname: string;
        user: string;
        password: string;
        id: string;
    }>(null);
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
    localStorage.removeItem("redirect")
    
    const updateUser = (data: any): Promise<ApiResponse<any>> => {
        return usersApi.updateUser(foundUser!.id, data).then(res=> {
            if (res.statusCode == 200) {
                setFoundUser(null)
            }
            return res
        })
    }
    
    const onResult = (data: any) => {
        setFoundUser(data)
    }

    return (
        <div className="w-full content-center">
            <div className="bg-white mx-auto gap-4 text-black w-3/4 border">
                {!foundUser ? (
                    <UserSearch title="Update User" found={onResult} />
                ) : (
                    <UserForm {...foundUser} title="Update User" onSubmit={updateUser} />
                )}
            </div>
        </div>
    )
}

      