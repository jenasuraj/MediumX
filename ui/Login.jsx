"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import img from "@/public/medium-home-page.png";
import { useRouter } from "next/navigation";
const Login = () => {
  const router = useRouter()
  const [modal, setModal] = useState(false);
  const { data: session } = useSession(); // ✅ Get session data
  
  if (session)
  {
  router.push('/dashboard')
  }

  return (
    <div className="min-h-screen w-full bg-amber-50 flex justify-center items-center px-6 relative">
      <div className="flex flex-col items-start space-y-6">
        <h1 className="text-6xl font-bold text-gray-800 font-serif">
          Hello, Medium User
        </h1>
        <p className="text-lg text-gray-600">
          Join the conversation, share your thoughts, and explore amazing stories.
        </p>

        {!session ? (
          <button
            className="cursor-pointer rounded-full bg-black text-white px-8 py-3 text-lg font-semibold transition hover:bg-gray-900 shadow-md"
            onClick={() => setModal(true)}
          >
            Get Started
          </button>
        ) : (
          <button
            className="cursor-pointer rounded-full bg-red-600 text-white px-8 py-3 text-lg font-semibold transition hover:bg-red-800 shadow-md"
            onClick={() => signOut()}
          >
            Logout
          </button>
        )}
      </div>

      <div className="ml-12">
        <Image src={img} width={500} height={300} alt="Medium Home Page" className="rounded-lg shadow-lg" />
      </div>

      {/* Modal Page */}
      {modal && !session && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 relative">
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Medium</h2>
            <p className="text-lg text-gray-600 text-center mb-6">
              Sign in to share your stories and connect with others.
            </p>
            <button
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
              onClick={() => signIn("google")}
            >
              Sign In with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
