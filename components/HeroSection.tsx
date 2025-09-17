
// components/HeroSection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

const HeroSection = () => {
  const words = [
    { text: "Your" },
    { text: "All-in-One" },
    { text: "Hub" },
    { text: "for" },
    { text: "Developer" },
    { text: "Productivity", className: "text-blue-500 dark:text-blue-500" },
    { text: "&" },
    { text: "Personal" },
    { text: "Growth.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          Momentum.
        </motion.h1>
        
        <div className="max-w-4xl mx-auto">
          <TypewriterEffectSmooth words={words} className="justify-center" />
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 font-normal text-base md:text-lg text-neutral-300 max-w-3xl text-center mx-auto px-4"
        >
          Revolutionize your workflow with AI-powered task management, intelligent habit tracking, and comprehensive personal growth analytics. Built by developers, for professionals who demand excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10"
        >
          <Button className="w-full sm:w-48 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Using
          </Button>
          {/* <Button variant="outline" className="w-full sm:w-48 h-12 rounded-full -white/[0.2] text-white text-lg font-bold hover:bg-white/[0.1] transition-colors backdrop-blur-sm">
            Watch Demo
          </Button> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 max-w-4xl mx-auto px-4 flex justify-center"
        >
          <TextRevealCard
            text="Transform chaos into clarity."
            revealText="With Momentum"
            className=" -white/10 text-xl text-center"
          >
          </TextRevealCard>
        </motion.div>
      </div>
      <BackgroundBeams className="absolute inset-0 z-0" />
    </div>
  );
};

export default HeroSection;
