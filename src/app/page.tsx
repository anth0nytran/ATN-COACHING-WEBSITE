import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Credentials } from "@/components/sections/Credentials";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Contact } from "@/components/sections/Contact";
import AmbientBackground from "@/components/sections/AmbientBackground";
import LeadChatWidget from "@/components/sections/LeadChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <LeadChatWidget />
      {/* Ambient animated background spanning Services through HowItWorks */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <AmbientBackground />
        </div>
        <Services />
        <Credentials />
        <HowItWorks />
      </section>
      <Contact />
    </main>
  );
}
