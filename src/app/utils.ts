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
