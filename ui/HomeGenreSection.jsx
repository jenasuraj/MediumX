import React from 'react'
import { useState } from 'react';

const HomeGenreSection = ({showPostPerTag,setShowPostPerTag}) => {
  const [genreIndex,setGenreIndex] = useState(null)
    const items = [
    
        'Action',
        'Science',
        'Technology',
        'Mathematics',
        'Medical',
        'Engineering',
        'Cartoon',
        'Ui/Ux',
      ];

  const genreButton = (item,index)=>
  {
   if (genreIndex === index)
   {
    setGenreIndex(null)
    window.location.reload()
   }
   else{
    setGenreIndex(index)
   }
   setShowPostPerTag(item)
  }



  

  return (
    <>
        <div className=" min-h-[6vh] w-3/4 scrollbar-hidden flex gap-10 justify-center items-center border-b-2 border-gray-300">
        {items.map((item, index) => (
          <p key={index} className={`flex-shrink-0 py-1 ${index === genreIndex ?
             'bg-black text-white inline-block py-1 px-1' :
              'hover:inline-block  hover:bg-black hover:px-1 hover:text-white hover:cursor-pointer ' } `}
           onClick={()=>genreButton(item,index)} >{item}</p>
        ))}
      </div>
    </>
  )
}

export default HomeGenreSection
