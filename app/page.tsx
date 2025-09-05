// app/page.tsx
"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconListDetails, IconRocket, IconUsersGroup } from "@tabler/icons-react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CallToActionSection from "@/components/CallToActionSection";
import Footer from "@/components/Footer";

export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Features",
      link: "#features",
      icon: <IconListDetails className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "How it Works",
      link: "#how-it-works",
      icon: <IconRocket className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Testimonials",
      link: "#testimonials",
      icon: <IconUsersGroup className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="relative w-full overflow-x-hidden bg-black antialiased">
      <FloatingNav navItems={navItems} />
      <section id="home">
        <HeroSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="testimonials-1234">
        <TestimonialsSection />
      </section>
      <section id="cta">
        <CallToActionSection />
      </section>
      <Footer />
    </div>
  );
}
