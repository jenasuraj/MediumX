
"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { CiBellOn } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { IoMdContact } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Listen for route changes to manage loading state
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
    };

    // Next.js doesn't have built-in route change events in useRouter,
    // so we use router.events for client-side navigation
    router.events?.on("routeChangeStart", handleRouteChangeStart);
    router.events?.on("routeChangeComplete", handleRouteChangeComplete);
    router.events?.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events?.off("routeChangeStart", handleRouteChangeStart);
      router.events?.off("routeChangeComplete", handleRouteChangeComplete);
      router.events?.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      {/* Full-screen loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl animate-pulse">Loading...</div>
        </div>
      )}
      <nav className="p-4 flex justify-between items-center border-b-1 border-gray-300">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-3xl font-serif flex">
            Medium
            <span className="font-bold text-4xl">
              <FaXTwitter />
            </span>
          </h1>
        </Link>

        {/* Create post and profile */}
        <div className="flex gap-3 items-center">
        
          <div>
            <CiBellOn size={30} />
          </div>
         
          <Link href='/contact'>
          <div className="ml-2">
            <IoMdContact  size={30} />
          </div>
          </Link>

          <Link href="/create-post">
            <div className="text-gray-800 px-4 py-2 rounded-full cursor-pointer flex gap-1 items-center opacity-80">
              <FaRegPenToSquare size={20} />
              <p>Write</p>
            </div>
          </Link>

          <Link href="/profile">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </nav>
    </>
  );
}