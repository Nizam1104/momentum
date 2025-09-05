// components/TestimonialsSection.tsx
"use client";
import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Momentum has revolutionized my development workflow. The AI-powered task prioritization and time analytics helped me increase my productivity by 300% while maintaining work-life balance. It's like having a personal productivity coach that actually understands software development cycles.",
    name: "Alex Chen",
    title: "Senior Software Engineer at Google",
    src: "/api/placeholder/100/100"
  },
  {
    quote: "As a freelance full-stack developer managing 8+ clients, Momentum's project management and habit tracking features are game-changing. The automated time logging and intelligent scheduling have transformed chaos into clarity. My client satisfaction scores increased by 40%.",
    name: "Maria Rodriguez",
    title: "Full-stack Developer & Consultant",
    src: "/api/placeholder/100/100"
  },
  {
    quote: "The habit formation science behind Momentum is incredible. I've successfully built 12 new positive habits in 6 months, including daily code reviews and continuous learning. The gamification elements make productivity feel like an achievement unlocking system.",
    name: "David Kim",
    title: "Product Manager at Microsoft",
    src: "/api/placeholder/100/100"
  },
  {
    quote: "Momentum's wellness tracking integrated with productivity metrics gave me insights I never had before. I discovered my peak coding hours and optimized my schedule accordingly. The mood tracking helped me identify patterns affecting my creative output.",
    name: "Sarah Johnson",
    title: "UX/UI Designer at Airbnb",
    src: "/api/placeholder/100/100"
  },
  {
    quote: "The knowledge management system is brilliant for technical documentation. I can capture architecture decisions, code snippets, and learning notes seamlessly. The AI-powered search finds exactly what I need when debugging complex systems.",
    name: "Omar Hassan",
    title: "DevOps Engineer at Netflix",
    src: "/api/placeholder/100/100"
  },
];

const TestimonialsSection = () => {
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
            Trusted by Elite Professionals
          </h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            Join thousands of developers, designers, and product managers who've 
            transformed their careers with Momentum.
          </p>
        </motion.div>

        {/* Animated Testimonials */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <AnimatedTestimonials testimonials={testimonials} />
        </div>

        {/* Moving Cards for additional social proof */}
        <div className="h-[20rem] flex items-center justify-center">
          <InfiniteMovingCards
            items={testimonials.slice(0, 3)}
            direction="right"
            speed="slow"
            pauseOnHover={true}
            className="md:mt-0 mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
