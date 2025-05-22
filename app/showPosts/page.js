'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/ui/Navbar'; // (if you have Navbar separately)
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import defaultImage from '@/public/bookwallpaper.png'
import Footer from '@/ui/Footer';
import '../globals.css'
import Like from '@/ui/Like';



const ShowPostPage = () => {

 const searchParams = useSearchParams()
 const id = searchParams.get('id')
 const [allposts,setAllPosts] = useState('')
 console.log("user id is",id) 


  useEffect(() => {
    if(!id)
       return
    const fetch = async () => {
      try {
        const response = await axios.get(`/api/postProfile?id=${id}`);
        setAllPosts(response.data);
      } catch (err) {
        console.log('Error:', err);
      }
    };
    

    fetch();
  }, [id]);


  console.log("particular user data is",allposts)
const htmlData = allposts[0]?.content;

return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex justify-center items-center">
        <div className="min-h-screen flex w-2/3 border border-gray-200 shadow-xl flex-col">
          <div className="flex flex-col w-full h-auto p-10">
            <div className="text-5xl font-bold text-gray-700 py-5">{allposts[0]?.heading}</div>
            <div className="text-gray-500 text-lg py-5">{allposts[0]?.about}</div>

            <Image
              src={defaultImage}
              alt="Post image"
              width={1100}
              height={200}
              className="object-cover"
            />

         

            <div className="w-full h-auto border border-gray-200 mt-5 flex gap-5">
              {Array.isArray(allposts[0]?.genre) &&
                allposts[0].genre.map((item, index) => (
                  <p key={index}>#{item}</p>
                ))}
            </div>
          </div>

         <div
  className="tiptap w-full min-h-[10vh] p-5 text-gray-800 leading-relaxed space-y-4"
  dangerouslySetInnerHTML={{ __html: htmlData || '' }}
/>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default ShowPostPage;
