// Marketing-first content for the per-project detail pages.
// Written for customers, not engineers — every string exists in both
// languages and is picked at render time via the site-wide toggle.

export type LStr = { id: string; en: string };

export type Step = { title: LStr; body: LStr };
export type Feature = { title: LStr; body: LStr };

export type Project = {
  title: string;
  tag: string;
  image: string; // screenshot under /project/
  tagline: LStr;
  problem: LStr;
  solution: LStr;
  intro: LStr;
  steps: Step[];
  features: Feature[];
  results: LStr[];
};

const L = (id: string, en: string): LStr => ({ id, en });

export const PROJECTS: Record<string, Project> = {
  hr: {
    title: "HR Attendance System",
    tag: "HR",
    image: "/project/HR.png",
    tagline: L(
      "Absen dari HP, gaji beres otomatis.",
      "Clock in from a phone, payroll done automatically.",
    ),
    problem: L(
      "Absensi dicatat di kertas atau grup chat, lalu direkap manual di akhir bulan. Salah hitung lembur, titip absen, dan slip gaji yang telat jadi langganan — dan makin banyak karyawan, makin parah. HRD habis waktu untuk pekerjaan yang seharusnya otomatis.",
      "Attendance lives on paper or in chat groups, then gets recapped by hand at month end. Miscounted overtime, buddy punching and late payslips become routine — and every new hire makes it worse. HR burns days on work that should run itself.",
    ),
    solution: L(
      "Satu web HR yang memegang seluruh siklus: karyawan absen dari HP dengan verifikasi lokasi, pengajuan lembur/cuti/pinjaman masuk lewat form, atasan menyetujui dari dashboard, dan di akhir periode payroll plus slip gaji terhitung otomatis dari data yang sama — tanpa rekap ulang.",
      "One HR web app owns the whole cycle: staff clock in from their phone with location checks, overtime/leave/loan requests come in through forms, managers approve from a dashboard, and at period close payroll and payslips compute from the same data — no re-recapping.",
    ),
    intro: L(
      "Rekap absen manual itu makan waktu — apalagi kalau karyawan tersebar di beberapa lokasi. Web HR ini merapikan semuanya, dari jam masuk sampai slip gaji.",
      "Manual attendance recaps eat entire days — worse when staff are spread across locations. This HR web app tidies the whole chain, from clock-in to payslip.",
    ),
    steps: [
      {
        title: L("Check-in digital", "Digital check-in"),
        body: L(
          "Karyawan absen dari HP, lengkap dengan lokasi. Tidak bisa titip absen.",
          "Employees clock in from their phone, location included. No buddy punching.",
        ),
      },
      {
        title: L("Ajukan langsung", "Request in one place"),
        body: L(
          "Lembur, cuti, dan pinjaman diajukan lewat web — tanpa kertas, tanpa hilang.",
          "Overtime, leave and loans are requested on the web — no paper, nothing lost.",
        ),
      },
      {
        title: L("Approval berjenjang", "Layered approvals"),
        body: L(
          "Atasan tinggal setujui dari dashboard. Siapa menyetujui apa, semua tercatat.",
          "Managers approve from their dashboard. Who approved what stays on record.",
        ),
      },
      {
        title: L("Payroll otomatis", "Automatic payroll"),
        body: L(
          "Gaji, lembur, dan potongan terhitung sendiri di akhir periode.",
          "Salary, overtime and deductions calculate themselves at period close.",
        ),
      },
      {
        title: L("Slip gaji digital", "Digital payslips"),
        body: L(
          "Karyawan terima slip gaji yang rapi dan bisa diunduh kapan saja.",
          "Every employee gets a clean payslip, downloadable anytime.",
        ),
      },
    ],
    features: [
      {
        title: L("Presensi + lokasi", "Location-aware attendance"),
        body: L(
          "Absen hanya sah di titik yang ditentukan perusahaan.",
          "Check-ins only count at the company's approved locations.",
        ),
      },
      {
        title: L("Dashboard per peran", "A dashboard per role"),
        body: L(
          "Admin, supervisor, dan karyawan melihat halaman yang berbeda sesuai tugasnya.",
          "Admins, supervisors and staff each see a view built for their job.",
        ),
      },
      {
        title: L("Tetap & freelance", "Staff and freelancers"),
        body: L(
          "Gaji karyawan tetap dan pekerja lepas dihitung di satu sistem yang sama.",
          "Full-time and freelance pay run through one and the same system.",
        ),
      },
      {
        title: L("Laporan siap pakai", "Reports on demand"),
        body: L(
          "Rekap kehadiran dan payroll bulanan tinggal diunduh.",
          "Monthly attendance and payroll recaps are one download away.",
        ),
      },
    ],
    results: [
      L(
        "Tidak ada lagi rekap absen manual di akhir bulan",
        "No more manual attendance recaps at month end",
      ),
      L(
        "Gaji terhitung akurat, komplain berkurang",
        "Payroll comes out accurate — fewer disputes",
      ),
      L(
        "Semua riwayat tersimpan dan gampang diaudit",
        "Every record is stored and easy to audit",
      ),
    ],
  },

  crm: {
    title: "Production CRM",
    tag: "CRM",
    image: "/project/crm.png",
    tagline: L(
      "Setiap order terpantau — dari DP sampai paket sampai.",
      "Every order tracked — from deposit to doorstep.",
    ),
    problem: L(
      "Order masuk dari mana-mana — WhatsApp, DM, telepon — dan hidup di ingatan admin. Begitu ramai, mulai ada order yang kelewat, spesifikasi tertukar, dan customer bertanya \"pesanan saya sampai mana?\" berkali-kali sehari. Tidak ada satu tempat yang tahu kondisi produksi sebenarnya.",
      "Orders arrive from everywhere — WhatsApp, DMs, phone calls — and live in an admin's memory. Once things get busy, orders slip, specs get swapped, and customers ask \"where's my order?\" several times a day. No single place knows the true state of production.",
    ),
    solution: L(
      "CRM produksi yang jadi satu-satunya sumber kebenaran: setiap order tercatat dengan nomor, otomatis jadi perintah kerja, dan berjalan tahap demi tahap dengan satu klik. Stok terpotong sendiri, dan customer memantau progres lewat link tracking publik — tanpa harus bertanya ke admin.",
      "A production CRM that becomes the single source of truth: every order is numbered, automatically becomes a work order, and moves stage by stage with one click. Stock deducts itself, and customers watch progress through a public tracking link — without messaging an admin.",
    ),
    intro: L(
      "Order yang masuk lewat chat gampang hilang jejak. CRM ini mencatat semuanya: siapa pesan apa, produksinya sampai mana, kapan dikirim.",
      "Orders that live in chat threads lose their trail fast. This CRM records everything: who ordered what, where production stands, when it ships.",
    ),
    steps: [
      {
        title: L("Order masuk", "Order comes in"),
        body: L(
          "Pesanan dicatat sekali dan langsung dapat nomor. Tidak ada yang tercecer.",
          "Each order is logged once and gets its number. Nothing slips through.",
        ),
      },
      {
        title: L("Jadi perintah kerja", "Becomes a work order"),
        body: L(
          "Order yang dikonfirmasi otomatis berubah jadi perintah kerja untuk tim produksi.",
          "A confirmed order automatically becomes a work order for production.",
        ),
      },
      {
        title: L("Jalan per tahap", "Moves stage by stage"),
        body: L(
          "Potong, jahit, sablon, QC — tiap tahap selesai cukup satu klik.",
          "Cutting, sewing, printing, QC — each finished stage is a single click.",
        ),
      },
      {
        title: L("Stok ikut terpotong", "Stock updates itself"),
        body: L(
          "Bahan yang terpakai langsung tercatat, sisa stok selalu akurat.",
          "Used materials are logged instantly, so stock counts stay true.",
        ),
      },
      {
        title: L("Customer pantau sendiri", "Customers track it themselves"),
        body: L(
          "Pembeli dapat link tracking dan melihat progres ordernya sendiri.",
          "Buyers get a tracking link and watch their own order progress.",
        ),
      },
    ],
    features: [
      {
        title: L("Tracking publik", "Public tracking"),
        body: L(
          "Customer cek status ordernya tanpa harus bertanya ke admin.",
          "Customers check their order status without messaging an admin.",
        ),
      },
      {
        title: L("Monitoring produksi", "Production monitoring"),
        body: L(
          "Tahap yang menumpuk kelihatan lebih awal, sebelum jadi keterlambatan.",
          "Pile-ups show early — before they become late deliveries.",
        ),
      },
      {
        title: L("Analisa penjualan", "Sales analytics"),
        body: L(
          "Produk mana yang laku dan bulan apa yang ramai, terbaca dari data.",
          "Which products sell and which months peak — read straight from data.",
        ),
      },
      {
        title: L("Akses per peran", "Role-based access"),
        body: L(
          "Tim produksi, admin, dan owner masing-masing melihat yang perlu saja.",
          "Production, admins and owners each see exactly what they need.",
        ),
      },
    ],
    results: [
      L(
        "Tidak ada order yang kelewat atau tertukar",
        "No order gets skipped or mixed up",
      ),
      L(
        "Pertanyaan “pesanan saya sampai mana?” turun drastis",
        "“Where's my order?” messages drop off a cliff",
      ),
      L(
        "Kondisi produksi terbaca real-time dari mana saja",
        "Production status is readable in real time, from anywhere",
      ),
    ],
  },

  "ai-medsos": {
    title: "Social Media AI Agent",
    tag: "AI AGENT",
    image: "/project/media.png",
    tagline: L(
      "Instagram tetap aktif — tanpa begadang bikin konten.",
      "Instagram stays active — without late nights making content.",
    ),
    problem: L(
      "Feed yang mati membuat brand terlihat mati. Tapi posting konsisten butuh riset, nulis caption, desain, jadwal, dan balas komentar — pekerjaan satu tim konten penuh, yang kebanyakan bisnis kecil tidak punya. Akhirnya akun aktif seminggu, hening sebulan.",
      "A dead feed makes the brand look dead. But posting consistently takes research, captions, design, scheduling and comment replies — a full content team's job, which most small businesses don't have. So the account runs hot for a week and goes silent for a month.",
    ),
    solution: L(
      "AI agent yang tersambung resmi ke Instagram lewat Meta: mempelajari gaya brand dari data akun sendiri, menyusun draf konten dan jadwal posting, lalu menjalankannya setelah disetujui. Komentar dan insight masuk ke satu dashboard, jadi engagement terjaga tanpa begadang.",
      "An AI agent officially wired to Instagram through Meta: it learns the brand's voice from the account's own data, drafts content and a posting schedule, then runs it once approved. Comments and insights land on one dashboard, so engagement holds without the late nights.",
    ),
    intro: L(
      "Posting konsisten itu berat kalau dikerjakan manual di sela pekerjaan lain. AI agent ini yang mengurus, dari draf konten sampai membalas komentar.",
      "Posting consistently is brutal when it's done by hand between other jobs. This AI agent takes it over — from drafting content to answering comments.",
    ),
    steps: [
      {
        title: L("Hubungkan akun", "Connect the account"),
        body: L(
          "Akun Instagram brand terhubung resmi lewat Meta, bukan lewat bot abal-abal.",
          "The brand's Instagram connects officially through Meta — no shady bots.",
        ),
      },
      {
        title: L("AI mengenal brand", "The AI learns the brand"),
        body: L(
          "Gaya bicara, produk, dan audiens dipelajari dari data akun sendiri.",
          "Voice, products and audience are learned from the account's own data.",
        ),
      },
      {
        title: L("Konten disiapkan", "Content gets drafted"),
        body: L(
          "Draf caption dan rencana posting muncul otomatis, tinggal dipoles.",
          "Caption drafts and a posting plan appear automatically, ready to polish.",
        ),
      },
      {
        title: L("Setujui, lalu jalan", "Approve, then it runs"),
        body: L(
          "Kamu review sekali, posting berjalan sendiri sesuai jadwal.",
          "You review once; posts go out on schedule by themselves.",
        ),
      },
      {
        title: L("Interaksi terpantau", "Engagement, watched"),
        body: L(
          "Komentar dan performa masuk ke satu dashboard — AI bantu membalas.",
          "Comments and performance land on one dashboard — the AI helps reply.",
        ),
      },
    ],
    features: [
      {
        title: L("Resmi via Meta", "Official Meta API"),
        body: L(
          "Terhubung lewat jalur resmi, akun aman dari banned.",
          "Connected through the official route — the account stays safe.",
        ),
      },
      {
        title: L("Insight lengkap", "Full insights"),
        body: L(
          "Reach dan engagement tiap post terbaca jelas, bukan kira-kira.",
          "Reach and engagement per post, in plain numbers — not guesses.",
        ),
      },
      {
        title: L("Balas komentar cepat", "Fast comment replies"),
        body: L(
          "Komentar yang masuk dibantu jawab, tidak menggantung berhari-hari.",
          "Incoming comments get help answering instead of hanging for days.",
        ),
      },
      {
        title: L("Multi-brand", "Multi-brand"),
        body: L(
          "Beberapa akun brand dikelola dari satu tempat.",
          "Several brand accounts, managed from one place.",
        ),
      },
    ],
    results: [
      L(
        "Feed konsisten tanpa tim konten full-time",
        "A consistent feed without a full-time content team",
      ),
      L(
        "Komentar terjawab cepat, engagement ikut naik",
        "Comments answered fast — engagement follows",
      ),
      L(
        "Keputusan konten pakai data, bukan feeling",
        "Content decisions run on data, not gut feel",
      ),
    ],
  },

  "ai-marketing": {
    title: "Marketing AI Agent",
    tag: "AI AGENT",
    image: "/project/marketing.png",
    tagline: L(
      "Campaign marketing jadi dalam hitungan menit.",
      "A full marketing campaign, minutes after you ask.",
    ),
    problem: L(
      "Menyusun campaign marketing biasanya berarti berhari-hari rapat, brainstorming ide, menulis copy per kanal, lalu berdebat opsi mana yang jalan — dan hasilnya tetap tergantung mood satu orang kreatif. Saat campaign harusnya tayang, tim masih di dokumen draf.",
      "Planning a marketing campaign usually means days of meetings, idea dumps, per-channel copywriting, then arguing over which option to run — and the result still depends on one creative person's mood. By the time it should be live, the team is still in a draft doc.",
    ),
    solution: L(
      "Web AI agent yang memampatkan semua itu jadi hitungan menit: pilih brand dan tujuan, sistem men-generate beberapa opsi campaign lengkap dengan copy dan jadwal, menilai tiap opsi dengan skor yang transparan, lalu menyimpannya sebagai report siap eksekusi hari itu juga.",
      "An AI agent web app that compresses all of it into minutes: pick a brand and a goal, the system generates several complete campaign options with copy and schedule, scores each one transparently, and saves the winner as a report the team can execute the same day.",
    ),
    intro: L(
      "Menyusun campaign biasanya makan berhari-hari rapat. Di sini cukup pilih brand dan tujuan — AI menyusun campaign lengkap dengan copy-nya.",
      "Planning a campaign usually burns days of meetings. Here you pick a brand and a goal — the AI assembles the campaign, copy included.",
    ),
    steps: [
      {
        title: L("Pilih brand & tujuan", "Pick brand and goal"),
        body: L(
          "Mau jualan produk apa, menyasar siapa — itu saja yang perlu diisi.",
          "What you're selling and who it's for — that's all it needs.",
        ),
      },
      {
        title: L("AI menyusun campaign", "The AI builds campaigns"),
        body: L(
          "Ide, copy iklan, dan jadwal disusun sekaligus dalam beberapa opsi.",
          "Ideas, ad copy and a schedule come back as several complete options.",
        ),
      },
      {
        title: L("Tiap opsi diberi skor", "Every option gets scored"),
        body: L(
          "Sistem menilai mana yang paling menjanjikan — dengan kriteria yang jelas, bukan tebakan.",
          "Each option is scored on clear criteria, so picking isn't a coin flip.",
        ),
      },
      {
        title: L("Unduh dan jalankan", "Download and run"),
        body: L(
          "Hasilnya jadi report rapi yang siap dipakai tim hari itu juga.",
          "The result is a clean report the team can run the same day.",
        ),
      },
    ],
    features: [
      {
        title: L("Copy siap pakai", "Ready-to-use copy"),
        body: L(
          "Teks iklan dan konten per kanal, tinggal salin.",
          "Ad text and content per channel, ready to paste.",
        ),
      },
      {
        title: L("Skor yang transparan", "Transparent scoring"),
        body: L(
          "Kenapa satu opsi menang dari yang lain, alasannya kelihatan.",
          "Why one option beats another is written down, not hidden.",
        ),
      },
      {
        title: L("Report tersimpan", "Reports that keep"),
        body: L(
          "Campaign lama tersimpan dan bisa dibandingkan dengan yang baru.",
          "Old campaigns stay on file for comparing against new ones.",
        ),
      },
      {
        title: L("Multi-brand", "Multi-brand"),
        body: L(
          "Satu sistem melayani beberapa brand dengan gaya masing-masing.",
          "One system serves several brands, each in its own voice.",
        ),
      },
    ],
    results: [
      L(
        "Waktu menyusun campaign terpangkas dari hari ke menit",
        "Campaign planning shrinks from days to minutes",
      ),
      L(
        "Ide tidak lagi bergantung pada satu orang",
        "Ideas stop depending on one person's mood",
      ),
      L(
        "Setiap campaign terdokumentasi dan terukur",
        "Every campaign is documented and measurable",
      ),
    ],
  },

  ssb: {
    title: "SSB Management",
    tag: "MANAGEMENT",
    image: "/project/SSB.png",
    tagline: L(
      "Urusan akademi bola: satu dashboard, beres.",
      "Running a football academy from one dashboard.",
    ),
    problem: L(
      "Ratusan siswa akademi dikelola lewat buku catatan dan grup WhatsApp: iuran bulanan ada yang lolos tak tertagih, jadwal latihan simpang siur, dan laporan keuangan baru dibuat kalau ada yang minta — itupun butuh berhari-hari merekap.",
      "Hundreds of academy students managed through notebooks and WhatsApp groups: monthly fees slip by uncollected, training schedules get crossed, and financial reports only exist when someone demands one — after days of recapping.",
    ),
    solution: L(
      "Satu dashboard untuk seluruh akademi: data siswa per kelompok umur, jadwal dan kehadiran latihan, tagihan bulanan yang tercatat otomatis dengan status lunas/belum, sampai laporan keuangan yang siap diekspor ke PDF kapan pun. Admin pusat, admin cabang, dan pelatih punya akses sesuai perannya.",
      "One dashboard for the whole academy: students by age group, training schedules and attendance, monthly bills that log themselves with paid/unpaid status, and financial reports exportable to PDF at any moment. Head office, branch admins and coaches each get role-scoped access.",
    ),
    intro: L(
      "Mengelola ratusan siswa akademi lewat buku catatan dan chat itu rawan bocor. Sistem ini merapikan anggota, jadwal, sampai iuran bulanan.",
      "Managing hundreds of academy students through notebooks and chats leaks money. This system tidies members, schedules and monthly fees.",
    ),
    steps: [
      {
        title: L("Data siswa lengkap", "Complete student records"),
        body: L(
          "Profil, kelompok umur, dan posisi tersimpan rapi per siswa.",
          "Profiles, age groups and positions, kept neatly per student.",
        ),
      },
      {
        title: L("Jadwal dan kehadiran", "Schedules and attendance"),
        body: L(
          "Latihan terjadwal, kehadiran tercatat — pelatih tinggal buka HP.",
          "Sessions are scheduled, attendance recorded — coaches just open their phone.",
        ),
      },
      {
        title: L("Tagihan otomatis", "Automatic billing"),
        body: L(
          "Iuran bulanan tercatat sendiri. Yang belum bayar langsung kelihatan.",
          "Monthly fees log themselves. Unpaid ones stand out immediately.",
        ),
      },
      {
        title: L("Laporan keuangan", "Financial reports"),
        body: L(
          "Uang masuk dan keluar rapi, ekspor ke PDF cukup sekali klik.",
          "Money in and out stays clean — PDF export is one click.",
        ),
      },
    ],
    features: [
      {
        title: L("Multi-akademi", "Multi-academy"),
        body: L(
          "Beberapa cabang akademi dikelola dari satu sistem pusat.",
          "Several academy branches run from one central system.",
        ),
      },
      {
        title: L("Peran yang jelas", "Clear roles"),
        body: L(
          "Pelatih, admin akademi, dan admin pusat punya akses masing-masing.",
          "Coaches, academy admins and head office each get their own access.",
        ),
      },
      {
        title: L("Rekap per siswa", "Per-student recap"),
        body: L(
          "Riwayat bayar dan kehadiran tiap anak terbaca dalam sekali buka.",
          "Each child's payment and attendance history, one screen away.",
        ),
      },
      {
        title: L("Ekspor PDF", "PDF export"),
        body: L(
          "Laporan keuangan siap cetak untuk rapat atau orang tua.",
          "Financial reports ready to print for meetings or parents.",
        ),
      },
    ],
    results: [
      L("Iuran tidak ada yang kelewat", "No monthly fee slips through"),
      L(
        "Orang tua percaya karena tagihan jelas",
        "Parents trust the academy because billing is clear",
      ),
      L(
        "Laporan keuangan siap kapan pun diminta",
        "Financial reports are ready whenever they're asked for",
      ),
    ],
  },

  chatbot: {
    title: "Customer Service Chatbot",
    tag: "CHATBOT",
    image: "/project/chatbot.png",
    tagline: L(
      "Customer dibalas dalam hitungan detik. Jam 2 pagi sekalipun.",
      "Customers answered in seconds. Even at 2 a.m.",
    ),
    problem: L(
      "Lead paling banyak hilang bukan karena harga — tapi karena telat dibalas. Chat masuk jam 9 malam, admin baru buka jam 8 pagi, dan calon pembeli sudah pesan di tempat lain. Sementara itu 80% pertanyaan yang masuk itu-itu saja: harga, katalog, cara order.",
      "Most leads die not over price — but over slow replies. A chat lands at 9 p.m., the admin opens it at 8 a.m., and the buyer has already ordered elsewhere. Meanwhile 80% of incoming questions are the same ones: price, catalog, how to order.",
    ),
    solution: L(
      "Chatbot WhatsApp di nomor bisnis yang sama: menjawab pertanyaan umum dalam hitungan detik, mengirim katalog dan daftar harga lengkap dengan gambar, memandu order sampai instruksi DP — 24 jam nonstop. Kasus sensitif seperti nego harga otomatis diteruskan ke admin senior, jadi bot tahu batasnya.",
      "A WhatsApp chatbot on the same business number: it answers common questions in seconds, sends catalogs and price lists with images, and guides orders through to deposit instructions — 24/7. Sensitive cases like price negotiation hand off automatically to a senior admin, so the bot knows its limits.",
    ),
    intro: L(
      "Lead paling sering hilang karena telat dibalas. Chatbot WhatsApp ini menjawab pertanyaan, mengirim katalog, sampai memandu order — nonstop.",
      "Most leads die because the reply came too late. This WhatsApp chatbot answers questions, sends catalogs and walks orders through — nonstop.",
    ),
    steps: [
      {
        title: L("Customer chat via WA", "A customer messages on WhatsApp"),
        body: L(
          "Nomor bisnis yang sama, pengalaman chat yang biasa mereka pakai.",
          "Same business number, the chat experience they already use.",
        ),
      },
      {
        title: L("Bot mengenali maksudnya", "The bot reads the intent"),
        body: L(
          "Tanya harga, minta katalog, atau mau order — bot paham bedanya.",
          "Asking a price, wanting a catalog, placing an order — it knows the difference.",
        ),
      },
      {
        title: L("Jawab lengkap + gambar", "Replies with images"),
        body: L(
          "Harga, katalog, dan panduan DP desain terkirim dalam hitungan detik.",
          "Prices, catalogs and design-deposit guides go out in seconds.",
        ),
      },
      {
        title: L("Order dipandu sampai DP", "Orders guided to deposit"),
        body: L(
          "Dari pilih produk sampai instruksi pembayaran, bot yang memandu.",
          "From product choice to payment instructions, the bot leads the way.",
        ),
      },
      {
        title: L("Kasus sulit ke manusia", "Hard cases go to humans"),
        body: L(
          "Nego harga atau kasus khusus diteruskan otomatis ke admin senior.",
          "Price negotiations and edge cases hand off automatically to a senior admin.",
        ),
      },
    ],
    features: [
      {
        title: L("Cepat + cerdas", "Fast and smart"),
        body: L(
          "Pertanyaan umum dijawab instan; pertanyaan aneh ditangani AI.",
          "Common questions get instant answers; odd ones go to the AI.",
        ),
      },
      {
        title: L("Katalog terkirim otomatis", "Catalogs, sent automatically"),
        body: L(
          "Gambar produk dan daftar harga selalu siap kirim.",
          "Product images and price lists are always ready to send.",
        ),
      },
      {
        title: L("Eskalasi otomatis", "Automatic escalation"),
        body: L(
          "Bot tahu batasnya — kasus sensitif langsung ke manusia.",
          "The bot knows its limits — sensitive cases go straight to a human.",
        ),
      },
      {
        title: L("Aman dari banned", "Ban-safe"),
        body: L(
          "Pola kirim dijaga supaya nomor bisnis tetap sehat.",
          "Send patterns are throttled to keep the business number healthy.",
        ),
      },
    ],
    results: [
      L("Tidak ada chat yang telat dibalas", "No chat waits too long"),
      L(
        "Admin fokus closing, bukan menjawab FAQ",
        "Admins spend their day closing, not answering FAQs",
      ),
      L(
        "Order tetap masuk di luar jam kerja",
        "Orders keep landing outside office hours",
      ),
    ],
  },

  "company-profile": {
    title: "Company Profile",
    tag: "PROFILE",
    image: "/project/companyprofile.png",
    tagline: L(
      "Wajah resmi brand di internet — rapi, dua bahasa.",
      "The brand's official face online — polished, in two languages.",
    ),
    problem: L(
      "Calon klien korporat selalu mengecek dulu: mereka cari nama brand di Google sebelum membalas penawaran. Kalau yang ditemukan cuma akun Instagram dan nomor WhatsApp, kepercayaan turun sebelum percakapan dimulai — apalagi untuk pembeli luar negeri.",
      "Corporate prospects always check first: they google the brand before replying to any offer. If all they find is an Instagram account and a WhatsApp number, trust drops before the conversation starts — doubly so for overseas buyers.",
    ),
    solution: L(
      "Website profil resmi dua bahasa yang menjawab pencarian itu: cerita dan kapabilitas produksi brand, katalog produk per kategori, berita terbaru, dan tombol kontak/order dari halaman mana pun. Kontennya dikelola lewat file terstruktur — menambah produk atau artikel tidak butuh programmer.",
      "An official two-language profile site that answers that search: the brand's story and production capability, a categorised product catalog, fresh news, and contact/order buttons on every page. Content lives in structured files — adding a product or an article needs no programmer.",
    ),
    intro: L(
      "Saat calon klien besar mengecek kamu di Google, apa yang mereka temukan ikut menentukan deal. Website profile ini yang menjawabnya.",
      "When a big prospect googles you, what they find helps decide the deal. This profile site is the answer they land on.",
    ),
    steps: [
      {
        title: L("Kenalan dengan brand", "Meet the brand"),
        body: L(
          "Cerita, nilai, dan kapabilitas produksi tersaji rapi di halaman depan.",
          "Story, values and production capability, laid out on the front page.",
        ),
      },
      {
        title: L("Lihat katalog", "Browse the catalog"),
        body: L(
          "Produk tersusun per kategori, lengkap dengan fotonya.",
          "Products organised by category, photos included.",
        ),
      },
      {
        title: L("Baca kabar terbaru", "Read the latest"),
        body: L(
          "Berita dan update brand menunjukkan bisnis yang hidup.",
          "News and updates show a business that's alive.",
        ),
      },
      {
        title: L("Langsung kontak", "Get in touch instantly"),
        body: L(
          "Tombol order dan WhatsApp tersedia dari halaman mana pun.",
          "Order and WhatsApp buttons are reachable from any page.",
        ),
      },
    ],
    features: [
      {
        title: L("Dua bahasa", "Two languages"),
        body: L(
          "Indonesia dan Inggris — siap untuk pasar lokal maupun luar.",
          "Indonesian and English — ready for local and overseas buyers.",
        ),
      },
      {
        title: L("Katalog gampang di-update", "Easy catalog updates"),
        body: L(
          "Menambah produk atau berita tidak butuh programmer.",
          "Adding a product or a news post doesn't need a programmer.",
        ),
      },
      {
        title: L("Ramah mesin pencari", "Search-friendly"),
        body: L(
          "Struktur halaman dibuat supaya gampang ditemukan di Google.",
          "Pages are structured to be found on Google.",
        ),
      },
      {
        title: L("Cepat dan ringan", "Fast and light"),
        body: L(
          "Terbuka cepat bahkan di sinyal seadanya.",
          "Opens fast even on a weak connection.",
        ),
      },
    ],
    results: [
      L(
        "Brand terlihat kredibel di mata klien korporat",
        "The brand reads as credible to corporate clients",
      ),
      L(
        "Satu link berisi semua: profil, katalog, kontak",
        "One link carries everything: profile, catalog, contact",
      ),
      L(
        "Calon pembeli luar negeri ikut terlayani",
        "Overseas prospects are served too",
      ),
    ],
  },

  "landing-page": {
    title: "Company Landing Page",
    tag: "LANDING",
    image: "/project/landingpage.png",
    tagline: L(
      "Satu halaman, satu tujuan: pengunjung jadi lead.",
      "One page, one job: turn visitors into leads.",
    ),
    problem: L(
      "Biaya iklan terbakar percuma kalau pengunjung mendarat di halaman yang membingungkan: navigasi ke mana-mana, informasi harga tersembunyi, dan tidak jelas harus klik apa. Pengunjung dari Instagram atau TikTok memutuskan dalam hitungan detik — lalu pergi.",
      "Ad spend burns for nothing when visitors land on a confusing page: navigation everywhere, pricing buried, no obvious next step. Traffic from Instagram or TikTok decides in seconds — then leaves.",
    ),
    solution: L(
      "Landing page satu tujuan: headline yang langsung menjelaskan tawaran, harga dan contoh produk di depan mata, review pembeli sebagai bukti, dan satu aksi yang sama di setiap titik scroll — tombol WhatsApp. Kontennya modular, jadi campaign baru cukup ganti isi tanpa membangun ulang.",
      "A one-job landing page: a headline that states the offer instantly, pricing and product examples up front, buyer reviews as proof, and the same single action at every scroll depth — the WhatsApp button. Content is modular, so a new campaign swaps content instead of rebuilding.",
    ),
    intro: L(
      "Iklan sebagus apa pun sia-sia kalau pengunjung bingung harus apa. Landing page ini memangkas semua pengalih dan mengarahkan ke satu aksi: chat.",
      "The best ad money can buy dies on a confusing page. This landing page cuts every distraction and points to one action: chat.",
    ),
    steps: [
      {
        title: L("Datang dari iklan", "They arrive from an ad"),
        body: L(
          "Pengunjung mendarat dari Instagram, TikTok, atau Google Ads.",
          "Visitors land from Instagram, TikTok or Google Ads.",
        ),
      },
      {
        title: L("Langsung paham tawarannya", "They get the offer at once"),
        body: L(
          "Headline jelas, harga jelas, contoh produk di depan mata.",
          "Clear headline, clear pricing, product examples right there.",
        ),
      },
      {
        title: L("Yakin karena bukti", "Proof does the convincing"),
        body: L(
          "Review pembeli dan logo partner menghapus keraguan.",
          "Buyer reviews and partner logos clear the doubt.",
        ),
      },
      {
        title: L("Klik, langsung ngobrol", "One tap to a conversation"),
        body: L(
          "Tombol WhatsApp membawa mereka langsung ke percakapan order.",
          "The WhatsApp button drops them straight into an order chat.",
        ),
      },
    ],
    features: [
      {
        title: L("CTA di semua titik", "CTA at every turn"),
        body: L(
          "Ke mana pun pengunjung scroll, jalur ke chat selalu dekat.",
          "Wherever they scroll, the path to chat stays close.",
        ),
      },
      {
        title: L("Konten gampang diganti", "Swappable content"),
        body: L(
          "Katalog, review, dan penawaran bisa diganti mengikuti campaign.",
          "Catalog, reviews and offers swap out per campaign.",
        ),
      },
      {
        title: L("Loading kilat", "Loads in a blink"),
        body: L(
          "Pengunjung iklan tidak sabaran — halaman ini siap sebelum mereka pergi.",
          "Ad traffic is impatient — this page is ready before they leave.",
        ),
      },
      {
        title: L("Siap untuk campaign apa pun", "Fits any campaign"),
        body: L(
          "Dipakai ulang untuk promo baru tanpa membangun dari nol.",
          "Reused for new promos without rebuilding from zero.",
        ),
      },
    ],
    results: [
      L(
        "Biaya iklan tidak terbuang ke halaman yang membingungkan",
        "Ad spend stops leaking into a confusing page",
      ),
      L("Lead masuk langsung ke WhatsApp", "Leads flow straight into WhatsApp"),
      L(
        "Campaign baru cukup ganti konten, bukan bikin ulang",
        "New campaigns swap content instead of starting over",
      ),
    ],
  },

  "online-shop": {
    title: "AYRES Online Shop",
    tag: "E-COMMERCE",
    image: "/project/onlineshop.png",
    tagline: L(
      "Toko jersey custom yang buka 24 jam.",
      "A custom jersey store that never closes.",
    ),
    problem: L(
      "Order jersey custom lewat chat berarti tanya-jawab berhari-hari: model, warna, ukuran, ongkir, rekening, bukti transfer. Admin jadi bottleneck — order hanya masuk saat admin online, dan salah catat pembayaran tinggal menunggu waktu.",
      "Ordering a custom jersey over chat means days of back-and-forth: model, colour, size, shipping, bank account, transfer receipt. The admin becomes the bottleneck — orders only land while the admin is online, and payment mislogging is a matter of time.",
    ),
    solution: L(
      "Toko online yang menyelesaikan seluruh transaksi sendiri: customer memilih varian dari katalog, ongkir JNE terhitung otomatis saat checkout, pembayaran dikonfirmasi satu klik tanpa upload bukti, dan status order terbaca jelas dari dibayar sampai diterima. Admin tinggal verifikasi dan memproses — bukan mencatat.",
      "An online store that completes the whole transaction on its own: customers pick variants from the catalog, JNE shipping calculates at checkout, payment confirms in one tap with no receipt uploads, and order status reads clearly from paid to delivered. Admins verify and fulfil — instead of transcribing.",
    ),
    intro: L(
      "Order custom biasanya bolak-balik chat berhari-hari. Di toko online ini customer pilih, bayar, dan konfirmasi — selesai sendiri, kapan pun.",
      "Custom orders usually mean days of back-and-forth chat. In this store, customers pick, pay and confirm — on their own, any hour.",
    ),
    steps: [
      {
        title: L("Pilih produk & varian", "Pick product and variant"),
        body: L(
          "Model, warna, dan ukuran dipilih sendiri dari katalog.",
          "Model, colour and size, chosen straight from the catalog.",
        ),
      },
      {
        title: L("Ongkir asli, bukan kira-kira", "Real shipping rates"),
        body: L(
          "Ongkos kirim JNE terhitung otomatis saat checkout.",
          "JNE shipping costs calculate automatically at checkout.",
        ),
      },
      {
        title: L("Bayar & konfirmasi 1 klik", "Pay and confirm in one tap"),
        body: L(
          "Tanpa upload bukti transfer yang ribet — konfirmasi cukup sekali klik.",
          "No clunky receipt uploads — confirmation is a single tap.",
        ),
      },
      {
        title: L("Admin memproses", "The team takes over"),
        body: L(
          "Pembayaran diverifikasi, order masuk produksi, resi terkirim.",
          "Payment verified, order into production, tracking number sent.",
        ),
      },
      {
        title: L("Lacak sampai tiba", "Track it to the door"),
        body: L(
          "Status order terbaca jelas dari dibayar sampai diterima.",
          "Order status reads clearly from paid to delivered.",
        ),
      },
    ],
    features: [
      {
        title: L("Login Google", "Google sign-in"),
        body: L(
          "Masuk sekali klik, riwayat order tersimpan di akun.",
          "One-tap sign-in, with order history saved to the account.",
        ),
      },
      {
        title: L("Promo fleksibel", "Flexible promos"),
        body: L(
          "Diskon produk, kode promo, dan banner diatur dari admin.",
          "Product discounts, promo codes and banners, all set from admin.",
        ),
      },
      {
        title: L("Ongkir JNE terhubung", "Wired to JNE"),
        body: L(
          "Tarif dan resi terhubung langsung ke sistem kurir.",
          "Rates and waybills connect directly to the courier.",
        ),
      },
      {
        title: L("Status yang jujur", "Honest status"),
        body: L(
          "Setiap perubahan status tercatat — customer tidak menebak-nebak.",
          "Every status change is logged — customers never guess.",
        ),
      },
    ],
    results: [
      L(
        "Order masuk tanpa admin harus standby",
        "Orders come in without an admin on standby",
      ),
      L(
        "Pembayaran rapi, nyaris tanpa salah catat",
        "Payments stay tidy, with barely any mislogging",
      ),
      L(
        "Riwayat belanja tersimpan untuk repeat order",
        "Purchase history sticks around for repeat orders",
      ),
    ],
  },

  reseller: {
    title: "Reseller Web",
    tag: "RESELLER",
    image: "/project/Reseller.png",
    tagline: L(
      "Pasukan reseller rapi, benefit tepat sasaran.",
      "A tidy reseller army, with benefits on target.",
    ),
    problem: L(
      "Program reseller tumbuh lebih cepat dari pencatatannya: pendaftaran masuk lewat chat, datanya tersebar di beberapa spreadsheet, dan siapa berhak benefit apa tidak pernah jelas. Reseller rajin merasa tidak dihargai, admin kewalahan menelusuri data.",
      "The reseller program grows faster than its bookkeeping: sign-ups arrive over chat, data scatters across spreadsheets, and who earned which benefit is never clear. Active resellers feel unrewarded; admins drown in data archaeology.",
    ),
    solution: L(
      "Portal reseller di atas Google Sheets yang sudah dipakai tim: pendaftaran lewat form online masuk rapi ke satu tempat, admin mengelola dan memfilter data dari dashboard, dan benefit per level tercatat jelas untuk tiap reseller — tanpa migrasi sistem, tanpa spreadsheet mentah.",
      "A reseller portal on top of the Google Sheets the team already uses: form sign-ups land tidily in one place, admins manage and filter data from a dashboard, and per-tier benefits are clearly recorded for every reseller — no system migration, no raw spreadsheets.",
    ),
    intro: L(
      "Reseller makin banyak, datanya makin berantakan. Portal ini merapikan pendaftaran dan benefit — tersambung ke Google Sheets yang sudah dipakai tim.",
      "More resellers, messier data. This portal tidies registration and benefits — wired to the Google Sheets the team already uses.",
    ),
    steps: [
      {
        title: L("Reseller mendaftar", "Resellers sign up"),
        body: L(
          "Cukup lewat form online, tanpa kirim data via chat.",
          "One online form — no more sending details over chat.",
        ),
      },
      {
        title: L("Data rapi otomatis", "Data files itself"),
        body: L(
          "Semua pendaftaran masuk teratur ke satu tempat.",
          "Every registration lands neatly in one place.",
        ),
      },
      {
        title: L("Admin kelola dari dashboard", "Admins manage from a dashboard"),
        body: L(
          "Cari, edit, dan filter data reseller tanpa buka spreadsheet mentah.",
          "Search, edit and filter resellers without touching a raw spreadsheet.",
        ),
      },
      {
        title: L("Benefit dibagikan", "Benefits get assigned"),
        body: L(
          "Tiap reseller menerima benefit sesuai levelnya, tercatat jelas.",
          "Each reseller gets the benefits of their tier, clearly on record.",
        ),
      },
    ],
    features: [
      {
        title: L("Nyambung Google Sheets", "Runs on Google Sheets"),
        body: L(
          "Data tetap di tempat yang tim sudah paham — tanpa migrasi ribet.",
          "Data stays where the team already works — no painful migration.",
        ),
      },
      {
        title: L("Login admin aman", "Secure admin login"),
        body: L(
          "Hanya admin terdaftar yang bisa mengubah data.",
          "Only registered admins can change anything.",
        ),
      },
      {
        title: L("Benefit per level", "Tiered benefits"),
        body: L(
          "Reseller rajin dapat lebih — dan itu tercatat, bukan janji.",
          "Active resellers earn more — on record, not as a promise.",
        ),
      },
      {
        title: L("Ringan dipakai", "Light to use"),
        body: L(
          "Cepat dibuka dari HP admin di sela kesibukan.",
          "Quick to open from an admin's phone mid-hustle.",
        ),
      },
    ],
    results: [
      L("Data reseller tidak lagi tercecer", "Reseller data stops scattering"),
      L(
        "Benefit sampai ke orang yang tepat",
        "Benefits reach exactly the right people",
      ),
      L(
        "Program reseller siap discale tanpa drama",
        "The reseller program scales without drama",
      ),
    ],
  },

  invitation: {
    title: "Invitation Web",
    tag: "INVITATION",
    image: "/project/invitation.png",
    tagline: L(
      "Undangan digital yang bikin acara terasa premium.",
      "A digital invitation that makes the event feel premium.",
    ),
    problem: L(
      "Untuk acara sekelas grand opening, undangan lewat broadcast WhatsApp terasa murahan — dan yang lebih repot: tidak ada yang tahu pasti berapa tamu yang datang. Panitia merekap jawaban satu-satu dari chat, dan tetap saja meleset.",
      "For an event as big as a grand opening, a WhatsApp broadcast invite feels cheap — and worse: nobody knows how many guests are actually coming. The committee tallies replies from chats one by one, and the count still misses.",
    ),
    solution: L(
      "Web undangan yang tampil premium di HP: tamu membuka satu link, mengisi RSVP singkat, jawabannya tercatat otomatis ke Google Sheets, dan tamu yang hadir langsung menerima email undangan resmi. Panitia melihat jumlah pasti kapan pun — nol rekap manual.",
      "An invitation site that feels premium on a phone: guests open one link, fill a short RSVP, the answer records itself to Google Sheets, and attending guests instantly receive the official email invite. The committee sees exact numbers at any moment — zero manual tallying.",
    ),
    intro: L(
      "Untuk grand opening Ayres Solo, undangan kertas terasa kurang. Web undangan ini elegan, RSVP-nya otomatis, dan tamu langsung dapat email konfirmasi.",
      "For the Ayres Solo grand opening, paper invites felt short. This invitation site is elegant, RSVPs itself, and guests get a confirmation email instantly.",
    ),
    steps: [
      {
        title: L("Tamu buka link", "Guests open the link"),
        body: L(
          "Undangan dibagikan lewat WhatsApp, terbuka cantik di HP.",
          "The invite travels over WhatsApp and opens beautifully on a phone.",
        ),
      },
      {
        title: L("Isi RSVP", "They RSVP"),
        body: L(
          "Hadir atau tidak, cukup satu form singkat.",
          "Coming or not — one short form.",
        ),
      },
      {
        title: L("Data masuk sendiri", "The list builds itself"),
        body: L(
          "Jawaban tercatat otomatis, panitia tinggal melihat daftarnya.",
          "Responses record themselves; the committee just reads the list.",
        ),
      },
      {
        title: L("Email konfirmasi terkirim", "Confirmation goes out"),
        body: L(
          "Tamu yang hadir menerima email undangan resmi secara otomatis.",
          "Attending guests automatically receive the official email invite.",
        ),
      },
    ],
    features: [
      {
        title: L("Desain mengikuti brand", "On-brand design"),
        body: L(
          "Tampilan undangan senada dengan identitas acara.",
          "The invitation looks and feels like the event itself.",
        ),
      },
      {
        title: L("RSVP realtime", "Realtime RSVP"),
        body: L(
          "Jumlah tamu terbaca kapan pun, tanpa menunggu rekapan.",
          "Guest counts are readable any moment, no recap needed.",
        ),
      },
      {
        title: L("Email otomatis", "Automatic email"),
        body: L(
          "Konfirmasi terkirim sendiri — panitia tidak mengetik satu pun.",
          "Confirmations send themselves — the committee types nothing.",
        ),
      },
      {
        title: L("Sekali klik dibagikan", "Shared in one tap"),
        body: L(
          "Satu link pendek, siap disebar ke semua grup.",
          "One short link, ready for every group chat.",
        ),
      },
    ],
    results: [
      L(
        "Panitia tahu pasti berapa tamu yang datang",
        "The committee knows exactly how many guests are coming",
      ),
      L(
        "Kesan pertama acara langsung profesional",
        "The event's first impression lands as professional",
      ),
      L(
        "Nol rekap manual jawaban tamu",
        "Zero manual recap of guest responses",
      ),
    ],
  },
};
