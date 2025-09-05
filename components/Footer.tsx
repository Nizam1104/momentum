// components/Footer.tsx
import React from "react";
import { IconBrandGithub, IconBrandX, IconBrandLinkedin, IconMail } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Momentum</h3>
            <p className="text-neutral-400 mb-4 leading-relaxed max-w-md">
              Revolutionizing productivity through AI-powered insights and 
              behavioral science. Built by developers, for professionals who demand excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="GitHub" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <IconBrandGithub className="h-5 w-5" />
              </a>
              <a href="#" aria-label="X (Twitter)" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <IconBrandX className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <IconBrandLinkedin className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Email" className="hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <IconMail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Momentum Technologies Inc. All rights reserved.</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
