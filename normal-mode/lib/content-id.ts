// Indonesian copy for Normal Mode — mirrors the shapes in content.ts for
// every field the sections actually render. Product names stay as-is.

export const navId = {
  brand: "AYRES",
  links: [
    { label: "Alur Kerja", href: "#how" },
    { label: "Fitur", href: "#capabilities" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontak", href: "#contact" },
  ],
  cta: { label: "Retro Mode", href: "/" },
};

export const heroId = {
  headline: [
    [
      { text: "Sportswear", tone: "muted" },
      { text: "Indonesia.", tone: "strong" },
    ],
    [{ text: "Ditenagai Web.", tone: "strong" }],
    [{ text: "Setiap penjualan berjalan di", tone: "muted" }],
    [{ text: "aplikasi buatan kami sendiri.", tone: "strong" }],
  ] as const,
  description:
    "AYRES adalah brand sportswear Indonesia dari Yogyakarta — dan seluruh cara kami berjualan berjalan di atas aplikasi web buatan sendiri: AI marketing agent, toko online, chatbot 24/7, dan CRM produksi, semuanya bekerja mengubah pengunjung jadi order.",
  openApp: { label: "Chat via WhatsApp", href: "https://wa.me/6287818310416" },
};

export const howAuralisId = {
  title: "Cara AYRES Mengoptimalkan Penjualan",
  cards: [
    {
      index: "01",
      name: "Satu Web, Semua Kanal",
      body:
        "Enam aplikasi buatan kami menjalankan funnel dari ujung ke ujung — AI agent iklan dan sosial menarik pengunjung, toko online dan chatbot menutup penjualan, CRM dan alur pengiriman mengantarkannya. Satu order bisa berjalan dari klik pertama sampai depan pintu tanpa satu pun proses manual.",
    },
    {
      index: "02",
      name: "Pengunjung Jadi Pelanggan Tetap",
      body:
        "Semua kanal mengisi satu pipeline: campaign mendatangkan pengunjung, toko dan chatbot mengubahnya jadi order, dan pengiriman tepat waktu mengubah order jadi pelanggan tetap. Karena seluruh stack kami bangun sendiri, setiap langkah perjalanan itu bisa kami ukur — dan optimalkan.",
    },
  ],
};

export const whatYouCanDoId = {
  title: "Aplikasi di Balik Penjualan Kami",
  showMoreLabel: "Tampilkan Lagi",
  showLessLabel: "Sembunyikan",
  visibleCount: 6,
  bodies: {
    hr: "Platform absensi dan manajemen HR dengan check-in digital dan pelaporan.",
    crm: "CRM untuk melacak order produksi, customer, dan alur kerja dari permintaan sampai pengiriman.",
    "ai-medsos":
      "AI agent yang membuat draf, menjadwalkan, dan mengelola konten media sosial secara otomatis.",
    "ai-marketing":
      "AI agent yang merencanakan campaign, menulis copy, dan mengotomasi marketing lintas kanal.",
    ssb: "Sistem manajemen akademi sepak bola — anggota, jadwal, dan pembayaran dalam satu tempat.",
    chatbot:
      "Chatbot percakapan yang menjawab pertanyaan pelanggan dan menangani order 24/7.",
    "company-profile":
      "Website company profile yang menampilkan brand, cerita, dan kapabilitas AYRES.",
    "landing-page":
      "Landing page dengan konversi tinggi untuk memperkenalkan produk dan menangkap lead baru.",
    "online-shop":
      "Storefront e-commerce untuk memesan jersey custom secara online, end to end.",
    reseller:
      "Portal untuk reseller melihat produk, membuat order, dan melacak penjualan mereka.",
    invitation:
      "Web builder undangan digital dengan halaman event yang elegan dan mudah dibagikan.",
  } as Record<string, string>,
};

export const faqId = {
  title: "Pertanyaan yang Sering Diajukan",
  hint: "Jawaban tentang bagaimana AYRES memakai teknologi untuk mendorong penjualan dan produktivitas.",
  community: {
    label: "Masih Ada Pertanyaan?\nNgobrol Dengan Kami.",
    href: "https://wa.me/6287818310416",
  },
  items: [
    {
      q: "Bagaimana AYRES memakai teknologi untuk menumbuhkan penjualan?",
      a: "Selain memproduksi jersey, AYRES membangun tools digitalnya sendiri — AI agent untuk marketing dan media sosial, website perusahaan dan toko online, serta chatbot customer service — semuanya dirancang untuk mengubah lebih banyak pengunjung jadi order.",
    },
    {
      q: "Marketing AI Agent itu sebenarnya mengerjakan apa?",
      a: "Ia merencanakan campaign, menulis copy iklan dan promo, dan mengotomasi marketing lintas kanal — sehingga tim menghabiskan lebih sedikit waktu untuk pekerjaan konten manual dan lebih banyak waktu untuk closing order.",
    },
    {
      q: "Bagaimana Social Media AI Agent membantu urusan konten?",
      a: "Ia membuat draf, menjadwalkan, dan mengelola konten media sosial secara otomatis — menjaga Instagram dan TikTok AYRES tetap aktif dan konsisten tanpa tim konten full-time.",
    },
    {
      q: "Apa chatbot-nya benar-benar bisa menangani percakapan penjualan?",
      a: "Bisa — Customer Service Chatbot kami menjawab pertanyaan produk dan menangani order 24/7, jadi lead tidak pernah dingin hanya karena datang di luar jam kerja.",
    },
    {
      q: "Bagaimana tools internal seperti CRM dan sistem HR menaikkan produktivitas?",
      a: "Production CRM melacak setiap order dari permintaan sampai pengiriman, dan HR Attendance System mengotomasi absensi, payroll, dan approval — memangkas kerja admin manual di balik setiap penjualan.",
    },
    {
      q: "Apakah website dan toko online-nya menghasilkan lead sendiri?",
      a: "Ya — landing page dan AYRES Online Shop dibangun untuk menangkap lead dan order secara langsung, dengan CTA WhatsApp yang mengubah pengunjung jadi percakapan tanpa perlu sales standby 24/7.",
    },
    {
      q: "Apakah AYRES membangun sistem seperti ini untuk bisnis lain juga?",
      a: "Tim digital kami merancang dan membangun platform sejenis — CRM, AI agent, chatbot, e-commerce — sebagai bagian dari ekosistem digital yang terus tumbuh, dan bisa Anda jelajahi di bagian Projects.",
    },
  ],
};
