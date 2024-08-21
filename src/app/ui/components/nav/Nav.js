"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleSignOut } from "../../../utils";
import { usePathname, useRouter } from "next/navigation";
import AvtrDrop from "./AvtrDrop";
import UploadDialog from "./UploadDialog";

import Image from "next/image";

import { FaPlus } from "react-icons/fa6";

export default function Nav({
  mainTitle = "No Title",
  mainDesc = "No Description",
  subTopics = {
    default: { title: "Default Title", content: "Default Description", price: 0},
  },
  setSubTopics = () => {},
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (user || token) {
        setIsLoggedIn(true);
        if (user) {
          try {
            const userData = JSON.parse(user);
            setUserName(userData.displayName || userData.first_name || "User");
          } catch (error) {
            console.error("Error parsing user data:", error);
            setUserName("User");
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await handleSignOut();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserName("");
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isOnCreatePostPage = usePathname() === "/posts/create";

  return (
    <nav
      className={`${
        !isLoggedIn
          ? "bg-[rgba(246,241,233,0.95)] border-b-4 border-amber-400"
          : "bg-[rgba(255,157,0,0.4)]"
      }  z-50 fixed w-full top-0 backdrop-blur-sm`}
    >
      <div className="py-[14px] mx-[4%] md:mx-[13%] lg:mx-[7.5%] flex justify-between">
        <Link href={"/"} className="flex items-center gap-0 cursor-pointer relative">
          <Image src="/X.png" alt="X logo" width={50} height={50} className="absolute left-0"/>
          <span className={`text-3xl font-extrabold ml-10`}>Postshare</span>
        </Link>

        <div className="flex gap-5 md:gap-11 items-center">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <p
                  className={`text-2xl font-medium hover:text-amber-500 duration-500 transition-colors ease-in-out `}
                >
                  Post
                </p>
              </Link>
              <Link href="/login">
                <button
                  className={`py-1.5 px-2.5 signinbtn transition-shadow duration-400 ease-out rounded-lg text-white font-medium text-2xl bg-gradient-to-r from-amber-500 to-orange-500`}
                >
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex gap-7 items-center">
                {!isOnCreatePostPage ? (
                  <Link href="/posts/create">
                    <button className="newBtn flex items-center gap-1 text-xl bg-white py-1 px-2 transition-all duration-300 ease-out">
                      <FaPlus />
                      New Post
                    </button>
                  </Link>
                ) : (
                  <div>
                    <UploadDialog
                      mainTitle={mainTitle}
                      mainDesc={mainDesc}
                      subTopics={subTopics}
                      setSubTopics={setSubTopics}
                    />
                  </div>
                )}
              </div>
              <AvtrDrop handleLogout={handleLogout} userName={userName} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
