import React, { useEffect, useState } from 'react'
import { FcDownload } from "react-icons/fc";
import axios from 'axios';
import { GoBookmarkSlash } from "react-icons/go";
import { LiaBookmarkSolid } from "react-icons/lia";
const Save = ({userId,postId,content}) => {
const [saveIcon,setSaveIcon] =useState(false)  



const saveOperation = async()=>
{
try{
  await axios.post('/api/savePost',{
   userId,
   postId,
   content,
  })
  setSaveIcon(prev=>!prev)
}
catch(error)
{
  console.log("Error posting save id to db",error)
}
}


  // Fetch whether user liked the post
  const fetchUserSaveStatus = async () => {
    try {
      const response = await axios.get(`/api/savePost?userId=${encodeURIComponent(userId)}&postId=${encodeURIComponent(postId)}`);
      if (response.data.message === 'Match found') {
        setSaveIcon(true);
      } else {
        setSaveIcon(false);
      }
    } catch (err) {
      console.log("Error fetching like status", err);
    }
  };

useEffect( ()=>{
  fetchUserSaveStatus()
},[userId,postId])

  return (
    <>
      <div onClick={saveOperation}>
       {!saveIcon ? (
         <LiaBookmarkSolid size={20} color="blue" /> 
       ): <GoBookmarkSlash  color='blue' size={20}/>}
      </div>
    </>
  )
}

export default Save
