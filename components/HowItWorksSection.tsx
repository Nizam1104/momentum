// components/HowItWorksSection.tsx
"use client";
import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { motion } from "framer-motion";
import { Timeline } from "@/components/ui/timeline";
import {
  IconCalendarCheck,
  IconRocket,
  IconChartLine,
  IconBrain,
  IconTarget,
  IconTrendingUp,
} from "@tabler/icons-react";

const HowItWorksSection = () => {
  const timelineData = [
    {
      title: "Strategic Planning & Goal Setting",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <IconCalendarCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Intelligent Daily Planning
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Begin each day with AI-powered planning that analyzes your goals, 
                energy patterns, and available time to create optimized daily schedules. 
                Our smart algorithm considers your historical productivity data to suggest 
                the perfect task sequence for maximum efficiency.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-4 rounded-lg  -blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <IconBrain className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">Smart Recommendations</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Get personalized suggestions for goal breakdown, time allocation, 
              and energy management based on your unique productivity patterns.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Focused Execution & Real-time Tracking",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <IconRocket className="h-6 w-6 text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Seamless Execution Flow
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Enter deep work mode with our distraction-free interface. 
                Automatically track time across projects, log habit completions 
                with one-click actions, and receive gentle nudges to maintain 
                focus without breaking your flow state.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-4 rounded-lg  -green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <IconTarget className="h-5 w-5 text-green-400" />
              <span className="font-semibold text-white">Flow State Protection</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Smart notifications that respect your focus sessions and provide 
              contextual updates when you're ready to receive them.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Data-driven Reflection & Growth",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <IconChartLine className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Intelligent Analytics & Insights
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Transform daily data into actionable insights with advanced analytics. 
                Discover your peak performance hours, identify productivity bottlenecks, 
                and receive personalized recommendations for continuous improvement. 
                Our ML models learn from your patterns to predict and optimize future performance.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-4 rounded-lg  -purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <IconTrendingUp className="h-5 w-5 text-purple-400" />
              <span className="font-semibold text-white">Predictive Optimization</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Machine learning algorithms that predict your optimal work patterns 
              and suggest schedule adjustments for peak performance.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-neutral-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 px-4"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
            Your Success Framework
          </h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            A scientifically-backed methodology that transforms how you approach 
            productivity and personal growth.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          <Timeline data={timelineData} />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
