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
    id: "AYRES adalah brand sportswear asli Indonesia. Tapi yang membuat kami berbeda bukan cuma jerseynya — melainkan cara kami menjualnya: hampir seluruh proses penjualan AYRES berjalan di atas aplikasi web yang kami bangun sendiri.",
    en: "AYRES is an authentic Indonesian sportswear brand. But what sets us apart isn't just the jerseys — it's how we sell them: nearly every part of AYRES's sales runs on web apps we built ourselves.",
  },
  "about.p2": {
    id: "Berbasis di Yogyakarta, kami memproduksi jersey custom dengan teknologi Pattern Lab milik sendiri. Pengalaman melayani ribuan tim mengajarkan satu hal: produk bagus terjual lebih cepat dengan software yang bagus.",
    en: "Based in Yogyakarta, we produce custom jerseys with our own Pattern Lab technology. Serving thousands of teams taught us one thing: great products sell faster with great software.",
  },
  "about.p3": {
    id: "Maka kami membangunnya sendiri — AI agent yang menjalankan campaign marketing dan konten media sosial, toko online untuk order jersey custom, chatbot yang melayani pelanggan 24/7, sampai CRM yang mengawal produksi dari permintaan hingga pengiriman.",
    en: "So we built our own — AI agents that run marketing campaigns and social media content, an online shop for custom jersey orders, a chatbot that serves customers 24/7, and a CRM that guards production from request to delivery.",
  },
  "about.p4": {
    id: "Hasilnya: lebih dari 2.600 tim terlayani dan puluhan ribu jersey terkirim — ditemukan lewat campaign digital kami, memesan lewat web kami, dan kembali lagi karena kualitas serta deadline yang terjamin.",
    en: "The result: more than 2,600 teams served and tens of thousands of jerseys shipped — discovered through our digital campaigns, ordered through our web, and coming back thanks to guaranteed quality and deadlines.",
  },
  "about.p5": {
    id: "Website ini adalah etalase dari ekosistem web tersebut. Jelajahi platform, sistem, dan AI agent yang kami rancang dan bangun sendiri untuk mengoptimalkan penjualan AYRES — dan lihat bagaimana bisnis sportswear bisa berjalan sepenuhnya di atas web.",
    en: "This website is the showroom for that web ecosystem. Explore the platforms, systems and AI agents we designed and built ourselves to optimize AYRES's sales — and see how a sportswear business can run entirely on the web.",
  },
  "stats.teams": { id: "Tim Terlayani", en: "Teams Served" },
  "stats.jerseys": { id: "Jersey Diproduksi", en: "Jerseys Produced" },
  "stats.sports": { id: "Cabang Olahraga", en: "Sports Covered" },
  "stats.minOrder": { id: "Minimum Order", en: "Minimum Order" },
  "feat1.title": { id: "AI Marketing Agents", en: "AI Marketing Agents" },
  "feat1.text": {
    id: "Campaign dan konten media sosial dijalankan AI agent buatan kami.",
    en: "Campaigns and social content run by AI agents we built.",
  },
  "feat2.title": { id: "Online Shop 24/7", en: "Online Shop 24/7" },
  "feat2.text": {
    id: "Order jersey custom kapan pun lewat web shop kami — tanpa antre admin.",
    en: "Order custom jerseys anytime on our web shop — no waiting on an admin.",
  },
  "feat3.title": { id: "Chatbot CS 24/7", en: "24/7 Support Chatbot" },
  "feat3.text": {
    id: "Chatbot kami menjawab pertanyaan dan menangani order, bahkan jam 2 pagi.",
    en: "Our chatbot answers questions and takes orders, even at 2 a.m.",
  },
  "feat4.title": { id: "CRM Produksi", en: "Production CRM" },
  "feat4.text": {
    id: "Setiap order terlacak dari permintaan sampai pengiriman — deadline terjamin.",
    en: "Every order tracked from request to delivery — deadlines guaranteed.",
  },

  // --- projects section ---
  "projects.intro": {
    id: "Inilah aplikasi-aplikasi yang menjalankan penjualan AYRES — platform web, tools, dan sistem AI yang kami rancang dan bangun sendiri.",
    en: "These are the apps that run AYRES's sales — web platforms, tools and AI systems we designed and built ourselves.",
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
    id: "Sportswear Indonesia, dijual dan di-scale lewat aplikasi web buatan kami sendiri. A cut above.",
    en: "Indonesian sportswear, sold and scaled by web apps we built ourselves. A cut above.",
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
  "detail.loading": { id: "Memuat…", en: "Loading…" },
  "detail.problem": { id: "MASALAHNYA", en: "THE PROBLEM" },
  "detail.problemTitle": {
    id: "Yang bikin repot selama ini",
    en: "What kept going wrong",
  },
  "detail.solution": { id: "SOLUSINYA", en: "THE SOLUTION" },
  "detail.solutionTitle": {
    id: "Cara kami menjawabnya",
    en: "How we answered it",
  },
  "detail.live": { id: "SIMULASI LIVE — gerakkan kursor", en: "LIVE DEMO — move your cursor" },
  "detail.how": { id: "CARA KERJANYA", en: "HOW IT WORKS" },
  "detail.howTitle": {
    id: "Dari awal sampai selesai",
    en: "From start to finish",
  },
  "detail.edge": { id: "YANG BIKIN BEDA", en: "WHAT SETS IT APART" },
  "detail.edgeTitle": {
    id: "Bukan template pasaran",
    en: "Not an off-the-shelf template",
  },
  "detail.impact": { id: "DAMPAKNYA", en: "THE IMPACT" },
  "detail.impactTitle": {
    id: "Yang berubah untuk bisnis",
    en: "What changes for the business",
  },
  "detail.ctaLine": {
    id: "Mau sistem seperti ini untuk bisnis Anda?",
    en: "Want a system like this for your business?",
  },
  "detail.ctaBtn": { id: "Ngobrol via WhatsApp", en: "Chat on WhatsApp" },
  "detail.backBtn": {
    id: "← Kembali ke Projects",
    en: "← Back to Projects",
  },
  "detail.footer": {
    id: "AYRES — portofolio digital",
    en: "AYRES — digital portfolio",
  },
  "detail.nfTitle": { id: "Project tidak ditemukan", en: "Project not found" },
  "detail.nfMsg": {
    id: "Tidak ada data untuk project ini. Kembali dan pilih project lain.",
    en: "No data for this project. Head back and pick another.",
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
