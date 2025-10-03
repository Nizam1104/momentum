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
    <div className="relative min-h-screen flex flex-col items-center justify-end" style={{ backgroundColor: 'white' }}>
      <TextAnimations onAnimationComplete={handleAnimationComplete} />
      {animationComplete && (
        <div className="flex flex-col items-center space-y-6 animate-fade-in absolute bottom-24">
          <button 
            className="bg-black text-gray-800 font-semibold px-6 py-2 rounded-lg transition-colors duration-200 shadow-lg border border-gray-300 flex items-center space-x-2"
            style={{ marginBottom: '100px' }}
            onClick={() => {
              signIn('google', { callbackUrl: '/dashboard' })
            }}
          >
            <FcGoogle />
            <span>Login with Google</span>
          </button>
        </div>
      )}
    </div>
  );
}
