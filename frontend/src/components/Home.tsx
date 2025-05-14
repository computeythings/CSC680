import { useAuth } from '@/contexts/auth';

export default function Home() {
  const { username } = useAuth()
  if (typeof localStorage != 'undefined') localStorage.removeItem("redirect")
  return (
    <div className="flex flex-grow items-center justify-center">
        <h2 className="text-black bg-white p-12 text-5xl font-bold w-1/3 text-center border shadow-lg">
        { username !== "" ? `Welcome, ${username}` : 'EMPLOYEE PORTAL'}
        </h2>
    </div>
  );
}
