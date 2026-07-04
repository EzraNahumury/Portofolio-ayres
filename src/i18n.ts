// Tiny i18n engine for the AYRES site. Default language: Indonesian.
// - Elements opt in with data-i18n="key"; applyI18n() swaps their textContent.
// - The .lang-btn button(s) toggle id <-> en; choice persists in localStorage.
// - Inline scripts can read window.__i18n and listen for the document-level
//   "langchange" event to refresh strings they own.

export type Lang = "id" | "en";

const STORE_KEY = "ayres-lang";

const STRINGS: Record<string, { id: string; en: string }> = {
  // --- hero backup (no-webgl fallback) ---
  "hero.welcome": { id: "Selamat datang di", en: "Welcome to" },
  "hero.li1": { id: "Jersey Custom", en: "Custom Jerseys" },
  "hero.li2": { id: "Portofolio Digital", en: "Digital Portfolio" },

  // --- nav / menu ---
  "nav.home": { id: "Beranda", en: "Home" },
  "nav.about": { id: "Tentang", en: "About" },
  "nav.projects": { id: "Projects", en: "Projects" },
  "nav.contact": { id: "Kontak", en: "Contact" },
  "nav.scroll": { id: "Scroll ↓", en: "Scroll ↓" },

  // --- about section ---
  "about.title": { id: "Tentang AYRES", en: "About AYRES" },
  "about.p1": {
    id: "AYRES lebih dari sekadar brand apparel custom. AYRES adalah rumah bagi jersey yang dibuat dengan presisi, identitas, dan standar kualitas yang lebih tinggi.",
    en: "AYRES is more than just a custom apparel brand. AYRES is a home for jerseys crafted with precision, identity, and a higher standard of quality.",
  },
  "about.p2": {
    id: "Berbasis di Yogyakarta, AYRES adalah brand jersey custom asli Indonesia yang memadukan desain kreatif, produksi presisi, dan teknologi Pattern Lab milik kami sendiri. Setiap potongan, pola, dan detail dibuat dengan satu tujuan: menciptakan jersey yang tidak hanya terlihat bagus, tapi juga layak dikenakan dengan bangga.",
    en: "Based in Yogyakarta, AYRES is an authentic Indonesian custom jersey brand that blends creative design, precise production, and our own Pattern Lab technology. Every cut, pattern, and detail is built with one purpose: to create jerseys that do not just look good, but feel worth wearing with pride.",
  },
  "about.p3": {
    id: "Di balik setiap produk AYRES ada ekosistem digital yang terus bertumbuh. Dari website dan toko online sampai sistem internal, semuanya dirancang agar proses pemesanan lebih mudah, lebih transparan, dan lebih andal.",
    en: "Behind every AYRES product is a growing digital ecosystem. From websites and online storefronts to internal systems, everything is designed to make the ordering process easier, more transparent, and more reliable.",
  },
  "about.p4": {
    id: "Dengan pengalaman melayani ribuan tim dan memproduksi puluhan ribu jersey, AYRES terus tumbuh sebagai brand yang menjunjung kualitas, deadline terjamin, tanpa minimum order, dan harga yang jelas sejak awal.",
    en: "With experience serving thousands of teams and producing tens of thousands of jerseys, AYRES continues to grow as a brand that stands for quality, guaranteed deadlines, no minimum order, and clear pricing from the very beginning.",
  },
  "about.p5": {
    id: "Website ini adalah portofolio digital AYRES. Di sini kami menampilkan platform, sistem, dan produk web yang kami rancang dan bangun untuk mendukung pertumbuhan brand, memperkuat operasional bisnis, dan memberikan pengalaman yang lebih baik untuk setiap pelanggan AYRES.",
    en: "This website is AYRES’ digital portfolio. Here, we showcase the platforms, systems, and web products we have designed and built to support the brand’s growth, strengthen business operations, and deliver a better experience for every AYRES customer.",
  },
  "stats.teams": { id: "Tim Terlayani", en: "Teams Served" },
  "stats.jerseys": { id: "Jersey Diproduksi", en: "Jerseys Produced" },
  "stats.sports": { id: "Cabang Olahraga", en: "Sports Covered" },
  "stats.minOrder": { id: "Minimum Order", en: "Minimum Order" },
  "feat1.title": { id: "Teknologi Pattern Lab", en: "Pattern Lab Technology" },
  "feat1.text": {
    id: "Pola buatan sendiri untuk fit yang presisi dan konsisten.",
    en: "In-house patterns for a precise, consistent fit.",
  },
  "feat2.title": { id: "Deadline Terjamin", en: "Guaranteed Deadlines" },
  "feat2.text": {
    id: "Timeline jelas, jersey tim Anda tiba tepat waktu.",
    en: "Clear timelines, so your kit arrives right on time.",
  },
  "feat3.title": { id: "Harga Transparan", en: "Transparent Pricing" },
  "feat3.text": {
    id: "Harga jujur di awal — tanpa biaya tersembunyi.",
    en: "Honest prices up front — no setup or hidden fees.",
  },
  "feat4.title": { id: "Asli Indonesia", en: "Authentically Indonesian" },
  "feat4.text": {
    id: "Didesain dan diproduksi di Yogyakarta.",
    en: "Designed and produced in Yogyakarta.",
  },

  // --- projects section ---
  "projects.intro": {
    id: "Kumpulan platform web, tools, dan sistem AI yang kami rancang dan bangun untuk mendukung brand dan bisnis AYRES.",
    en: "A growing stack of web platforms, tools and AI systems we have designed and built to power the AYRES brand and business.",
  },
  "proj.cta": { id: "LIHAT FLOW →", en: "VIEW FLOW →" },
  "more.show": { id: "Tampilkan Lagi", en: "Show More" },
  "more.less": { id: "Sembunyikan", en: "Show Less" },
  "proj.hr.desc": {
    id: "Platform absensi dan manajemen HR dengan check-in digital dan pelaporan.",
    en: "Employee attendance and HR management platform with digital check-in and reporting.",
  },
  "proj.crm.desc": {
    id: "CRM untuk melacak order produksi, customer, dan alur kerja dari permintaan sampai pengiriman.",
    en: "CRM to track production orders, customers and workflow from request to delivery.",
  },
  "proj.ai-medsos.desc": {
    id: "AI agent yang membuat draf, menjadwalkan, dan mengelola konten media sosial secara otomatis.",
    en: "AI agent that drafts, schedules and manages social media content automatically.",
  },
  "proj.ai-marketing.desc": {
    id: "AI agent yang merencanakan campaign, menulis copy, dan mengotomasi marketing lintas kanal.",
    en: "AI agent that plans campaigns, writes copy and automates marketing across channels.",
  },
  "proj.ssb.desc": {
    id: "Sistem manajemen akademi sepak bola — anggota, jadwal, dan pembayaran dalam satu tempat.",
    en: "Management system for a football academy — members, schedules and payments in one place.",
  },
  "proj.chatbot.desc": {
    id: "Chatbot percakapan yang menjawab pertanyaan pelanggan dan menangani order 24/7.",
    en: "Conversational chatbot that answers customer questions and handles orders 24/7.",
  },
  "proj.company-profile.desc": {
    id: "Website company profile yang menampilkan brand, cerita, dan kapabilitas AYRES.",
    en: "Company profile website showcasing the AYRES brand, story and capabilities.",
  },
  "proj.landing-page.desc": {
    id: "Landing page dengan konversi tinggi untuk memperkenalkan produk dan menangkap lead baru.",
    en: "High-converting landing page to introduce products and capture new leads.",
  },
  "proj.online-shop.desc": {
    id: "Storefront e-commerce untuk memesan jersey custom secara online, end to end.",
    en: "E-commerce storefront for ordering custom jerseys online, end to end.",
  },
  "proj.reseller.desc": {
    id: "Portal untuk reseller melihat produk, membuat order, dan melacak penjualan mereka.",
    en: "Portal for resellers to browse products, place orders and track their sales.",
  },
  "proj.invitation.desc": {
    id: "Web builder undangan digital dengan halaman event yang elegan dan mudah dibagikan.",
    en: "Digital invitation web builder with elegant, shareable event pages.",
  },

  // --- contact section ---
  "contact.title": { id: "Kontak", en: "Contact" },
  "contact.location": { id: "LOKASI KAMI", en: "OUR LOCATION" },
  "contact.mapBtn": {
    id: "Buka di Google Maps ↗",
    en: "Open in Google Maps ↗",
  },
  "contact.waLabel": {
    id: "CHAT LANGSUNG VIA WHATSAPP",
    en: "CHAT DIRECTLY VIA WHATSAPP",
  },
  "contact.waCta": { id: "CHAT SEKARANG →", en: "CHAT NOW →" },
  "contact.emailOrder": { id: "EMAIL ORDER", en: "ORDER EMAIL" },
  "contact.emailComplaint": { id: "EMAIL PENGADUAN", en: "COMPLAINTS EMAIL" },
  "contact.hoursLabel": { id: "JAM OPERASIONAL", en: "OPENING HOURS" },
  "contact.hoursText": {
    id: "Senin – Sabtu · 09.00 – 16.30 WIB",
    en: "Mon – Sat · 09.00 – 16.30 WIB (UTC+7)",
  },
  "status.open": { id: "Buka", en: "Open" },
  "status.closed": { id: "Tutup", en: "Closed" },

  // --- footer ---
  "footer.tagline": {
    id: "Rumah bagi Jersey Custom Asli Indonesia. A cut above.",
    en: "Home of Authentically Indonesian Custom Jerseys. A cut above.",
  },
  "footer.menu": { id: "MENU", en: "MENU" },
  "footer.connect": { id: "TERHUBUNG", en: "CONNECT" },
  "footer.shop": { id: "BELANJA", en: "SHOP" },
  "footer.backTop": { id: "Kembali ke atas ↑", en: "Back to top ↑" },
  "footer.rights": {
    id: "© 2026 AYRES. Semua hak dilindungi.",
    en: "© 2026 AYRES. All rights reserved.",
  },

  // --- project detail page ---
  "detail.back": { id: "← Projects", en: "← Projects" },
  "detail.loading": { id: "Memuat flow…", en: "Loading flow…" },
  "detail.kicker": { id: "RINGKASAN WEB FLOW", en: "WEB FLOW OVERVIEW" },
  "detail.flows": { id: "alur", en: "flows" },
  "detail.about": { id: "TENTANG PROJECT", en: "ABOUT THE PROJECT" },
  "detail.diagram": { id: "FLOW DIAGRAM", en: "FLOW DIAGRAM" },
  "detail.expand": { id: "⛶ PERBESAR", en: "⛶ EXPAND" },
  "detail.backBtn": {
    id: "← Kembali ke Projects",
    en: "← Back to Projects",
  },
  "detail.footer": {
    id: "AYRES — portofolio digital",
    en: "AYRES — digital portfolio",
  },
  "detail.nfTitle": { id: "Flow tidak ditemukan", en: "Flow not found" },
  "detail.nfMsg": {
    id: "Tidak ada dokumen flow untuk project ini. Kembali dan pilih project lain.",
    en: "No flow doc for this project. Head back and pick a project.",
  },
};

let lang: Lang = "id";
try {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved === "en" || saved === "id") lang = saved;
} catch {
  /* storage unavailable — stick with the default */
}

export function getLang(): Lang {
  return lang;
}

export function t(key: string): string {
  const entry = STRINGS[key];
  return entry ? entry[lang] : key;
}

export function applyI18n(): void {
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")!;
    if (STRINGS[key]) el.textContent = t(key);
  });
  document
    .querySelectorAll<HTMLElement>(".lang-btn-label")
    .forEach((el) => (el.textContent = lang.toUpperCase()));
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

export function setLang(next: Lang): void {
  lang = next;
  try {
    localStorage.setItem(STORE_KEY, next);
  } catch {
    /* non-fatal */
  }
  applyI18n();
}

export function initI18n(): void {
  // Inline scripts (outside the module graph) read this to localize the
  // strings they own, and re-run on the "langchange" document event.
  // Set it before the first applyI18n() so the first event already sees it.
  (window as any).__i18n = {
    t,
    get lang() {
      return lang;
    },
  };
  document.querySelectorAll<HTMLElement>(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(lang === "id" ? "en" : "id"));
  });
  applyI18n();
}
