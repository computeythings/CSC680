import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import UserSearch from './UserSearch';
import UserForm from './UserForm';
import { ApiResponse, usersApi } from '@/services/ApiService';

export default function UpdateUser() {
    const { username } = useAuth()
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
    }, [username, router])
    if (isLoading) {
        return null
    }
    if (!username) {
        localStorage.setItem("redirect", "/users/update/")
        router.push('/login/')
        return null
    }
    localStorage.removeItem("redirect")
    
    const updateUser = (data: any): Promise<ApiResponse<any>> => {
        return usersApi.updateUser(foundUser!.id, data)
    }
    
    const onResult = (data: any) => {
        setFoundUser(data)
    }

    return (
        <div className="w-full content-center border">
            <div className="bg-white mx-auto gap-4 text-black w-3/4">
                {!foundUser ? (
                    <UserSearch title="Update User" found={onResult} />
                ) : (
                    <UserForm {...foundUser} title="Update User" onSubmit={updateUser} />
                )}
            </div>
        </div>
    )
}

      