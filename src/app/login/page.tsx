"use client";
import { useState } from "react";
import { handleSignIn } from "../utils";
import { googleProvider } from "../../../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import useRouter

export default function LoginPage() {
  const router = useRouter(); // Initialize useRouter
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

  const handleGoogleSignIn = () => {
    setLoading(true);
    handleSignIn(googleProvider, GoogleAuthProvider);
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <h2 className="font-bold text-2xl mb-6">
        {isLogin ? "Login to" : "Join"} XPostShare
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="w-1/3 mb-6">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
        {!isLogin && (
          <>
            <input
              type="password"
              name="confirmation_password"
              placeholder="Confirm Password"
              value={formData.confirmation_password}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full mb-2 px-3 py-2 border rounded"
              required
            />
          </>
        )}
        {!isLogin && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreeToNotifications}
                onChange={handleCheckboxChange}
                required
                className="mr-2"
              />
              <span className="text-sm text-gray-500">
                *I agree to receive notifications for development-related
                events.
              </span>
            </label>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mb-4 text-blue-500 hover:underline"
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>

      <div className="w-1/3 text-center mb-4">- OR -</div>

      <button
        className="w-1/3 border-2 border-gray-600 rounded-md hover:bg-black hover:text-white px-8 py-4"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
