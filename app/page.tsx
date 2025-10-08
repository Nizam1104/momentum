"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import TextAnimations from "@/components/ChaosToClarity"
import { signIn } from "next-auth/react";

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };
  
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="flex-1 flex items-center justify-center">
        <TextAnimations
          onAnimationComplete={handleAnimationComplete}
        />
      </div>
      {animationComplete && (
        <div className="flex flex-col items-center space-y-6 animate-fade-in mb-16">
          <button
            className="bg-gray-900 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-700 flex items-center space-x-3"
            onClick={() => {
              signIn('google', { callbackUrl: '/dashboard' })
            }}
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
