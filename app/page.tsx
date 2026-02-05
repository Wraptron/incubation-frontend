import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HERO_IMAGES = [
  encodeURI("/WhatsApp Image 2026-02-03 at 3.31.02 PM.jpeg"),
  encodeURI("/WhatsApp Image 2026-02-03 at 3.32.06 PM (1).jpeg"),
  encodeURI("/WhatsApp Image 2026-02-03 at 3.32.08 PM.jpeg"),
  encodeURI("/WhatsApp Image 2026-02-03 at 3.31.03 PM (1).jpeg"),
];

const HIGHLIGHTS = [
  {
    title: "Mentorship",
    description:
      "Dedicated mentors support students at every stage, from problem identification and idea validation to customer discovery.",
  },
  {
    title: "Funding",
    description:
      "Student teams are provided with structured funding support to cover key expenses and develop their first MVP.",
  },
  {
    title: "Workshops",
    description:
      "Expert-led workshops cover customer discovery, lean startup, business models, pitching, and design thinking.",
  },
  {
    title: "Workspace",
    description:
      "Nirmaan provides a workplace to interact, collaborate, and innovate, at the Sadha & Shankar Innovation Hub.",
  },
  {
    title: "Tools & Resources",
    description:
      "At Nirmaan, you will find an extensive array of resources within our workspace, featuring advanced machining tools, sophisticated characterisation equipment, and top-tier computing facilities.",
  },
  {
    title: "Networking",
    description:
      "Student teams have the opportunity to engage with a diverse array of industry experts and IITM alumni, allowing them to discuss and refine their startup ideas.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full min-w-full bg-gradient-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-950 dark:via-black dark:to-zinc-900 font-sans relative overflow-x-hidden">
      {/* Header — adapts to light/dark */}
      <header className="w-full border-b border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/60 backdrop-blur-sm shrink-0">
        <div className="w-full px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Image
              src="/iitm-sie-logo.png"
              alt="School of Innovation & Entrepreneurship IIT Madras"
              width={160}
              height={72}
              priority
              className="h-12 sm:h-14 w-auto object-contain"
            />
             <Image
            src="/nirmaan logo.png"
            alt="Nirmaan"
            width={90}
            height={90}
            priority
            className="h-14 sm:h-16 w-auto object-contain"
          />
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/iitm logo.png"
              alt="IIT Madras"
              width={72}
              height={72}
              priority
              className="h-12 sm:h-14 w-12 sm:w-14 object-contain rounded-full object-center border-2 border-amber-700/40"
            />
          </div>
        </div>
      </header>

      {/* First page — text centered; below: images left, Start Your Journey + buttons right */}
      <section className="min-h-[calc(100vh-4rem)] w-full px-4 sm:px-4 lg:px-10 py-6 lg:py-8 flex flex-col gap-8 lg:gap-10">
        {/* All text centered (description left-aligned within block) */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full max-w-2xl flex flex-col items-center text-center gap-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              NIRMAAN TRAKTOR <span className="text-zinc-500 dark:text-zinc-400 font-semibold">Ascent</span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Begin your startup journey with us...
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-loose">
              Have a game-changing idea you&apos;ve been holding on to?
              <br />
              Wondering how to take the first step towards building a startup?
            </p>
          </div>
          <p className="text-zinc-600 dark:text-zinc-500 text-sm sm:text-base leading-relaxed max-w-6xl mx-auto text-left pt-2">
            Traktor Ascent is the entry point to Nirmaan&apos;s pre-incubation ecosystem, designed to help budding entrepreneurs take their first structured step towards entrepreneurship and startup building. The program supports early-stage innovators by providing a guided pathway where aspiring founders are introduced to entrepreneurship as a practice, not just a concept. Through guided learning, mentorship, and hands-on validation, Traktor Ascent enables participants to explore, validate, and build their startup ideas in a structured and supportive environment.
          </p>
        </div>

        {/* Images left, Start Your Journey + buttons right — equal-width columns, equal outer spacing */}
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-stretch">
          {/* Left: 2x2 image thumbnails */}
          <div className="w-full lg:min-w-0 flex justify-center lg:justify-start">
            <div className="grid grid-cols-2 gap-2 w-full min-w-[400px] max-w-[min(90vw,640px)] sm:min-w-[480px] sm:max-w-[min(90vw,760px)] lg:min-w-0 lg:max-w-none lg:w-full h-[252px] sm:h-[308px] lg:h-[364px]">
              {HERO_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-md overflow-hidden bg-zinc-200 dark:bg-zinc-800 min-h-0 min-w-0"
                >
                  <Image
                    src={src}
                    alt={`Program ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: full-height column — Application banner, Start Your Journey */}
          <div className="w-full lg:min-w-0 flex flex-col gap-6 lg:h-full lg:justify-start mt-4">
  {/* Application Open for Feb '26 — banner aligned with cards */}
  <div className="w-full max-w-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
    <div className="bg-gradient-to-r from-primary/90 via-primary to-primary/80 text-white text-center font-medium text-xl py-3 px-4 tracking-wide">
      Call for Applications for Feb &apos;26 Cohort
    </div>
  </div>

  {/* Two CTA cards: equal height, buttons aligned at bottom */}
  <div className="w-full flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-5 max-w-2xl">
    {/* Left: Start Your Journey Here */}
    <Link
      href="/apply"
      className="group relative flex-1 min-w-0 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full min-h-[160px] bg-white/80 backdrop-blur-md dark:bg-white p-6 border-l-4 border-primary flex flex-col">
        <p className="text-zinc-900 font-semibold text-base mb-1">
          Start Your Journey Here
        </p>
        <div className="flex-1 min-h-[2.5rem]" aria-hidden />
        <span className="inline-flex items-center gap-2 text-primary font-bold text-xl transition-all group-hover:gap-3">
          Apply now
          <svg className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>

    {/* Right: IITM Off-Campus Learners */}
    <a
      href="https://forms.gle/hVSKZe3VJ75LRowo7"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-1 min-w-0 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative h-full min-h-[160px] bg-white/80 backdrop-blur-md dark:bg-white p-6 border-l-4 border-primary flex flex-col">
        <p className="text-zinc-900 font-semibold text-base mb-0.5">
          IITM Off-Campus Learners
        </p>
        <p className="text-zinc-600 text-sm">
          BS Data Science and Electrical Systems
        </p>
        <div className="flex-1 min-h-[0.5rem]" aria-hidden />
        <span className="inline-flex items-center gap-2 text-primary font-bold text-xl transition-all group-hover:gap-3 mt-2">
          Apply Here
          <svg className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </span>
      </div>
    </a>
  </div>

  {/* Submission Deadline — red banner */}
  <div className="w-full max-w-2xl rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 shadow-sm">
    <div className="bg-red-400 text-white text-center font-medium text-xl py-3 px-4 tracking-wide">
      Submission Deadline: 18th Feb 2026, 11:59 PM
    </div>
  </div>
</div>

        </div>
      </section>

      {/* Next page — Program Highlights (full width) */}
      <section className="w-full px-4 sm:px-6 lg:px-10 py-12 lg:py-16 bg-zinc-50/50 dark:bg-transparent">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="flex justify-center mb-8">
            <h2 className="bg-orange-500 text-white font-semibold text-base px-6 py-2.5 rounded-md shadow-md">
              Program Highlights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((item, i) => (
              <div
                key={i}
                className="bg-emerald-50/95 dark:bg-emerald-50/90 border border-emerald-200/70 rounded-lg p-5 shadow-sm"
              >
                <h3 className="font-bold text-zinc-900 text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-700 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
