"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { scrollToElement } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined" && pathname === "/") {
      scrollToElement(sectionId);
    } else {
      router.push(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: "rgba(3, 7, 18, 0.95)", borderBottom: "1px solid rgba(239, 68, 68, 0.2)", backdropFilter: "blur(8px)" }}>
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" aria-label="ATN Coaching" className="flex items-center gap-2 select-none">
            <span className="text-2xl font-extrabold tracking-tight leading-none text-white">ATN</span>
            <span className="text-2xl font-extrabold tracking-tight leading-none text-red-500">Coaching</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("credentials")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Credentials
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
            <Link
              href="/guides"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Guides
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="valorant"
              size="lg"
              onClick={() => scrollToSection("services")}
            >
              Book a Session
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-red-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900" style={{ borderBottom: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("credentials")}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Credentials
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Contact
              </button>
              <Link
                href="/guides"
                className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Guides
              </Link>
              <div className="pt-4">
                <Button
                  variant="valorant"
                  size="lg"
                  className="w-full"
                  onClick={() => scrollToSection("services")}
                >
                  Book a Session
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
