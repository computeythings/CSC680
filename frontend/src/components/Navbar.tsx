import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className={"flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm"}>
      <div className="flex-1">
        <Link href="/" className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer">
          Home
        </Link>
      </div>

      <div className="flex-1 text-center">
        <span className="text-3xl font-bold text-gray-800">ACMEPARKING</span>
      </div>

      <div className="flex-1 text-right">
        <Link href="/login" className="text-lg font-medium text-blue-500 underline hover:text-blue-700 cursor-pointer">
          Login
        </Link>
      </div>
    </nav>
  );
}
