// components/CallToActionSection.tsx
"use client";
import React from "react";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { ShimmerButton } from "@/components/ui/shimmer-button";
import { IconArrowRight, IconStar } from "@tabler/icons-react";

const CallToActionSection = () => {
  return (
    <div className="bg-gradient-to-b from-neutral-900 to-black">
      <LampContainer className="h-[70vh]">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
          className="text-center px-4 max-w-4xl mx-auto"
        >
          <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
            Ready to 10x Your Productivity?
          </h2>
          
          <p className="mt-6 text-center text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 professionals who've transformed their careers with Momentum. 
            Start your 14-day free trial and experience the future of productivity.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 mt-6 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <IconStar key={i} className="h-5 w-5 fill-current" />
            ))}
            <span className="text-neutral-300 ml-2">4.9/5 from 2,847 reviews</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-10">
            {/* <ShimmerButton className="w-full sm:w-auto">
              <span className="flex items-center gap-2 px-8 py-3 text-lg font-semibold">
                Start Free Trial <IconArrowRight className="h-5 w-5" />
              </span>
            </ShimmerButton> */}
            <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md  -slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="flex items-center gap-2 px-8 py-3 text-lg font-semibold">
                Start Free Trial <IconArrowRight className="h-5 w-5" />
              </span>
</button>

            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 text-lg rounded-full -white/20 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">14 Days</div>
              <div className="text-neutral-400">Free Trial</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">No Setup</div>
              <div className="text-neutral-400">Ready in Minutes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-neutral-400">Expert Support</div>
            </div>
          </div>
        </motion.div>
      </LampContainer>
    </div>
  );
};

export default CallToActionSection;
