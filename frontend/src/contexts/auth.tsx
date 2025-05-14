import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCookies } from '@/hooks/use-cookies'
import { authApi } from "@/services/ApiService"

interface AuthContextType {
    isClient: boolean
    username: string
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { getCookie, setCookie } = useCookies()
    const [username, setUsername] = useState("")
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setUsername(getCookie('USER')!)
        setIsClient(true); // component has mounted
    }, [getCookie])

    const login = (username: string, password: string): Promise<boolean> => {
        return authApi.login(username, password).then(response => {
            if (response.data) {
                setUsername(username)
                setCookie(
                    "AUTH_TOKEN",
                    response.data.token,
                    { maxAge: response.data.expires_in }
                )
                setCookie(
                    'USER', 
                    username,
                    { maxAge: response.data.expires_in }
                )
                return true
            }
            return false
        })
    };

    const logout = () => {
        setCookie('AUTH_TOKEN', '')
        setCookie('USER', '')
        window.location.href = "/"
    }

    return (
        <AuthContext.Provider value={{ username, login, logout, isClient }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
