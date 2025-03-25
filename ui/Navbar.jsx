"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession(); // Get logged-in user session
  //console.log("i am arrived-2")
  return (

    <nav className="p-4 flex justify-between items-center border-b-1 border-gray-300">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-3xl font-serif">MediumX</h1>
      </Link>

      {/* Profile Button (Dynamic Slug Link) */}
      {session?.user ? (
        <Link href="/user-profile">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
            {session.user.name?.charAt(0).toUpperCase() || "S"}
          </button>
        </Link>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-gray-500 text-white px-4 py-2 rounded-full"
        >
          Login
        </button>
      )}
    </nav>
  );
}
