"use client";
import Navbar from "@/ui/Navbar";
import { signIn, signOut, useSession } from "next-auth/react";
import homePage from '@/public/medium-home-page.png'
import Image from "next/image";
import AllPosts from "@/ui/AllPosts";
import SideTopics from "@/ui/SideTopics";


export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
    <>
      <div className="flex items-center justify-center min-h-screen gap-5">
        <div>
        <h1 className="text-6xl mb-4">Explore the Ai blog</h1>
        <p className="text-gray-800">Explore , write & publish the trend in MediumX</p>
        <button
         onClick={() => signIn("google")}
         className="bg-black text-white px-4 rounded-md py-1 mt-5 cursor-pointer" 
          >
            Get started
           </button>
        </div>

        <Image 
        src={homePage}
        width={400}
        height={1000}
        alt="home page"
        />
       
      </div>
    </>
    );
  }
  



  return (
  <>
  <Navbar/>
    <div className="flex items-center justify-between min-h-screen w-full ">
     <AllPosts/>
     <SideTopics/>
    </div>
    </>
  );
}



/**
 * 
 * 
  <h1 className="text-2xl mb-4">Welcome, {session.user.name}</h1>
      <h1 className=" mb-4">{session.user.email}</h1>
      <img src={session.user.image} alt="User Avatar" className="w-16 h-16 rounded-full mb-4" />
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button> 
 * 
 * 
 */