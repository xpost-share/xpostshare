// src/utils.ts
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
export const handleSignIn = async (provider: any, authProvider: any) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = authProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    if (token) {
      return { user: result.user };
    }
    throw new Error("No token received");
  } catch (error) {
    console.error("Error in handleSignIn:", error);
    throw error;
  }
};
export const handleSignOut = async () => {
  try {
    // Firebase sign out
    await signOut(auth);

    // API sign out (if you have an endpoint for this)
    // await fetch('your-api-logout-endpoint', { method: 'POST' });

    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // You can add any additional logout logic here

    // Optionally, you can redirect here instead of in the Nav component
    // window.location.replace("/");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
export const handleApiAuth = async (
  email: string,
  password: string,
  isLogin: boolean
) => {
  const endpoint = isLogin ? "login" : "register";
  const url = `https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/${endpoint}`;

  try {
    const response = await axios.post(url, { email, password });
    const { token, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ displayName: user.name, u_id: user.id })
      );
      window.location.replace("/");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(
        `An error occurred: ${error.response?.data.message || error.message}`
      );
    } else {
      alert("An unexpected error occurred");
    }
  }
};
export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    localStorage.setItem(
      "user",
      JSON.stringify({ displayName: user.displayName, u_id: user.uid })
    );
    window.location.replace("/");
  } catch (error) {
    alert(`Refresh page! An error occurred while signing in - ${error}`);
  }
};

export const handleGoogleSignOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    window.location.replace("/");
  } catch (error) {
    alert(`Refresh page! An error occurred while signing out - ${error}`);
  }
};
// src/utils.ts
export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem("user");
  return !!user; // Returns true if user exists in local storage
};

// Add other utility functions...
export const getCurrentDate = (): string => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const suffixes = ["th", "st", "nd", "rd"];
  const suffix = suffixes[(day - 1) % 10 > 3 ? 0 : (day - 1) % 10];

  const months = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const month = months[monthIndex];

  return `${day}${suffix} ${month} ${year}`;
};

export const slugifySentences = (sentence: string): string => {
  // Remove special characters and replace spaces with hyphens
  const slug = sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  // Generate 5 random letters
  const randomLetters = Array.from({ length: 5 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26))
  ).join("");

  return `${slug}-${randomLetters}`;
};
export const handleApiRegister = async (formData: {
  username: string;
  password: string;
  email: string;
  first_name: string;
}) => {
  try {
    const response = await fetch(
      "https://xpost-share-backend-app-4jzh5demla-as.a.run.app/api/v1/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      // Registration successful
      return { success: true, message: "Registration successful" };
    } else {
      // Registration failed
      return { success: false, message: data.message || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred during registration",
    };
  }
};
export const extractSlugFromURL = (url: string): string => {
  const parts = url.split("/");
  const slug = parts.slice(2).join("/");
  return slug;
};
