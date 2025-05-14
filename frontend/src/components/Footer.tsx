import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-1 border-t-1">
      <div className="w-screen px-6">
        <div className="flex text-center justify-between">
          <a href="mailto:acmeparking@aol.com" className="text-blue-600 hover:underline">
            Contact Us
          </a>
          <span>Designed By: Bryan Gonnella</span>
        </div>
      </div>
    </footer>
  );
};
