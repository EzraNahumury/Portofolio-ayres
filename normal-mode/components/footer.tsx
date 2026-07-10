"use client";

import { ArrowUp } from "lucide-react";
import { useLang } from "@/lib/lang";

const MENUS = {
  en: [
    { label: "Home", href: "#top" },
    { label: "How It Works", href: "#how" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ],
  id: [
    { label: "Beranda", href: "#top" },
    { label: "Cara Kerja", href: "#how" },
    { label: "Teknologi", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ],
};

const FOOT_COPY = {
  en: {
    tagline:
      "Indonesian sportswear, sold and scaled by web apps we built ourselves. A cut above.",
    menu: "Menu",
    connect: "Connect",
    shop: "Shop",
    rights: "© 2026 AYRES. All rights reserved.",
  },
  id: {
    tagline:
      "Sportswear Indonesia, dijual dan di-scale lewat aplikasi web buatan kami sendiri. A cut above.",
    menu: "Menu",
    connect: "Terhubung",
    shop: "Belanja",
    rights: "© 2026 AYRES. Semua hak dilindungi.",
  },
};

const connect = [
  { label: "Instagram", href: "https://instagram.com/ayresapparel" },
  { label: "TikTok", href: "https://tiktok.com/@ayresapparel" },
  { label: "WhatsApp", href: "https://wa.me/6282226508883" },
  { label: "Email", href: "mailto:admin@ayresapparel.com" },
];

const shop = [
  { label: "Shopee", href: "https://shopee.co.id/ayresapparel" },
  { label: "Tokopedia", href: "https://www.tokopedia.com/ayresapparel" },
];

function backToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-dim"
        style={{ fontFamily: "var(--font-tech), ui-sans-serif, system-ui" }}
      >
        {title}
      </span>
      <ul
        className="flex flex-col gap-3"
        style={{ fontFamily: "var(--font-tech), ui-sans-serif, system-ui" }}
      >
        {links.map((link) => {
          const external = /^https?:|^mailto:/.test(link.href);
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="text-[15px] font-semibold uppercase tracking-[0.08em] text-fg transition-colors hover:text-fg-muted"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const { lang } = useLang();
  const menu = MENUS[lang];
  const copy = FOOT_COPY[lang];
  return (
    <footer className="relative isolate overflow-hidden bg-bg pt-20 sm:pt-24">
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-start">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/normal-mode/ayres-mark.png"
                alt="AYRES"
                className="h-7 w-auto"
              />
              <span
                className="text-sm font-semibold tracking-wide text-fg"
                style={{
                  fontFamily:
                    "var(--font-geist-sans), ui-sans-serif, system-ui",
                }}
              >
                AYRES
              </span>
            </div>
            <p
              className="max-w-[220px] text-[13px] leading-relaxed text-fg-dim"
              style={{ fontFamily: "var(--font-tech), ui-sans-serif, system-ui" }}
            >
              {copy.tagline}
            </p>
          </div>

          <FooterCol title={copy.menu} links={menu} />
          <FooterCol title={copy.connect} links={connect} />
          <FooterCol title={copy.shop} links={shop} />

          {/* Back to top button */}
          <button
            type="button"
            onClick={backToTop}
            className="group flex h-[150px] w-full items-center justify-center rounded-[24px] border border-border bg-white/[0.02] text-fg transition-colors hover:bg-white/[0.05] lg:w-[200px]"
            style={{
              fontFamily:
                "var(--font-geist-sans), ui-sans-serif, system-ui",
            }}
          >
            <span className="flex items-center gap-3 text-lg font-medium">
              <ArrowUp className="size-5 transition-transform group-hover:-translate-y-0.5" />
              {lang === "en" ? "Back to top" : "Kembali ke atas"}
            </span>
          </button>
        </div>

        {/* Big watermark */}
        <div
          aria-hidden
          className="pointer-events-none mt-12 select-none overflow-hidden text-center"
        >
          <span
            className="block bg-gradient-to-b from-white/[0.06] to-white/[0.01] bg-clip-text text-transparent"
            style={{
              fontFamily:
                "var(--font-geist-sans), ui-sans-serif, system-ui",
              fontSize: "clamp(4rem, 16vw, 14rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
          >
            AYRES
          </span>
        </div>

        {/* Copyright bottom bar */}
        <div className="relative mt-6 flex flex-col items-start justify-between gap-2 border-t border-border/60 py-6 text-xs text-fg-dim sm:flex-row sm:items-center">
          <p
            style={{
              fontFamily:
                "var(--font-tech), ui-sans-serif, system-ui",
            }}
          >
            {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
