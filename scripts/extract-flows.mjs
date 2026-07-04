// Extracts ONLY the "web flow" sections (+ their mermaid diagrams) from each
// per-project doc in /detail-project and writes a compact JSON the detail page
// consumes. Tech-stack / DB / deployment / API sections are intentionally left
// out — we only keep the big-picture flow of each web app.
//
// Run: node scripts/extract-flows.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "detail-project");
const OUT = join(ROOT, "src", "project-detail", "flows.json");

// include/exclude match a heading by *substring* (robust to em-dashes etc).
const PROJECTS = [
  {
    slug: "hr",
    file: "hr.md",
    title: "HR Attendance System",
    tag: "HR",
    blurb:
      "Employee attendance and HR management platform with digital check-in and reporting.",
    desc: "Web HR untuk AvA Group — platform absensi dan manajemen karyawan. Karyawan melakukan presensi masuk/pulang secara digital (dengan izin lokasi), mengajukan lembur dan pinjaman; admin mengelola payroll, slip gaji, dan laporan dari satu dashboard dengan alur approval berjenjang.",
    descEn: "HR web app for AvA Group — an attendance and employee management platform. Employees clock in/out digitally (with location permission) and request overtime and loans; admins manage payroll, payslips and reports from one dashboard with multi-level approvals.",
    include: ["Peta Halaman (Sitemap", "Alur Utama"],
  },
  {
    slug: "crm",
    file: "crm.md",
    title: "Production CRM",
    tag: "CRM",
    blurb:
      "CRM to track production orders, customers and workflow from request to delivery.",
    desc: "Web CRM produksi apparel AYRES — melacak order dari permintaan masuk sampai pengiriman. Order dikonfirmasi menjadi Work Order, berjalan melewati tahap-tahap produksi dengan flow 1-klik, dan pelanggan bisa memantau progres lewat halaman tracking publik.",
    descEn: "Production CRM for AYRES apparel — tracks orders from incoming request to delivery. Confirmed orders become Work Orders, move through the production stages with a 1-click flow, and customers can follow progress on a public tracking page.",
    include: ["Flow Diagrams"],
  },
  {
    slug: "ai-medsos",
    file: "ai_medsos.md",
    title: "Social Media AI Agent",
    tag: "AI AGENT",
    blurb:
      "AI agent that drafts, schedules and manages social media content automatically.",
    desc: "AI command center untuk Instagram — menghubungkan akun brand via OAuth Meta, menyinkronkan profil, media, insight dan komentar, menerima webhook real-time, lalu AI agent membantu membalas serta mengelola konten dari satu dashboard.",
    descEn: "AI command center for Instagram — connects brand accounts via Meta OAuth, syncs profile, media, insights and comments, receives real-time webhooks, and an AI agent helps reply and manage content from a single dashboard.",
    include: ["Core flows"],
  },
  {
    slug: "ai-marketing",
    file: "ai_marketing.md",
    title: "Marketing AI Agent",
    tag: "AI AGENT",
    blurb:
      "AI agent that plans campaigns, writes copy and automates marketing across channels.",
    desc: "Web AI agent untuk kampanye marketing — user memilih brand dan tujuan, sistem men-generate campaign end-to-end (ide, copy, jadwal) memakai LLM, memberi skor secara deterministik, dan menyimpan hasilnya sebagai report siap pakai.",
    descEn: "AI marketing campaign agent — pick a brand and a goal, the system generates campaigns end-to-end (ideas, copy, schedule) using an LLM, scores them deterministically, and saves the result as a ready-to-use report.",
    include: ["Alur Kerja Lengkap"],
    exclude: ["Skema Data (Entity Relationship"],
  },
  {
    slug: "ssb",
    file: "web_ssb.md",
    title: "SSB Management",
    tag: "MANAGEMENT",
    blurb:
      "Management system for a football academy — members, schedules and payments in one place.",
    desc: "Web manajemen akademi sepak bola (SSB) — admin pusat dan admin akademi mengelola data peserta, kelompok umur, jadwal, billing dan pembayaran, sampai laporan keuangan yang bisa diekspor ke PDF; pelatih punya akses sesuai perannya.",
    descEn: "Football academy (SSB) management web app — head-office and academy admins manage members, age groups, schedules, billing and payments, plus financial reports exportable to PDF; coaches get role-scoped access.",
    include: ["Arsitektur & Alur Sistem"],
    exclude: ["Relasi Database (ERD)"],
  },
  {
    slug: "chatbot",
    file: "chatbot.md",
    title: "Customer Service Chatbot",
    tag: "CHATBOT",
    blurb:
      "Conversational chatbot that answers customer questions and handles orders 24/7.",
    desc: "Chatbot WhatsApp untuk Ayres Apparel — menjawab pertanyaan pelanggan 24/7 dengan mesin rule-based plus fallback AI, memandu alur order dan DP desain end-to-end, dan mengeskalasi nego harga ke admin manusia bila perlu.",
    descEn: "WhatsApp chatbot for Ayres Apparel — answers customer questions 24/7 with a rule-based engine plus an AI fallback, guides the order and design down-payment flow end-to-end, and escalates price negotiations to a human admin when needed.",
    include: [
      "Alur Pemrosesan Pesan Masuk",
      "Alur Order & DP Desain",
      "Eskalasi Nego Harga",
      "Siklus Hidup Koneksi WhatsApp",
      "Manajemen State",
    ],
  },
  {
    slug: "company-profile",
    file: "web_profileperusahaan.md",
    title: "Company Profile",
    tag: "PROFILE",
    blurb:
      "Company profile website showcasing the AYRES brand, story and capabilities.",
    desc: "Website profil perusahaan Ayres Apparel — memperkenalkan brand, katalog produk, berita, dan kanal kontak/order dalam dua bahasa (i18n), dengan konten yang dikelola lewat file konten terstruktur.",
    descEn: "Ayres Apparel company profile website — introduces the brand, product catalog, news and contact/order channels in two languages (i18n), with content managed through structured content files.",
    include: [
      "Diagram Flow Halaman",
      "Diagram Flow Data Konten",
      "Flow Request dan Rendering",
      "Flow Bahasa",
      "Flow Beranda",
      "Flow Product",
      "Flow Order",
      "Flow Company",
      "Flow Contact",
      "Flow News",
    ],
  },
  {
    slug: "landing-page",
    file: "landingpage.md",
    title: "Company Landing Page",
    tag: "LANDING",
    blurb:
      "High-converting landing page to introduce products and capture new leads.",
    desc: "Landing page Ayres Apparel — satu halaman untuk memperkenalkan produk, katalog, review dan partner, dengan CTA WhatsApp untuk menangkap lead baru secepat mungkin.",
    descEn: "Ayres Apparel landing page — a single page introducing products, catalog, reviews and partners, with a WhatsApp CTA to capture new leads as fast as possible.",
    include: [
      "Flow Request dan Render",
      "Flow Komponen Landing Page",
      "Flow Konten dan Aset",
      "Flow Interaksi User",
      "Flow Client-Side State",
    ],
  },
  {
    slug: "online-shop",
    file: "onlineshop.md",
    title: "AYRES Online Shop",
    tag: "E-COMMERCE",
    blurb:
      "E-commerce storefront for ordering custom jerseys online, end to end.",
    desc: "Toko online AYRES — pelanggan memilih jersey custom, checkout dengan ongkir JNE, membayar lalu konfirmasi 1-klik; admin memverifikasi pembayaran, mengelola produk dan promosi, dan memproses order lewat state machine sampai terkirim.",
    descEn: "AYRES online store — customers pick custom jerseys, check out with JNE shipping rates, pay and confirm in one click; admins verify payments, manage products and promotions, and process orders through a state machine until delivered.",
    include: ["Diagram Flow Lengkap"],
  },
  {
    slug: "reseller",
    file: "reseller.md",
    title: "Reseller Web",
    tag: "RESELLER",
    blurb:
      "Portal for resellers to browse products, place orders and track their sales.",
    desc: "Web admin reseller Ayres — data reseller tersimpan di Google Sheets via Apps Script; admin login untuk melihat dan mengelola data reseller (CRUD) serta meng-assign benefit, semuanya dari dashboard Next.js.",
    descEn: "Ayres reseller admin web — reseller data lives in Google Sheets via Apps Script; admins sign in to view and manage reseller data (CRUD) and assign benefits, all from a Next.js dashboard.",
    include: [
      "Alur Data End-to-End",
      "Alur Autentikasi Admin",
      "Alur Halaman Publik",
      "Alur Dashboard — Data Reseller",
      "Alur Dashboard — Menu Admin",
    ],
  },
  {
    slug: "invitation",
    file: "invitation.md",
    title: "Invitation Web",
    tag: "INVITATION",
    blurb:
      "Digital invitation web builder with elegant, shareable event pages.",
    desc: "Web undangan digital grand opening Ayres Apparel Solo — tamu membuka undangan, mengisi RSVP yang tercatat otomatis ke Google Sheets, dan tamu yang hadir menerima email undangan secara otomatis.",
    descEn: "Digital invitation site for the Ayres Apparel Solo grand opening — guests open the invite, fill in an RSVP that is automatically recorded to Google Sheets, and attending guests automatically receive an email invitation.",
    include: ["Architecture", "Request Flow"],
  },
];

/** @returns {{level:number,title:string}|null} */
function parseHeading(line) {
  const m = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!m) return null;
  return { level: m[1].length, title: m[2].trim() };
}

function matchesAny(title, needles) {
  return (needles || []).some((n) => title.includes(n));
}

function extract(project) {
  const raw = readFileSync(join(SRC, project.file), "utf8");
  const lines = raw.split(/\r?\n/);

  const sections = [];
  let inFence = false;
  let capturing = null; // { title, level, body: [] }
  let skipUntilLevel = null; // number|null — dropping an excluded sub-tree

  const flush = () => {
    if (capturing) {
      // trim trailing blank lines
      let body = capturing.body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
      sections.push({ title: capturing.title, body });
      capturing = null;
    }
  };

  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const heading = inFence ? null : parseHeading(line);

    if (heading) {
      // Are we dropping an excluded sub-tree?
      if (skipUntilLevel !== null) {
        if (heading.level <= skipUntilLevel) skipUntilLevel = null;
        else continue; // still inside excluded sub-tree
      }

      if (capturing) {
        // End current section when a heading of same/higher rank appears.
        if (heading.level <= capturing.level) flush();
      }

      // Start a new excluded sub-tree?
      if (capturing && matchesAny(heading.title, project.exclude)) {
        skipUntilLevel = heading.level;
        continue;
      }

      // Start a new captured section?
      if (!capturing && matchesAny(heading.title, project.include)) {
        capturing = { title: heading.title, level: heading.level, body: [] };
        continue; // heading stored as title, not in body
      }

      if (capturing) capturing.body.push(line);
      continue;
    }

    if (skipUntilLevel !== null) continue;
    if (capturing) capturing.body.push(line);
  }
  flush();

  return {
    title: project.title,
    tag: project.tag,
    blurb: project.blurb,
    desc: project.desc,
    descEn: project.descEn,
    sections: sections.filter((s) => s.body.trim().length),
  };
}

const out = {};
for (const p of PROJECTS) {
  out[p.slug] = extract(p);
  const n = out[p.slug].sections.length;
  const diag = out[p.slug].sections.reduce(
    (a, s) => a + (s.body.match(/```mermaid/g) || []).length,
    0,
  );
  console.log(`${p.slug.padEnd(16)} ${n} sections, ${diag} diagrams`);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
console.log(`\nWrote ${OUT}`);
