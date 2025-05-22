import Like from './Like';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Save from './Save';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import defaultImage from '@/public/medium-home-page.png';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Comment from './Comment';
import { FcApproval } from "react-icons/fc";
import { useSession } from 'next-auth/react';



const AllPosts = ({ dashboardVisited, u_id, showPostPerTag, setShowPostPerTag }) => {
  const { data: session } = useSession();
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [following, setFollowing] = useState(new Set());
  const [followLoading, setFollowLoading] = useState({}); // Track loading state for follow buttons

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/post');
        setAllPosts(response.data);
      } catch (err) {
        console.log('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/userId?email=${session.user?.email}`);
        setUserId(response.data[0].user_id);
      } catch (err) {
        console.log('Error fetching user:', err);
      }
    };

    const fetchFollowing = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/followStats?u_id=${userId}`);
        setFollowing(new Set(response.data.following));
      } catch (err) {
        console.error('Error fetching following list:', err);
      }
    };

    fetchPosts();
    if (session?.user?.email) {
      fetchUser();
    }
    if (userId) {
      fetchFollowing();
    }
  }, [session, userId]);

  const getFirstImageSrc = (content) => {
    const regex = /<img[^>]*>/i;
    const match = content.match(regex);
    if (match) {
      const srcRegex = /src="([^"]*)"/i;
      const srcMatch = match[0].match(srcRegex);
      return srcMatch ? srcMatch[1] : null;
    }
    return null;
  };

  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await axios.delete(`/api/post`, {
        params: { id },
      });

      if (response.status === 200) {
        setAllPosts(allPosts.filter((post) => post.id !== id));
        alert('Post deleted successfully!');
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('An error occurred while deleting the post.');
    }
  };


  const handleFollow = async (follower, following) => {
    setFollowLoading((prev) => ({ ...prev, [following]: true }));
    try {
      const response = await axios.post('/api/follow', {
        follower,
        following,
      });

      if (response.status === 200) {
        setFollowing((prev) => new Set(prev).add(following));
        window.dispatchEvent(new Event('updateFollowStats'));
        alert('Successfully followed user!');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setFollowing((prev) => new Set(prev).add(following));
        window.dispatchEvent(new Event('updateFollowStats'));
        alert('You are already following this user.');
      } else {
        console.error('Error following user:', err);
        alert('An error occurred while following the user.');
      }
    } finally {
      setFollowLoading((prev) => ({ ...prev, [following]: false }));
    }
  };

  const handleUnfollow = async (follower, following) => {
    setFollowLoading((prev) => ({ ...prev, [following]: true }));
    try {
      const response = await axios.delete('/api/follow', {
        data: { follower, following },
      });

      if (response.status === 200) {
        setFollowing((prev) => {
          const newSet = new Set(prev);
          newSet.delete(following);
          return newSet;
        });
        window.dispatchEvent(new Event('updateFollowStats'));
        alert('Successfully unfollowed user!');
      } else {
        alert('Failed to unfollow user.');
      }
    } catch (err) {
      console.error('Error unfollowing user:', err);
      alert('An error occurred while unfollowing the user.');
    } finally {
      setFollowLoading((prev) => ({ ...prev, [following]: false }));
    }
  };

  const update = (post) => {
    const query = new URLSearchParams({
      id: post.id.toString(),
      content: post.content,
      heading: post.heading,
      about: post.about,
      genre: post.genre,
    }).toString();
    router.push(`/create-post?${query}`);
  };


  
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
          <span>Loading posts...</span>
        </div>
      )}
      <div
        className={`h-screen ${
          dashboardVisited ? 'bg-gray-50 w-full' : 'bg-gray-50 w-3/4'
        } overflow-y-auto scrollbar-hidden flex flex-col p-4 gap-2`}
      >
        {allPosts
          .slice()
          .reverse()
          .map((item, index) => {
            const imageSrc = getFirstImageSrc(item.content);
            if (item.user_id === u_id) {
              return (
                <div
                  key={index}
                  className="w-full h-auto text-white mt-5 flex justify-between mb-5 border border-gray- cursor-pointer"
                >
                  <div className="w-2/3 h-full px-4">
                    <div
                      className="text-3xl font-bold text-gray-700"
                      onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                    >
                      {item.heading}
                    </div>
                    <div
                      className="py-6 text-gray-500"
                      onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                    >
                      {item.about}
                    </div>
                    {dashboardVisited && (
                      <div className="flex gap-5 justify-between items-center py-3 cursor-pointer">
                        <div className="flex gap-5 justify-center items-center">
                          <FaRegEdit
                            size={20}
                            color="blue"
                            onClick={() => update(item)}
                          />
                          <RiDeleteBin5Line
                            size={20}
                            color="red"
                            onClick={() => deletePost(item.id)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="bg-gray-200 h-full w-1/3 relative"
                    onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Post image"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <Image
                          src={defaultImage}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            } else if (!dashboardVisited) {
              if (!showPostPerTag) {
                return (
                  <div
                    key={index}
                    className="w-full h-auto text-white mt-5 flex justify-between mb-5 border border-gray- cursor-pointer"
                  >
                    <div className="w-2/3 h-full px-4">
                      <div
                        className="text-3xl font-bold text-gray-700"
                        onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                      >
                        {item.heading}
                      </div>
                      <div
                        className="py-6 text-gray-500"
                        onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                      >
                        {item.about}
                      </div>
                      {!dashboardVisited && (
                        <>
                          <div className="text-gray-500">⭐{item.date}</div>
                          <div className="flex items-center gap-2">
                            <div className="text-gray-500">{item.user_id}</div>
                            <FcApproval />
                          </div>
                          <div className="flex gap-5 justify-between items-center py-3 cursor-pointer">
                            <div className="flex gap-5 justify-center items-center">
                              <Like userId={userId} postId={item.id} />
                              <Comment userId={userId} postId={item.id} />
                              <Save userId={userId} postId={item.id} content={item.heading} />
                            </div>
                            <div className="flex gap-5">
                              {item.user_id !== userId && (
                                <button
                                  className={`inline-block px-1 text-sm ${
                                    following.has(item.user_id)
                                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                                      : 'bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black'
                                  }`}
                                  onClick={() =>
                                    following.has(item.user_id)
                                      ? handleUnfollow(userId, item.user_id)
                                      : handleFollow(userId, item.user_id)
                                  }
                                  disabled={followLoading[item.user_id]}
                                >
                                  {followLoading[item.user_id]
                                    ? 'Loading...'
                                    : following.has(item.user_id)
                                    ? 'Following'
                                    : 'Follow'}
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className="bg-gray-200 h-full w-1/3 relative"
                      onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                    >
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt="Post image"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <Image
                            src={defaultImage}
                            alt="Post image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              } else {
                if (Array.isArray(item.genre) && item.genre.includes(showPostPerTag)) {
                  return (
                    <div
                      className="w-full h-auto text-white mt-5 flex justify-between mb-5 border border-gray- cursor-pointer"
                    >
                      <div className="w-2/3 h-full px-4">
                        <div
                          className="text-3xl font-bold text-gray-700"
                          onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                        >
                          {item.heading}
                        </div>
                        <div
                          className="py-6 text-gray-500"
                          onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                        >
                          {item.about}
                        </div>
                        <>
                          <div className="text-gray-500">⭐{item.date}</div>
                          <div className="text-gray-500">{item.user_id}</div>
                          <div className="flex gap-5 justify-between items-center py-3 cursor-pointer">
                            <div className="flex gap-5 justify-center items-center">
                              <Like userId={userId} postId={item.id} />
                              <Save userId={userId} postId={item.id} />
                              <Comment userId={userId} postId={item.id} />
                            </div>
                            <div className="flex gap-5">
                              <button
                                className={`inline-block px-1 text-sm ${
                                  following.has(item.user_id)
                                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                                    : 'bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black'
                                }`}
                                onClick={() =>
                                  following.has(item.user_id)
                                    ? handleUnfollow(userId, item.user_id)
                                    : handleFollow(userId, item.user_id)
                                }
                                disabled={followLoading[item.user_id]}
                              >
                                {followLoading[item.user_id]
                                  ? 'Loading...'
                                  : following.has(item.user_id)
                                  ? 'Following'
                                  : 'Follow'}
                              </button>
                           
                            </div>
                          </div>
                        </>
                      </div>
                      <div
                        className="bg-gray-200 h-full w-1/3 relative"
                        onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.id)}`)}
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt="Post image"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <Image
                              src={defaultImage}
                              alt="Post image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              }
            }
          })}
      </div>
    </>
  );
};

export default AllPosts;