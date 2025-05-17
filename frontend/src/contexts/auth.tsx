import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCookies } from '@/hooks/use-cookies'
import { authApi } from "@/services/ApiService"

interface AuthContextType {
    isClient: boolean
    user: UserInfo | null
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
}

interface UserInfo {
    id: number
    firstName: string
    lastName: string
    username: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { getCookie, setCookie } = useCookies()
    const [user, setUser] = useState<UserInfo | null>(null)
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setUser(decodeJWT(getCookie('AUTH_TOKEN')))
        setIsClient(true); // component has mounted
    }, [getCookie])

    const login = (username: string, password: string): Promise<boolean> => {
        return authApi.login(username, password).then(response => {
            if (response.data) {
                setUser(decodeJWT(response.data.token))
                setCookie(
                    "AUTH_TOKEN",
                    response.data.token,
                    { maxAge: response.data.expires_in }
                )
                return true
            }
            return false
        })
    };

    const logout = () => {
        setCookie('AUTH_TOKEN', '')
        window.location.href = "/"
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isClient }}>
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

const decodeJWT = (token: string | null): UserInfo | null => {
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(payload);
        } catch (e) {
            console.error('Failed to decode JWT:', e)
        }
    }
    return null
}