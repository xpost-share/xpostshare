"use client";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Nav from "./ui/components/Nav";
import CardLog from "./ui/components/Home/cardLog";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [titles, setTitles] = useState<string[]>([
    "XpostShare",
    "Xposure",
    "Xperience",
  ]);
  const [currentTitleIndex, setCurrentTitleIndex] = useState<number>(0);

  const shortenText = (text: string): string => {
    return text.length <= 55 ? text : text.slice(0, 55) + "...";
  };
  const fetchAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts: any = [];
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), post_id: doc.id });
    });
    setPosts(posts);
  };

  useEffect(() => {

    console.log(localStorage);

    const checkAuth = () => {
      const userJson = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (userJson || token) {
        setIsLogin(true);
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            setDisplayName(user.displayName);
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
        }
        fetchAllPosts();
      } else {
        setIsLogin(false);
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        setDisplayName(user.displayName || "");
        fetchAllPosts();
      } else {
        checkAuth(); // Check for API auth if Firebase auth is not present
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <main>
      <Nav />
      {!isLogin ? (
        <>
          <div className="lg:bg-[url('/Home/bgImg.svg')] bg-[url('/Home/bgImgMobile.svg')] bg-cover bg-center min-h-screen outline outline-3 outline-yellow-500">
            <div className="items-center min-h-screen justify-between gap-x-9 flex mx-[3%] md:mx-[13%] lg:mx-[7.5%]">
              <div className="grid-cols-1 gap-10 grid md:mb-0 w-full">
                <div className="w-full flex flex-col items-start">
                  <h1 className="title">Learn</h1>
                  <h1 className="title translate-x-7">Write</h1>
                  <h1 className="title translate-x-16">Share</h1>
                </div>
                <div className="flex ">
                  <p className="translate-x-5 max-w-[250px] md:max-w-[400px] font-semibold   text-base md:text-xl leading-4 lg:text-xl">
                    Share your wonderful stories and read amazing adventures of
                    others.
                  </p>
                </div>

                <Link href="/login">
                  <button className="btnstart hover:scale-110 transition-transform ease-in-out duration-5000 text-white py-2 px-3.5 text-xl md:text-2xl hover:bg-[#9a4824] bg-[#3B1708] transform">
                    Start Sharing
                  </button>
                </Link>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/Home/sun.svg"
                  alt="A sun"
                  width={150}
                  height={200}
                  className="absolute right-2 md:right-[100px] bottom-0 md:top-20 lg:right-[500px]"
                />
                <img
                  src="/Home/Dude.png"
                  alt="A person reading a book"
                  width={800}
                  height={800}
                  className="hidden lg:block"
                />
                <Image
                  src="/Home/cubc.svg"
                  alt="cub"
                  width={150}
                  height={150}
                  className="hidden lg:block absolute bottom-0 right-0"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#F6F1E9] min-h-screen"></div>
        </>
      ) : (
        <>
          <div className="bg-[#F6F1E9] min-h-screen">
            <div className="gap-12 px-5 md:px-28 pt-28 pb-12 md:grid-cols-1 grid-cols-1 grid lg:grid-cols-2 grid-flow-row">
              {posts.map((post) => (
                <div key={post.post_id}>
                  <CardLog post={post} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
