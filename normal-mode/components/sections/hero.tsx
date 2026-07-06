"use client";

import { useRef } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { hero as heroEn } from "@/lib/content";
import { heroId } from "@/lib/content-id";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/cn";
import { Radar } from "../visuals/radar";

export function Hero() {
  const { lang } = useLang();
  const hero = lang === "en" ? heroEn : { ...heroEn, ...heroId };
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", duration: 1 },
      });

      tl.fromTo(
        ".hero-word",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.9 }
      )
        .fromTo(
          ".hero-desc",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta-row",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.45"
        )
        .fromTo(
          ".hero-field",
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1.4, ease: "expo.out" },
          "-=0.8"
        );

      // Ambient drifting blobs behind the mark — same slow, looping
      // wander used behind the tech-stack marquee elsewhere on the page.
      gsap.to(".hero-blob-a", {
        x: 36,
        y: -24,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-blob-b", {
        x: -30,
        y: 28,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-blob-c", {
        x: 22,
        y: 34,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // The glow behind the mark breathes slowly...
      gsap.to(".hero-glow", {
        scale: 1.12,
        opacity: 0.85,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ...and the mark itself floats, so the whole thing reads as alive
      // rather than a static logo drop.
      gsap.to(".hero-mark-img", {
        y: -14,
        rotate: 0.6,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: ref }
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:min-h-[880px] lg:pt-36"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-dot-grid opacity-[0.18]"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 78%, transparent)",
        }}
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-12 px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_540px] lg:items-center lg:gap-12 lg:px-10 xl:gap-20">
        {/* Left — headline + description + CTA */}
        <div className="relative z-10 max-w-[640px] lg:order-1 lg:max-w-[600px]">
          <h1
            className="text-[clamp(1.5rem,2.9vw,2.6rem)] font-normal leading-[1.15] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-tech), ui-sans-serif, system-ui" }}
          >
            {hero.headline.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <span className="inline-block">
                  {line.map((word, wi) => (
                    <span
                      key={wi}
                      className={cn(
                        "hero-word inline-block",
                        word.tone === "muted" ? "text-fg-dim" : "text-fg",
                        wi < line.length - 1 && "mr-[0.32em]"
                      )}
                    >
                      {word.text}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-desc mt-10 flex max-w-md items-start gap-3">
            <span
              aria-hidden
              className="mt-[6px] grid size-5 place-items-center rounded-full border border-border-strong text-fg-dim"
            >
              <Plus className="size-3" />
            </span>
            <p className="text-sm leading-relaxed text-fg-muted sm:text-[15px]">
              {hero.description}
            </p>
          </div>

          <div className="hero-cta-row mt-9">
            <Link
              href={hero.openApp.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-bg shadow-[0_-4px_7px_rgba(225,225,225,0.32)_inset] transition-colors hover:bg-[#fafafa]"
            >
              <span>{hero.openApp.label}</span>
              <span
                aria-hidden
                className="grid size-7 place-items-center rounded-full"
                style={{ background: "var(--gradient-brand)" }}
              >
                <ArrowUpRight className="size-3.5 text-white transition-transform duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right — AYRES mark */}
        <div className="hero-field relative mx-auto flex w-full max-w-[420px] origin-center scale-[0.82] items-center justify-center sm:max-w-[480px] sm:scale-100 lg:order-2 lg:mx-0 lg:max-w-none lg:justify-end">
          {/* Slow-drifting ambient blobs, same treatment as the tech-stack
              marquee, so the mark isn't sitting in a flat, static field. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
            <div className="hero-blob-a absolute -top-10 left-[8%] size-[220px] rounded-full bg-violet/20 blur-[90px]" />
            <div className="hero-blob-b absolute bottom-0 right-[6%] size-[240px] rounded-full bg-indigo/15 blur-[100px]" />
            <div className="hero-blob-c absolute top-1/3 right-1/3 size-[180px] rounded-full bg-azure/15 blur-[90px]" />
          </div>

          <div
            aria-hidden
            className="hero-glow pointer-events-none absolute inset-0 rounded-[3rem]"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(145,129,245,0.10), transparent 70%)",
            }}
          />

          {/* Radar sweep behind the mark — a slow scanning glow that reacts
              faintly to the cursor, so the logo reads as a live emblem
              rather than a flat image drop. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 aspect-square w-[80%] max-w-[460px] -translate-x-1/2 -translate-y-1/2"
          >
            <Radar
              scale={0.62}
              ringCount={6}
              spokeCount={8}
              ringThickness={0.045}
              spokeThickness={0.012}
              sweepSpeed={0.6}
              sweepWidth={2.0}
              color="#9f29ff"
              backgroundColor="#000000"
              falloff={2.1}
              brightness={2.3}
              mouseInfluence={0.06}
            />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/normal-mode/ayres-logo.png"
            alt="AYRES"
            className="hero-mark-img relative z-10 w-full max-w-[460px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
          />
        </div>
      </div>
    </section>
  );
}
