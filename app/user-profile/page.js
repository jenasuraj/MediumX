"use client";

import { signOut, useSession } from "next-auth/react";
import Navbar from "@/ui/Navbar";
import { useRouter } from "next/navigation"; // ✅ Correct import
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession(); // ✅ Check session status
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // ✅ Prevents UI flickering
  }

  if (!session) {
    return null; // Ensures no UI is rendered before redirect
  }

  return (
    <>
      <Navbar />
      <h1 className="text-3xl">Welcome to the user profile page</h1>
      <h1 className=" mb-4">Welcome, {session.user.name}</h1>
      <h1 className="mb-4">{session.user.email}</h1>
      <img
        src={session.user.image}
        alt="User Avatar"
        className="w-16 h-16 rounded-full mb-4"
      />
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </>
  );
}
