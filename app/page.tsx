import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black font-sans relative overflow-hidden flex items-center justify-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(108,184,108,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(108,184,108,0.08),transparent_50%)]"></div>
      
      <main className="relative flex flex-col items-center justify-center gap-12 px-6 py-12 max-w-4xl mx-auto text-center">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/nirmaan logo.png"
            alt="Nirmaan logo"
            width={100}
            height={100}
            priority
            className="rounded-2xl shadow-2xl shadow-primary/20"
          />
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
              NIRMAAN
            </h1>
            <p className="text-base sm:text-lg text-primary font-semibold">IITM Pre-Incubation Center</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white max-w-2xl">
            Transform Your Ideas Into Reality
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-zinc-300 max-w-2xl">
            Join IITM Nirmaan's pre-incubation program and get access to mentorship, 
            funding, and resources to build your startup from the ground up.
          </p>
          
          {/* Features */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 text-sm sm:text-base mt-4">
            <div className="flex items-center gap-3 bg-zinc-900/50 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-zinc-200 font-medium">Expert Mentorship</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900/50 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-zinc-800">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-zinc-200 font-medium">IITM Network Access</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 text-base font-medium mt-4">
          <Button asChild size="lg" className="text-base px-8 py-6 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">
            <Link href="/applicant-login">Apply Now</Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="text-base px-8 py-6 border-2 border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:border-primary hover:text-white transition-all"
          >
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
