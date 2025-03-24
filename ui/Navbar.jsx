
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 flex justify-between items-center border-b-1 border-gray-300">
      {/* Logo */}
      <h1 className="text-3xl font-serif">MediumX</h1>

      {/* Profile Button */}
     <Link href="/user-profile">
     <button className="bg-blue-500 text-white px-4 py-2 rounded-full">S</button>
     </Link>
    </nav>
  );
}
