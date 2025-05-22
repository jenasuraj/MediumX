import React, { useEffect, useState } from 'react';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from 'axios';


export default function Like({ userId, postId }) {
  const [userLiked, setUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch whether user liked the post
  const fetchUserLikeStatus = async () => {
    try {
      const response = await axios.get(`/api/like?userId=${encodeURIComponent(userId)}&postId=${encodeURIComponent(postId)}`);
      if (response.data.message === 'Match found') {
        setUserLiked(true);
      } else {
        setUserLiked(false);
      }
    } catch (err) {
      console.log("Error fetching like status", err);
    }
  };



  // Fetch total like count
  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(`/api/likeCount?postId=${encodeURIComponent(postId)}`);
      setLikeCount(response.data.count || 0);
    } catch (err) {
      console.log("Error fetching like count", err);
    }
  };



  // On mount or change in user/post
  useEffect(() => {
    if (userId && postId) {
      fetchUserLikeStatus();
      fetchLikeCount();
    }
  }, [userId, postId]);

  // Handle like/unlike operation
  const LikeOperation = async () => {
    try {
      await axios.post("/api/like", { userId, postId });
      setUserLiked(prev => !prev); // Optimistically toggle
      fetchLikeCount(); // Refresh count after toggling
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <>
      <div onClick={LikeOperation} className="cursor-pointer flex items-center gap-1">
        {userLiked ? (
          <FaHeart size={20} color="red" />
        ) : (
          <FaRegHeart size={20} color="gray" />
        )}
        <p className='text-black text-sm'>{likeCount}</p>
      </div>
    </>
  );
}
