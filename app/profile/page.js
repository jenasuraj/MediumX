"use client";

import { useSession } from "next-auth/react";
import Navbar from "@/ui/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AllPosts from "@/ui/AllPosts";
import LogOut from "@/ui/LogOut";
import { GrClose } from "react-icons/gr";
import { FcApproval } from "react-icons/fc";
import { PiBookmarksSimpleFill } from "react-icons/pi";
import { LiaUserEditSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [modal, setModal] = useState(false);
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [u_id, setU_id] = useState("");
  const { data: session, status } = useSession();
  const [answer, setAnswer] = useState([]);
  const router = useRouter();
  const [allPosts, setAllPosts] = useState("");
  const [dashboardVisited, setDashboardVisited] = useState(false);
  const [saveContent, setSaveContent] = useState([]);
  const [followStats, setFollowStats] = useState({
    followerCount: 0,
    followingCount: 0,
    followers: [],
    following: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session?.user?.email) return;
    setDashboardVisited(true);
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/profile?email=${session.user.email}`);
        setU_id(response.data[0]?.user_id || "");
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("The user is not found");
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, [session?.user?.email]);

  const fetchFurtherData = async () => {
    try {
      const response = await axios.get(`/api/profileData?u_id=${u_id}`);
      console.log("profileData fetched successfully:", response.data[0]);
      setAnswer(response.data[0]);
    } catch (error) {
      console.log("error retriving profileData");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(`/api/dashboardPosts?id=${u_id}`);
      setAllPosts(response.data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const fetchFollowStats = async () => {
    try {
      const response = await axios.get(`/api/followStats?u_id=${u_id}`);
      setFollowStats({
        followerCount: response.data.followerCount,
        followingCount: response.data.followingCount,
        followers: response.data.followers,
        following: response.data.following,
      });
    } catch (err) {
      console.error("Error fetching follow stats:", err);
    }
  };

  const fetchSaveData = async () => {
    console.log("triggered");
    try {
      const response = await axios.get(`/api/savePostProfile?userId=${encodeURIComponent(u_id)}`);
      if (response.data) {
        console.log("data is ", response.data.data);
        setSaveContent(response.data.data);
      }
    } catch (err) {
      console.log("Error fetching like status", err);
    }
  };

  useEffect(() => {
    if (u_id) {
      fetchFurtherData();
      fetchAllPosts();
      fetchFollowStats();
    }
  }, [u_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (answer.bio || answer.pronouns) {
        // UPDATE existing data using PUT request
        await axios.put("/api/profile", {
          u_id,
          bio,
          pronouns,
        });
      } else {
        // INSERT new data using POST request
        await axios.post("/api/profile", {
          u_id,
          bio,
          pronouns,
        });
      }
      fetchFurtherData(); // Refresh UI
      setModal(false); // Close modal after submitting
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (status === "loading") {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex relative bg-gray-100">
        <div className="w-2/6 h-screen border-r border-gray-300 bg-white p-4 shadow-md flex flex-col">
          <div className="w-20 h-20 rounded-full border">
            <img src={session.user.image} alt="profile" className="w-20 h-20 rounded-full" />
          </div>
          <p className="text-2xl font-bold mt-5">{session.user.name}</p>
          <div className="flex gap-2 items-center">
            <p className="font-bold text-xl mt-2 mb-2">{u_id}</p>
            <FcApproval color="blue" size={20} />
          </div>
          {answer.bio && <p className="text-gray-600">{answer.bio}</p>}
          {answer.pronouns && <p className="text-gray-600 font-bold">{answer.pronouns}</p>}
          <div className="flex gap-4 mt-2 mb-2">
            <Dialog>
              <DialogTrigger asChild>
                <p className="text-gray-600 cursor-pointer hover:underline">
                  <span className="font-bold">{followStats.followerCount}</span> Followers
                </p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] w-full">
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                  <DialogDescription>
                    Users who are following {u_id}.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full h-auto">
                  {followStats.followers.length > 0 ? (
                    followStats.followers.map((follower, index) => (
                      <div key={index} className="mt-1">
                        <p
                          className="w-full h-10 border border-black px-2 py-2 flex justify-center items-center hover:bg-black hover:text-white hover:cursor-pointer"
                          onClick={() => router.push(`/dashboard?u_id=${encodeURIComponent(follower)}`)}
                        >
                          {follower}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No followers yet.</p>
                  )}
                </div>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <p className="text-gray-600 cursor-pointer hover:underline">
                  <span className="font-bold">{followStats.followingCount}</span> Following
                </p>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] w-full">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                  <DialogDescription>
                    Users {u_id} is following.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full h-auto">
                  {followStats.following.length > 0 ? (
                    followStats.following.map((following, index) => (
                      <div key={index} className="mt-1">
                        <p
                          className="w-full h-10 border border-black px-2 py-2 flex justify-center items-center hover:bg-black hover:text-white hover:cursor-pointer"
                          onClick={() => router.push(`/dashboard?u_id=${encodeURIComponent(following)}`)}
                        >
                          {following}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Not following anyone yet.</p>
                  )}
                </div>
                <DialogFooter></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex mt-5 items-center gap-5">
            <p
              className="cursor-pointer text-blue-800 font-bold"
              onClick={() => {
                setBio(answer.bio || "");
                setPronouns(answer.pronouns || "");
                setModal(true);
              }}
            >
              <LiaUserEditSolid size={25} color="black" />
            </p>
            <p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={fetchSaveData}>
                    <PiBookmarksSimpleFill title="Saved posts" color="black" className="cursor-pointer" size={40} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] w-full">
                  <DialogHeader>
                    <DialogTitle>Saved posts</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full h-auto">
                    {saveContent.map((item, index) => {
                      return (
                        <div key={index} className="mt-1">
                          <p
                            className="w-full h-10 border border-black px-2 py-2 flex justify-center items-center hover:bg-black hover:text-white hover:cursor-pointer"
                            onClick={() => router.push(`/showPosts?id=${encodeURIComponent(item.post_id)}`)}
                          >
                            {item.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <DialogFooter></DialogFooter>
                </DialogContent>
              </Dialog>
            </p>
          </div>
          <LogOut />
        </div>

        <div className="w-4/6 h-screen flex justify-center items-center p-4 overflow-y-auto">
          <AllPosts dashboardVisited={dashboardVisited} u_id={u_id} />
        </div>

        {modal && (
          <div className="absolute w-[50%] h-[50vh] bg-white shadow-2xl left-[25%] right-[25%] flex flex-col items-center p-6 rounded-lg border border-gray-300">
            <button
              className="absolute right-10 top-10 px-4 py-2 rounded-md mb-4"
              onClick={() => setModal(false)}
            >
              <GrClose color="red" size={25} className="font-bold cursor-pointer" />
            </button>

            <form
              className="w-full flex flex-col justify-center items-center mt-16 space-y-4"
              onSubmit={handleSubmit}
            >
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Write a cool bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Pronouns"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}