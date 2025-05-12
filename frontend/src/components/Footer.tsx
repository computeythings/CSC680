// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} ACME Parking. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
