// components/FeaturesSection.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  IconClipboardList,
  IconTargetArrow,
  IconRun,
  IconMoodSmile,
  IconClock,
  IconNotes,
  IconAward,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";

const features = [
  {
    title: "Intelligent Project Management",
    description: "Transform overwhelming projects into manageable milestones with AI-powered task breakdown, smart prioritization, and automated progress tracking. Never miss a deadline again.",
    icon: IconClipboardList,
  },
  {
    title: "Strategic Goal Achievement",
    description: "Set SMART goals with intelligent milestone generation, track progress with visual analytics, and receive personalized recommendations to accelerate your success journey.",
    icon: IconTargetArrow,
  },
  {
    title: "Scientific Habit Formation",
    description: "Build lasting habits using proven behavioral science principles. Track streaks, analyze patterns, and receive adaptive reminders that evolve with your lifestyle.",
    icon: IconRun,
  },
  {
    title: "Holistic Wellness Tracking",
    description: "Monitor mood, energy levels, sleep quality, and gratitude practices. Gain deep insights into your well-being patterns and optimize for peak performance.",
    icon: IconMoodSmile,
  },
  {
    title: "Precision Time Analytics",
    description: "Automatically track time across projects with intelligent categorization. Discover your productivity patterns and optimize your focus for maximum efficiency.",
    icon: IconClock,
  },
  {
    title: "Knowledge Management Hub",
    description: "Capture, organize, and retrieve ideas with AI-powered search and tagging. Transform scattered thoughts into actionable insights and never lose a breakthrough moment.",
    icon: IconNotes,
  },
  {
    title: "Gamified Progress System",
    description: "Stay motivated with achievement badges, progress streaks, and milestone celebrations. Transform productivity into an engaging journey of continuous improvement.",
    icon: IconAward,
  },
  {
    title: "Adaptive Workflows",
    description: "Customize every aspect of your productivity system with flexible templates, smart automation, and personalized dashboards that evolve with your needs.",
    icon: IconAdjustmentsHorizontal,
  },
];

const FeaturesSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-black to-neutral-900 relative overflow-hidden">
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
            Engineered for Excellence
          </h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            Every feature is meticulously crafted using cutting-edge technology and behavioral science to maximize your potential.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          <HoverEffect items={features} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
        </div>

        {/* Featured Card Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto px-4"
        >
          <CardSpotlight className="h-96 w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10">
            <div className="relative z-20 p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                AI-Powered Insights Engine
              </h3>
              <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                Our advanced machine learning algorithms analyze your productivity patterns, 
                predict optimal work schedules, and provide personalized recommendations 
                to maximize your efficiency and well-being.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-neutral-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">95%</div>
                  <div>Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">3.2x</div>
                  <div>Productivity Boost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div>Smart Analysis</div>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesSection;
