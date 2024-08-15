"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleSignOut } from "../../utils";
import { usePathname, useRouter } from "next/navigation";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Button, Avatar } from "@material-tailwind/react";
import Image from "next/image";

import { BsFillPersonFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import { FaPlus, FaBookmark } from "react-icons/fa6";

export default function Nav() {
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

  const isOnCreatePostPage = usePathname() === '/posts/create';

  return (
    <nav
      className={`${
        !isLoggedIn
          ? "bg-[rgba(246,241,233,0.95)] border-b-4 border-amber-400"
          : "bg-[rgba(255,157,0,0.4)]"
      }  z-50 fixed w-full top-0 backdrop-blur-sm`}
    >
      <div className="py-[14px] px-3 md:px-[110px] flex justify-between">
        <Link href={"/"} className="flex items-center gap-0 cursor-pointer">
          <Image src="/X.png" alt="X logo" width={30} height={50} />
          <span className={`text-3xl font-bold -m-1`}>Postshare</span>
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
                ):(

                  <button className="bg-blue-400 text-white text-lg py-1 px-3 rounded-xl font-medium upBtn transition-shadow duration-500 ease-out">
                    Upload
                  </button>
                )}
              </div>
              <Menu>
                <MenuButton>
                  <Avatar
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                    alt="avatar"
                    className="avtr transition-shadow duration-500 ease-in-out"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-64 origin-top-right z-50 rounded-sm border border-white/5 bg-white py-5 px-8 text-sm/6 text-white transition duration-100 ease-out mt-2 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 drpdown"
                >
                  <MenuItem disabled>
                    <div className="flex items-center justify-between pb-2">
                      <Avatar
                        src="https://docs.material-tailwind.com/img/face-2.jpg"
                        alt="avatar"
                      />
                      <span className="text-black text-lg text-truncate">
                        {userName}
                      </span>
                    </div>
                  </MenuItem>
                  <div className="my-1 h-px bg-amber-500/50" />
                  <MenuItem>
                    <button className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10">
                      <BsFillPersonFill
                        size={40}
                        className="bg-gray-500/20 rounded-full p-1"
                        color="black"
                      />

                      <span className="text-black">Edit profile</span>
                      <IoIosArrowForward color="black" size={20} />
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10">
                      <div className="bg-gray-500/20 rounded-full">
                        <FaBookmark size={40} color="black" className="p-2" />
                      </div>
                      <span className="text-black">Saved post</span>
                      <IoIosArrowForward color="black" size={20} />
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleLogout}
                      className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10"
                    >
                      <IoLogOutSharp
                        size={40}
                        className="bg-gray-500/20 rounded-full p-1"
                        color="black"
                      />

                      <span className="text-black">Sign out</span>
                      <IoIosArrowForward color="black" size={20} />
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
