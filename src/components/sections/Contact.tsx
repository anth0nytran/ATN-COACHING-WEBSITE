"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight, BookOpen, Megaphone, Handshake } from "lucide-react";
import Reveal from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="section-padding bg-gray-950">
      <div className="container-max">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our <span className="text-gradient">Discord</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get coaching announcements, VOD feedback channels, free tips, and teammates to scrim with.
          </p>
        </Reveal>

        {/* Slim promo bar */}
        <Reveal className="mb-10">
          <div className="rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4" style={{
            background: "linear-gradient(90deg, rgba(23,23,25,0.9) 0%, rgba(32,32,36,0.9) 100%)",
            border: "1px solid rgba(148,163,184,0.18)",
          }}>
            <div className="flex items-center gap-3 text-gray-200">
              <img src="/discord.png" alt="Discord" className="w-6 h-6" />
              <p className="text-base md:text-lg">Private channels for VOD reviews, rank help, and scrim partners.</p>
            </div>
            <Button asChild variant="valorant" size="lg">
              <a href="https://discord.gg/ajPmnzjaEF" target="_blank" rel="noopener noreferrer">
                Join Discord
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </Reveal>

        {/* Features grid (purposeful, compact) */}
        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card className="card-surface">
            <CardHeader>
              <div className="text-blue-400 mb-2"><Users className="w-6 h-6" /></div>
              <CardTitle className="text-white text-lg">Friendly Community</CardTitle>
              <CardDescription className="text-gray-300">Positive, helpful players focused on improvement.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="card-surface">
            <CardHeader>
              <div className="text-emerald-400 mb-2"><BookOpen className="w-6 h-6" /></div>
              <CardTitle className="text-white text-lg">Learning Resources</CardTitle>
              <CardDescription className="text-gray-300">Guides and tips curated by high‑rank players.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="card-surface">
            <CardHeader>
              <div className="text-yellow-400 mb-2"><Megaphone className="w-6 h-6" /></div>
              <CardTitle className="text-white text-lg">Events & Updates</CardTitle>
              <CardDescription className="text-gray-300">Giveaways, announcements, and coaching news.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="card-surface">
            <CardHeader>
              <div className="text-purple-400 mb-2"><Handshake className="w-6 h-6" /></div>
              <CardTitle className="text-white text-lg">Practice Partners</CardTitle>
              <CardDescription className="text-gray-300">Find teammates to scrim and review together.</CardDescription>
            </CardHeader>
          </Card>
        </Reveal>

        {/* Footer space intentionally minimal for a clean finish */}
      </div>
    </section>
  );
}
