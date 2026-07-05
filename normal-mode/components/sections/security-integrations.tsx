"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { HalftoneField } from "../visuals/halftone-field";
import { StackMarquee } from "./stack-marquee";
import { goToRetroMode } from "@/lib/retro-nav";
import { useLang } from "@/lib/lang";

type Card = {
  title: string;
  cta: string;
  href: string;
  image: string;
  alt: string;
};

const CARDS_EN: Card[] = [
  {
    title: "Our Sportswear Brand",
    cta: "About Us",
    href: "/#aboutMe",
    image: "/a1-new.png",
    alt: "AYRES Apparel — authentic, in-house sportswear brand",
  },
  {
    title: "Our Web Ecosystem",
    cta: "See Projects",
    href: "/#projects",
    image: "/a2-new.png",
    alt: "The web apps AYRES built to power its sales",
  },
];

const CARDS_ID: Card[] = [
  { ...CARDS_EN[0], title: "Brand Sportswear Kami", cta: "Tentang Kami" },
  { ...CARDS_EN[1], title: "Ekosistem Web Kami", cta: "Lihat Projects" },
];

const COPY = {
  en: {
    titleA: "Craft &",
    titleB: "Technology",
    body: "Every AYRES product is designed and produced in-house — and every sale is powered by software we wrote ourselves. AI agents fill the funnel, the online shop and chatbot close the order, and the production CRM makes sure it ships on time. Craft sells the first jersey; technology sells the next thousand.",
    builtWith: "Built With",
  },
  id: {
    titleA: "Karya &",
    titleB: "Teknologi",
    body: "Setiap produk AYRES dirancang dan diproduksi sendiri — dan setiap penjualan ditenagai software yang kami tulis sendiri. AI agent mengisi funnel, toko online dan chatbot menutup order, dan CRM produksi memastikan semuanya terkirim tepat waktu. Karya menjual jersey pertama; teknologi menjual seribu berikutnya.",
    builtWith: "Dibangun Dengan",
  },
};

export function SecurityIntegrations() {
  const { lang } = useLang();
  const CARDS = lang === "en" ? CARDS_EN : CARDS_ID;
  const copy = COPY[lang];
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!ref.current) return;

      gsap.fromTo(
        ".si-title-line",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".si-body",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.25,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".si-card",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".si-cards", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".si-partners-label",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: ".si-partners-label", start: "top 92%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      id="security"
      ref={ref}
      className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36"
    >
      {/* Animated halftone bg covers the whole upper section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[820px]">
        <HalftoneField />
        {/* Top mask */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24"
          style={{
            background: "linear-gradient(to bottom, var(--color-bg), transparent)",
          }}
        />
        {/* Bottom mask */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: "linear-gradient(to top, var(--color-bg), transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start lg:gap-16">
          <h2
            className="text-[clamp(2.4rem,5.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.02em] text-fg"
            style={{
              fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
            }}
          >
            <span className="si-title-line block overflow-hidden">
              <span className="inline-block">{copy.titleA}</span>
            </span>
            <span className="si-title-line block overflow-hidden">
              <span className="inline-block">{copy.titleB}</span>
            </span>
          </h2>

          <div className="si-body flex max-w-md items-start gap-3 self-end">
            <span
              aria-hidden
              className="mt-[6px] grid size-5 place-items-center rounded-full border border-border-strong text-fg-dim"
            >
              <Plus className="size-3" />
            </span>
            <p
              className="text-sm leading-relaxed text-fg-muted sm:text-[15px]"
              style={{ fontFamily: "var(--font-tech), ui-sans-serif, system-ui" }}
            >
              {copy.body}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="si-cards mt-24 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          {CARDS.map((c) => (
            // Plain <a>, not next/link — these point at the retro
            // homepage's own anchors and must escape the /normal-mode
            // basePath next/link would otherwise prepend. When shown inside
            // the retro site's iframe overlay, hand off via postMessage
            // instead so the retro page isn't loaded a second time nested
            // inside the iframe.
            <a
              key={c.title}
              href={c.href}
              onClick={(e) => {
                const hash = c.href.includes("#") ? "#" + c.href.split("#")[1] : undefined;
                if (goToRetroMode(hash)) e.preventDefault();
              }}
              className="si-card group relative flex h-[270px] w-[238px] flex-col rounded-[20px] bg-white text-bg shadow-[0_24px_50px_-22px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div className="px-5 pt-5">
                <h3
                  className="text-[15px] font-semibold tracking-tight text-bg"
                  style={{
                    fontFamily: "var(--font-tech), ui-sans-serif, system-ui",
                  }}
                >
                  {c.title}
                </h3>
              </div>

              {/* Logo plate */}
              <div className="relative mx-5 mt-3 flex flex-1 items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-br from-[#f5f6fa] to-[#e6e9f1]">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="200px"
                  className="object-contain p-5"
                />
              </div>

              <div className="flex items-center justify-between px-5 pb-4 pt-4">
                <span
                  className="text-[14px] font-medium text-bg"
                  style={{
                    fontFamily: "var(--font-tech), ui-sans-serif, system-ui",
                  }}
                >
                  {c.cta}
                </span>
                <span
                  aria-hidden
                  className="relative grid size-9 place-items-center overflow-hidden rounded-full text-white"
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(255,255,255,0.35), rgba(255,255,255,0.35)), var(--gradient-brand)",
                    }}
                  />
                  <ArrowUpRight className="relative size-3.5 transition-transform duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Built With */}
      <div className="relative mt-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p
            className="si-partners-label text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.01em] text-fg"
            style={{
              fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui",
            }}
          >
            {copy.builtWith}
          </p>
        </div>
        <div className="mt-7">
          <StackMarquee variant="bare" />
        </div>
      </div>
    </section>
  );
}
