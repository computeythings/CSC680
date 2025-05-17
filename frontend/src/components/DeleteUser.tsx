import { useAuth } from '@/contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import UserSearch from './UserSearch';
import UserDisplay from './UserDisplay';
import { ApiResponse, usersApi } from '@/services/ApiService';

export default function DeleteUser() {
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
        localStorage.setItem("redirect", "/users/delete/")
        router.push('/login/')
        return null
    }
    localStorage.removeItem("redirect")
        
    const deleteUser = () => {
        usersApi.deleteUser(foundUser!.id).then(res => {
            if (res.statusCode == 200) {
                setFoundUser(null)
            } else {
                alert("No delete")
            }
        })
    }
    
    const onResult = (data: any) => {
        setFoundUser(data)
    }

    return (
        <div className="w-full content-center border">
            <div className="bg-white mx-auto gap-4 text-black w-3/4">
                {!foundUser ? (
                    <UserSearch title="Delete User" found={onResult} />
                ) : (
                    <UserDisplay {...foundUser} title="Delete User" onSubmit={deleteUser} />
                )}
            </div>
        </div>
    )
}

      