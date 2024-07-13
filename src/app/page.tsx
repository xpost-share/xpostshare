"use client";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import Nav from "./components/Nav";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
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

  useEffect(() => {
    fetchAllPosts();
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setDisplayName(user.displayName);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    const interval = setInterval(() => {
      setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogin(user !== null);
      if (user) {
        fetchAllPosts(); // Fetch posts after user login
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const posts: any = [];
    querySnapshot.forEach((doc) => {
      posts.push({ ...doc.data(), post_id: doc.id });
    });
    setPosts(posts);
  };

  return (
    <div>
      <Nav />
      {!isLogin && (
        <div className="flex justify-between mt-8 mx-6">
          <div className="flex-1 mr-8">
            <h1 className="text-6xl font-bold mb-4">Share Success.</h1>
            <p className="text-3xl">
              Join our community and inspire others by sharing your walkthrough
            </p>
            <Link href="/login">
              <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Get Started
              </button>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            {titles.map((title, index) => (
              <span
                key={index}
                style={{
                  transition: "opacity 0.5s",
                  opacity: index === currentTitleIndex ? 1 : 0,
                  fontSize: "3rem",
                  fontWeight: "bold",
                  color: "#2563EB",
                }}
                className="mx-2"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}
      {isLogin && (
        <main className="p-8 w-full flex lg:flex-row flex-col items-center gap-5 flex-wrap justify-center">
          {posts.map((post) => (
            <Link
              href={`/posts/${post.slug}`}
              className="cursor-pointer lg:w-1/3 rounded-lg w-full border-2 h-[400px] bg-white relative overflow-hidden"
              key={post.post_id}
            >
              <Image
                src={post.image_url}
                alt="Image"
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
              <section className="absolute bottom-0 left-0 w-full bg-white bg-opacity-80 p-4">
                <p className="font-semibold text-xl text-blue-500">
                  {shortenText(post.title)}
                </p>
              </section>
            </Link>
          ))}
        </main>
      )}
    </div>
  );
}
