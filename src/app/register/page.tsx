// src/app/register/page.tsx
"use client";
import { useState } from "react";
import { handleApiRegister } from "../utils";

import { Description, Field, Input, Label } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await handleApiRegister({
      username,
      password,
      email,
      first_name: firstName,
    });

    if (result.success) {
      // Registration successful, you might want to redirect or show a success message
      console.log(result.message);
      // You could redirect to login page or automatically log the user in here
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <div className="lg:bg-[url('/register/bgReg.svg')] bg-[url('/register/bgRegMobile.svg')] bg-cover bg-center min-h-screen">
      <Link
        href={"/"}
        className="text-2xl cursor-pointer hidden md:block md:-rotate-90 top-24 lg:block lg:left-28 lg:top-4 lg:rotate-0 absolute text-orange-400 font-bold p-1 rounded-md outline outline-orange-400 outline-3"
      >
        XPostShare
      </Link>
      <div className="flex items-center md:flex-1 w-full min-h-screen lg:px-28 justify-evenly gap-14">
        <Image
          src="/register/guy.svg"
          alt="guy"
          height={400}
          width={400}
          className="hidden md:hidden lg:block"
        />
        <div className="bg-white/90 p-7 rounded-md shadow-md w-[400px]">
          <p className="text-3xl mb-4 font-medium">Sign up</p>
          <p className="w-[280px]">
            If you already have an account register You can{" "}
            <Link
              href="/login"
              className="text-orange-400 font-bold cursor-pointer hover:text-amber-300 transition duration-700 ease-out"
            >
              Login here!
            </Link>
          </p>
          <Field className="grid grid-cols-1 mt-4 gap-5">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full focus:outline-orange-500 duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80 text-sm"
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                type="text"
                placeholder="Enter your username"
                className="w-full focus:outline-orange-500 text-sm duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="w-full focus:outline-orange-500 text-sm duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80"
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm your password"
                className="w-full focus:outline-orange-500 text-sm duration-400 transition-all ease-in placeholder-orange-600/50 font-light mt-1 text-orange-900 px-7 py-3 rounded-md outline-1 outline bg-orange-400/5 outline-orange-400/80"
              />
            </div>
          </Field>
          <button className="w-full mt-5 rounded-md bg-orange-400 py-2.5 text-white hover:bg-orange-300 transition ease-in duration-150">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
