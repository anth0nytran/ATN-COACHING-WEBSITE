"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Video, Users, Target, CheckCircle, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: "Book Your Session",
      description: "Choose your coaching package and schedule a time that works for you",
      color: "text-blue-400"
    },
    {
      icon: Video,
      title: "Prepare Your VOD",
      description: "Record a ranked match or prepare specific gameplay footage for review",
      color: "text-green-400"
    },
    {
      icon: Users,
      title: "Live Coaching Session",
      description: "1-on-1 session where we analyze your gameplay and work on improvements",
      color: "text-purple-400"
    },
    {
      icon: Target,
      title: "Get Your Action Plan",
      description: "Receive a personalized improvement plan with specific drills and goals",
      color: "text-orange-400"
    },
    {
      icon: CheckCircle,
      title: "Practice & Improve",
      description: "Work on your skills between sessions and track your progress",
      color: "text-red-400"
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-gray-900">
      <div className="container-max">
        {/* Section Header */}
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A simple, proven process that has helped hundreds of players break through 
            their rank plateaus and reach new heights in Valorant.
          </p>
        </Reveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {steps.map((step, index) => (
            <Reveal key={index} staggerDelayMs={index * 70} className="relative">
              <Card className="valorant-card text-center h-full">
                <CardHeader>
                  <div className={`${step.color} mb-4 flex justify-center`}>
                    <step.icon className="w-12 h-12" />
                  </div>
                  <CardTitle className="text-xl text-white mb-2">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center pointer-events-none absolute top-1/2 -translate-y-1/2 right-[-0.75rem] z-10">
                  <div className="h-px w-12 bg-gray-700" />
                  <ArrowRight className="ml-2 w-4 h-4 text-gray-500" />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        {/* What You&apos;ll Learn */}
        <Reveal className="bg-gray-800 rounded-2xl p-8 md:p-12 mb-16" style={{ border: "1px solid rgba(239, 68, 68, 0.2)" } as any}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            What You&apos;ll <span className="text-gradient">Learn</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Aim & Crosshair Placement</h4>
                <p className="text-gray-300 text-sm">Master precise aiming and optimal crosshair positioning</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Game Sense & Positioning</h4>
                <p className="text-gray-300 text-sm">Learn when to push, rotate, and hold positions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Utility Usage</h4>
                <p className="text-gray-300 text-sm">Maximize your agent&apos;s abilities for team success</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Communication</h4>
                <p className="text-gray-300 text-sm">Give clear, actionable callouts to your team</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Mental Game</h4>
                <p className="text-gray-300 text-sm">Stay focused and confident during intense matches</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-white font-semibold mb-1">Rank Strategy</h4>
                <p className="text-gray-300 text-sm">Understand the meta and adapt your playstyle</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA Section */}
        <Reveal className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your{" "}
            <span className="text-gradient">Improvement Journey?</span>
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Don&apos;t let another season pass you by. Book your first session and 
            start climbing the ranks today.
          </p>
          
          <Button
            variant="valorant"
            size="xl"
            onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
          >
            Book Your First Session
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
