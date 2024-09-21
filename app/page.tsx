"use client";

import { useState, useEffect, useCallback} from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "./client_lib/user_actions";
import Header from "./components/Header";

import useAuthStore from "@/store/authStore";

export default function Home() {

  const { push } = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const login = useAuthStore((state) => state.login);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshAccessToken = useAuthStore((state) => state.refreshAccessToken);

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Manages the component mount state to ensure client-side only logic
    setMounted(true);
  }, []);

  const toggleForm = useCallback(() => {
    setIsSignUp((prev) => !prev);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
      ...(isSignUp && {
        username: event.currentTarget.username.value,
        confirmPassword: event.currentTarget.confirmPassword.value,
      }),
    };

    console.log("LOGING THE USER INNNNNN")

    const userEmail = event.currentTarget.email.value;
    const userPassword = event.currentTarget.password.value;
    
    let success;
    if (isSignUp) {
      // Implement your sign-up logic here
      // success = await registerUser({ email, password, ... });
    } else {
      
      success = await login(userEmail, userPassword);

      
    }

    if (success) {
      push('/tasks');
    } else {
      alert('Authentication failed');
    }

    // try {
    //   const data = isSignUp
    //     ? await registerUser(payload)
    //     : await loginUser(payload);

    //     console.log(data)

    //   if (data.error) {
    //     push("/");
    //   }     

    //   if (data.user) {
    //     console.log("Logged in user:", data.user);
        
    //     // Set the logged in user in the store
    //     updateUser(data.user);
        
    //     console.log("--------------------");
    //     console.log("State after logging in:", user);
        
    //     // Navigate to the tasks page
    //     push("/tasks");
    //   }
      
    // } catch (error) {
    //   push("/");
    // }
  };

  return (
    <main className="max-w-6xl mx-auto bg-green ">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Enter your username"
                  id="username"
                  name="username"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Enter your email address"
                id="email"
                name="email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                placeholder="Enter your password"
                id="password"
                name="password"
                required
              />
            </div>
            {isSignUp && (
              <div>
                <label className="block text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Confirm your password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required={isSignUp}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-900 focus:outline-none focus:bg-blue-700"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={toggleForm}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
