"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, MessageCircle, MapPin, Mail } from "lucide-react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { hero } from "@/lib/content";

const cards = [
  {
    icon: MessageCircle,
    title: "Chat on WhatsApp",
    body: "0878-1831-0416 — reach us directly for order questions or a quick quote.",
    href: hero.openApp.href,
  },
  {
    icon: MapPin,
    title: "Visit Our Workshop",
    body: "Jl. Wonocatur No.427, Jeruklegi, Banguntapan, D.I. Yogyakarta.",
    href: "https://www.google.com/maps?ll=-7.806717,110.405682&z=17&t=m&hl=en&gl=ID&mapclient=embed&cid=7178737846643624676",
  },
  {
    icon: Mail,
    title: "Order & Support",
    body: "order@ayresapparel.com for new orders, pengaduan@ayresapparel.com for complaints. Open Mon–Sat, 09.00–16.30 WIB.",
    href: "mailto:order@ayresapparel.com",
  },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (!ref.current) return;

      gsap.fromTo(
        ".contact-char",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".contact-cta",
        { opacity: 0, y: 22, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        }
      );

      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 60, scale: 0.94, rotateX: 8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          stagger: 0.12,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".contact-card-title",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          delay: 0.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".contact-card-body",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          delay: 0.55,
          ease: "expo.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 85%" },
        }
      );

      const cardEls = gsap.utils.toArray<HTMLElement>(".contact-card");
      cardEls.forEach((card, i) => {
        gsap.to(card, {
          y: -10 - i * 4,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && ref.current?.contains(st.trigger as Element)) {
            st.kill();
          }
        });
      };
    },
    { scope: ref }
  );

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-white pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24"
    >
      <div className="mx-auto max-w-[1320px] px-6 sm:px-10 lg:px-16">
        <h2
          className="text-center text-[clamp(2rem,5vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#0a0a0a]"
          style={{
            fontFamily:
              "var(--font-tech), ui-sans-serif, system-ui, -apple-system",
          }}
        >
          <span className="inline-flex overflow-hidden align-baseline">
            {"Contact".split("").map((ch, i) => (
              <span
                key={i}
                className="contact-char inline-block will-change-transform"
              >
                {ch}
              </span>
            ))}
          </span>
        </h2>

        <div className="contact-cta mt-8 flex justify-center">
          <Link
            href={hero.openApp.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-5 pr-1.5 ring-1 ring-[#0a0a0a]/10 text-[#0a0a0a] shadow-sm transition-all hover:shadow-md hover:ring-[#0a0a0a]/20"
          >
            <span className="text-sm font-medium">{hero.openApp.label}</span>
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-full text-white shadow-[0_-4px_8px_rgba(255,255,255,0.25)_inset]"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </div>

        <div className="contact-grid mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-14">
          {cards.map((c) => {
            const Icon = c.icon;
            const isExternal = c.href.startsWith("http");
            return (
              <a
                key={c.title}
                href={c.href}
                {...(isExternal
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="contact-card group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-[#0a0a0a]/[0.04] p-6 pb-16 will-change-transform transition-colors hover:bg-[#0a0a0a]/[0.06] sm:p-7 sm:pb-20 [transform-style:preserve-3d]"
              >
                <div className="grid size-10 place-items-center rounded-full bg-[#0a0a0a] text-white">
                  <Icon className="size-4" strokeWidth={1.6} />
                </div>

                <h3
                  className="contact-card-title mt-6 text-base font-semibold leading-snug text-[#0a0a0a] sm:text-lg"
                  style={{
                    fontFamily: "var(--font-tech), ui-sans-serif, system-ui",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  className="contact-card-body mt-3 text-sm leading-relaxed text-[#0a0a0a]/60"
                  style={{
                    fontFamily: "var(--font-tech), ui-sans-serif, system-ui",
                  }}
                >
                  {c.body}
                </p>

                <div className="absolute bottom-5 right-5 grid size-9 place-items-center rounded-full bg-white text-[#0a0a0a] ring-1 ring-[#0a0a0a]/10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight className="size-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
