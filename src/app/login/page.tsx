"use client";
import { useState } from "react";
import { handleSignIn } from "../utils";
import { googleProvider } from "../../../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";

import { Description, Field, Input, Label } from '@headlessui/react'
import Image from "next/image";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmation_password: "",
    email: "",
    first_name: "",
  });
  const [agreeToNotifications, setAgreeToNotifications] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToNotifications(e.target.checked);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await handleSignIn(googleProvider, GoogleAuthProvider);
      if (result.user) {
        // Google Sign-In successful
        const { displayName, uid, email } = result.user;
        localStorage.setItem(
          "user",
          JSON.stringify({ displayName, u_id: uid, email })
        );
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred during Google Sign-In. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin
      ? "https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/login"
      : "https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/register";

    const body = isLogin
      ? JSON.stringify({
          username: formData.username,
          password: formData.password,
        })
      : JSON.stringify(formData);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(isLogin ? "Login successful" : "Registration successful");
        if (!isLogin) {
          await sendVerificationEmail();
        }
        // Save user to local storage after successful login
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token); // Store the token
        router.push("/");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch(
        "https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/send-verification-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      if (response.ok) {
        console.log("Verification email sent successfully");
      } else {
        console.error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  return (
    <div className="lg:bg-[url('/login/bgLogin.svg')] bg-[url('/login/bgLoginMobile.svg')] bg-cover bg-center min-h-screen">
    <Link href='/' className="text-2xl cursor-pointer hidden md:block md:-rotate-90 top-24 lg:block lg:right-28 lg:top-4 lg:rotate-0 absolute text-orange-400 font-bold p-1 rounded-md outline outline-orange-400 outline-3">XPostShare</Link>
    <div className="flex items-center md:flex-1 w-full min-h-screen lg:px-28 justify-evenly gap-14">

      <div className="bg-white/90 p-7 rounded-md shadow-md w-[400px]">
        <p className="text-3xl mb-4 font-medium">Sign in</p>
        <p className="w-[280px]">If you don’t have an account register You can <Link href='/register' className="text-orange-400 font-bold cursor-pointer hover:text-amber-300 transition duration-700 ease-out">Register here!</Link></p>
        <Field className='grid grid-cols-1 mt-8 gap-5'>
          <div>
            <Label>Username</Label>
            <Input type="text" placeholder="Enter your username" className="w-full focus:outline-orange-500 duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80 text-sm" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your username" className="w-full focus:outline-orange-500 text-sm duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80" />
          </div>
        </Field>
        <div className="flex justify-end">
          <span className="cursor-pointer hover:text-gray-400 text-sm my-5 inline-block text-gray-600 font-light transition duration-200 ease-in right-0">Forgot Password?</span>

        </div>
        <button className="w-full rounded-md bg-orange-400 py-2.5 text-white hover:bg-orange-300 transition ease-in duration-150">
          Login
        </button>
        <span className="flex text-gray-500 justify-center my-5 cursor-default"> 
          OR
        </span>
        <div className="flex justify-center">
          <button onClick={handleGoogleSignIn} disabled={loading} className="flex outline hover:shadow-lg duration-400 transition ease-in outline-orange-300/50 gap-4 items-center bg-[#FFF4E3] px-10 py-3 rounded-xl">
            <FcGoogle size={30} />
            <span className="text-orange-700/80">Sign in with Google</span>
          </button>
        </div>
      </div>

      <div className="lg:flex flex-col hidden">
        <p className="text-3xl hidden lg:block text-[#4F210E] max-w-[450px] mb-10 text-end">Get right back where you left off,  create some  more amazing work!</p>
        <Image src="/login/guyReading.svg" alt="guy" height={300} width={300} className="hidden md:hidden lg:block"/>
      </div>
    </div>
</div>
  );
}
