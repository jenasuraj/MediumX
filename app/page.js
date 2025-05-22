"use client";
import Navbar from "@/ui/Navbar";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import PostSection from "@/ui/PostSection";
import SideTopics from "@/ui/SideTopics";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import SecondPage from "@/ui/SecondPage";
import Footer from "@/ui/Footer";
import ThirdPage from "@/ui/ThirdPage";

export default function Home() {
  const { data: session, status } = useSession();
  const [atModal,setAtModal] = useState(false);
  const [userName,setUserName] = useState("");
  const [alert,setAlert] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user?email=${session.user.email}&name=${session.user.name}`);
        console.log("User data fetched successfully:", response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("The user is not found");
          
          setAtModal(true)
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    

    fetchUser();
  }, [session?.user?.email]); 






  const postUserData = async()=>
  {
    try{
        if(!userName)
        {
          setAlert("Name is required")
          return
        }
        else if(userName.length < 3)
        {
          setAlert("Name should be atleast 3 characters")
          return
        }

        else{
          for(let i=0;i<userName.length;i++)
          {
            if(userName[i] === ' ')
            {
              setAlert("Name should not contain spaces")
              return
            }
          }
        }
        
        const user_id = '@' + (userName ?? "Guest"); // Defaults to "@Guest" if null or undefined
        
        // Check if user_id already exists in the database
        const checkUserId = await axios.get(`/api/user?user_id=${user_id}`);
        if (checkUserId.data.exists) {
          setAlert("User ID already exists. Please choose a different name.");
          return;
        }
         
        const postData = await axios.post(`/api/user`,{name:session.user.name,email:session.user.email,user_id:user_id});
        console.log("User data uploaded successfully",postData.data);
        setAtModal(false)

    }
    catch(error)
    {
      console.log("error while uploding user data to backend")
    }
  }



  return (
    <>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <>
        <div className="flex items-center justify-center min-h-screen gap-5">
          <div>
            <h1 className="text-6xl mb-4">Explore the AI Blog</h1>
            <p className="text-gray-800">
              Explore, write & publish the trend in MediumX
            </p>
            <button
              onClick={() => signIn("google")}
              className="border border-gray-900  px-4 rounded-md py-1 mt-5 cursor-pointer flex gap-5 justify-center items-center hover:bg-black hover:text-white hover:transition-all"
            >
              Get started <FcGoogle size={20}/>
            </button>
          </div>

          <Image src="/medium-home-page.png" width={400} height={1000} alt="home page" />
        </div>
        <SecondPage/>
        <ThirdPage/>
        <Footer/>
        </>
      ) : (
        <>
        <div className="relative">
        <Navbar />
          <div className="flex items-center justify-between min-h-screen w-full">
            <PostSection />
            <SideTopics />
          </div>
          {atModal && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white w-3/5 h-[80vh] p-8 rounded-lg shadow-2xl flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Holaaa! Choose your name</h2>
      <p className="text-gray-600 text-center mb-6">It seems your account is not registered in our system.</p>
      <p className="text-red-500 font-bold mb-3">{alert}</p>
      
      <div className="flex flex-col gap-4 w-4/5">
        <input 
          type="text"
          placeholder="Enter your name" 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        
        <button 
          className="cursor-pointer w-full bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition duration-300"
        onClick={postUserData}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}


      </div>
         
        </>
      )}
    </>
  );
}
