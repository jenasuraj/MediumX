import React, { useEffect, useState } from 'react';
import { FcAssistant } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiSend } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const Comment = ({ userId, postId }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.length > 250) return;

    setIsLoading(true);
    try {
      const res = await axios.post('/api/comment', {
        userId,
        postId,
        comment
      });
      setComment("");
      await fetchComments();
    } catch (error) {
      setError("Failed to post comment. Please try again.");
      console.error("Error submitting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchComments = async () => {
    try {
      const res = await axios.get('/api/comment', {
        params: { userId, postId }
      });
      setAllComments(res.data);
      setError(null);
    } catch (error) {
      setError("Failed to load comments. Please try again.");
      console.error("Error fetching comments:", error);
    }
  };

  console.log("comments are", allComments);

  useEffect(() => {
    if (userId && postId && isOpen) {
      fetchComments();
    }
  }, [userId, postId, isOpen]);

  return (
    <Sheet onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button 
            variant="ghost" 
            className="p-2 rounded-full bg-white border border-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          >
            <FcAssistant size={22} className="filter grayscale hover:filter-none transition-all duration-300" />
            {allComments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white animate-pulse">
                {allComments.length}
              </span>
            )}
          </Button>
        </div>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-xl bg-white text-black border-l-2 border-black">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FcAssistant size={28} className="filter grayscale hover:filter-none transition-all duration-300 transform hover:scale-125 hover:rotate-12" />
              <SheetTitle className="text-3xl font-extrabold text-black tracking-wide uppercase">Comments</SheetTitle>
            </div>
            <SheetClose className="rounded-full p-2 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 hover:rotate-90">
              <IoMdClose size={30} className="text-white" />
            </SheetClose>
          </div>
          <SheetDescription className="text-gray-600 font-medium italic">
            Share your thoughts and spark a conversation
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100%-180px)] mt-4">
          {/* Comments section */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white">
            {error ? (
              <div className="p-4 text-center text-black bg-gray-100 rounded-lg border border-black/30 animate-fade-in">
                {error}
                <Button 
                  variant="ghost" 
                  onClick={fetchComments}
                  className="mt-2 text-black hover:text-gray-700 transition-all duration-300 font-bold transform hover:scale-105"
                >
                  Retry
                </Button>
              </div>
            ) : allComments.length > 0 ? (
              <div className="space-y-4">
                {allComments.slice().reverse().map((cmt) => (
                  <div 
                    key={cmt.id}
                    className="  ml-6 mr-6 mb-4 p-4  rounded-xl shadow-md border border-gray-300 hover:border-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-slide-in"
                  >
                    <div className='flex items-start gap-3'>
                      <Avatar className="h-10 w-10 border-2 border-black rounded-full transition-transform duration-300 transform hover:scale-110">
                        <AvatarImage src={cmt.user?.image || undefined} className="filter grayscale hover:filter-none" />
                        <AvatarFallback className="bg-white text-black">
                          <FcAssistant size={24} className="filter grayscale hover:filter-none transition-all duration-300" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 ">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-black  tracking-wide hover:text-gray-700 transition-colors duration-300">{cmt.user_id}</span>
                        </div>
                        <p className="mt-1 text-gray-600 font-small whitespace-pre-line hover:text-gray-800 transition-colors duration-300">
                          {cmt.comments}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <FcAssistant size={48} className="mb-4 filter grayscale hover:filter-none transition-all duration-300 transform hover:scale-125 hover:rotate-12" />
                <p className="text-lg text-black font-bold uppercase">No comments yet</p>
                <p className="text-sm text-gray-600 italic">Be the first to start the conversation!</p>
              </div>
            )}
          </div>

          {/* Comment form */}
          <form onSubmit={handleSubmit} className="mt-auto pt-4 border-t border-gray-300">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              className="min-h-[100px] resize-none bg-white text-black border-gray-400 focus:border-black focus:ring-2 focus:ring-gray-300 rounded-xl transition-all duration-300 placeholder-gray-500 font-medium hover:border-black hover:shadow-md"
              maxLength={250}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs font-bold ${comment.length > 250 ? 'text-black' : 'text-gray-500'} transition-colors duration-300`}>
                {comment.length}/250
              </span>
              <Button 
                type="submit" 
                disabled={!comment.trim() || isLoading || comment.length > 250}
                className={`flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide rounded-xl shadow-lg disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  <>
                    <FiSend size={16} />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Comment;