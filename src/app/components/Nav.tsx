"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { handleSignOut } from "../utils";
import { useRouter } from "next/navigation";

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
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">
                  XPostShare
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <span className="py-2 px-2 font-medium text-gray-500">
                  Welcome, {userName}
                </span>
                <Link
                  href="/posts/create"
                  className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300"
                >
                  Create Post
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
