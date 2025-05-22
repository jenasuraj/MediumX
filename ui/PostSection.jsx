import React from 'react';
import HomeGenreSection from './HomeGenreSection';
import AllPosts from './AllPosts';
import { useState } from 'react';

const PostSection = () => {
const [showPostPerTag,setShowPostPerTag]=useState('')


  return (
    <div className="h-screen w-3/4 border-r border-gray-300 flex flex-col items-center">
<HomeGenreSection showPostPerTag={showPostPerTag} setShowPostPerTag={setShowPostPerTag}/>
<AllPosts showPostPerTag={showPostPerTag} setShowPostPerTag={setShowPostPerTag}/>
    </div>
  );
};

export default PostSection;