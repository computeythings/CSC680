import Logo from "./Logo";

export default function Header() {
  return (
    <nav className="flex items-center w-full py-1 bg-blue-500 shadow-sm z-1 border-b-1 border-black">
      <div className="mx-auto relative">
        <Logo />
        <span 
        className="absolute inset-0 flex items-center justify-center text-white font-bold pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
          ACME PARKING
        </span>
      </div>
    </nav>
  );
}
