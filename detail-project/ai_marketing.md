# AI Marketing Campaign Agent

Aplikasi **full-stack** yang membantu tim marketing menyusun **rancangan campaign bulanan**
untuk brand **Ayres, AVA, dan Saifenu** (default 10 campaign/brand → 30 campaign untuk `all`).

Agent melakukan **riset tren web nyata** (DuckDuckGo, tanpa API key), menyusun prompt per
brand berbasis panduan strategist (`skills.md`), memanggil model AI via **Ollama** (lokal
atau Ollama Cloud), menghitung **skor prioritas secara deterministik di Python** (bukan
sekadar dipercaya dari output AI), mengurutkan hasil per brand, lalu menyimpan report
dalam **JSON, Markdown, CSV, HTML**, dan ke **MySQL**.

**Tiga antarmuka, satu core logic:**
- **Web Dashboard** (Next.js 16 + React 19 + Tailwind 4) — login, form, hasil per brand, riwayat, export.
- **REST API** (FastAPI) — backend ber-autentikasi token, dipakai dashboard.
- **CLI** (Typer + Rich) — untuk otomasi/terminal, tanpa perlu server jalan.

> Tanpa OpenAI key. Model AI memakai **Ollama** (lokal atau Ollama Cloud). Bisa dijalankan
> **100% di lokal (satu mesin)**, atau **dideploy terdistribusi** (backend di Railway,
> frontend + database di Hostinger) — keduanya didukung oleh kode yang sama.

### 🌐 Demo live (production)
| Komponen | URL / Info |
|---|---|
| Frontend (Hostinger) | **https://marketing.ayreslab.id** |
| Backend API (Railway) | **https://web-production-b9459.up.railway.app** (`/api/health`, `/docs`) |
| Login default | `admin` / `admin123` *(ganti setelah verifikasi awal — lihat [Autentikasi](#autentikasi--manajemen-user))* |
| Database | MySQL Hostinger (remote), diakses backend via `DB_HOST/DB_USER/...` |

---

## Daftar Isi
1. [Fitur Utama](#fitur-utama)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Alur Kerja Lengkap (Flow Diagram)](#alur-kerja-lengkap-flow-diagram)
4. [Model Data & Schema](#model-data--schema)
5. [Sistem Scoring (Deterministik)](#sistem-scoring-deterministik)
6. [Prasyarat](#prasyarat)
7. [Instalasi (Lokal)](#instalasi-lokal)
8. [Autentikasi & Manajemen User](#autentikasi--manajemen-user)
9. [Menjalankan CLI](#menjalankan-cli)
10. [Menjalankan Backend API](#menjalankan-backend-api)
11. [Menjalankan Web Dashboard](#menjalankan-web-dashboard)
12. [Database](#database)
13. [Output Report](#output-report)
14. [Testing](#testing)
15. [Deployment Production (Railway + Hostinger)](#deployment-production-railway--hostinger)
16. [Konfigurasi (.env) — Referensi Lengkap](#konfigurasi-env--referensi-lengkap)
17. [Kustomisasi Keahlian AI (skills.md)](#kustomisasi-keahlian-ai-skillsmd)
18. [Struktur Project](#struktur-project)
19. [Troubleshooting](#troubleshooting)
20. [Roadmap](#roadmap)

---

## Fitur Utama
- **Input tervalidasi** (Pydantic): bulan, brand (Ayres/AVA/Saifenu/`all`), rentang budget, jumlah campaign per brand, lokasi, channel.
- **Riset tren web nyata** via DuckDuckGo (`ddgs`), tanpa API key — kombinasi query tren umum/terkini (menangkap event besar seperti Piala Dunia/SEA Games) + query spesifik produk brand, disaring dengan kamus kata kunci olahraga agar bebas noise, dengan **fallback** otomatis bila pencarian gagal/offline.
- **Prompt builder** Bahasa Indonesia + **`skills.md`** (panduan strategist: framework, playbook per brand, checklist kualitas) yang **disuntikkan otomatis ke prompt** setiap generate.
- **Ollama client** (lokal & cloud, Bearer auth): retry perbaikan JSON maksimal 2× dengan repair-prompt, dump `debug_raw_response.txt` bila tetap gagal, dan **auto top-up/truncate** bila jumlah campaign yang dihasilkan model tidak pas dengan target.
- **Generate paralel per brand** (ThreadPoolExecutor, maks 3 worker) — waktu total ≈ brand paling lambat, bukan penjumlahan semua brand.
- **Scoring deterministik** 5 komponen (trend relevance, budget fit, ROI, execution feasibility, brand fit) dengan bobot dari `data/scoring_config.yaml`, dihitung murni di Python — hasil selalu bisa direproduksi & diuji.
- **Export** JSON / Markdown / CSV / HTML (timestamped) + **persistensi MySQL** (tabel `reports`, `campaigns`, `users`).
- **Autentikasi**: password di-hash PBKDF2-HMAC-SHA256 (200.000 iterasi), token bertanda tangan HMAC (mirip JWT ringan) dengan masa berlaku, seluruh endpoint sensitif terproteksi.
- **Web dashboard modern**: halaman login (video background loop mulus + maskot), header gaya SaaS (status sistem subtle + menu user dropdown), form interaktif (toggle switch, currency field, brand pill), hasil per brand dengan **modal detail** + **rincian skor** (progress bar per komponen), panel **Riwayat Report**, tombol unduh per format.
- **Siap deploy terdistribusi**: file `requirements.txt`, `Procfile`, `railway.json`, `.python-version` untuk Railway; dukungan `DATABASE_URL`/`MYSQL_URL` dan auto-create-database yang *best-effort* (aman untuk managed hosting seperti Hostinger yang membatasi izin user DB).

---

## Arsitektur Sistem

### Mode Lokal (satu mesin, untuk development)
```mermaid
flowchart LR
    Dev["👤 Browser<br/>localhost:3000"] --> FE["Next.js dev server<br/>(frontend/)"]
    FE -->|"fetch + Bearer token"| API["FastAPI :8000<br/>(marketing_agent.api)"]
    API --> Core["Core Agent (Python)<br/>riset · prompt · ollama · scoring · report"]
    API --> DBL[("MySQL/MariaDB<br/>XAMPP :3306")]
    Core --> OllamaL["Ollama lokal :11434<br/>atau Ollama Cloud"]
```

### Mode Production (terdistribusi — kondisi saat ini)
```mermaid
flowchart LR
    Browser["👤 Browser"] -->|HTTPS| FE["Frontend Next.js<br/>Hostinger<br/>marketing.ayreslab.id"]
    FE -->|"fetch + Bearer token<br/>HTTPS"| API["Backend FastAPI<br/>Railway<br/>web-production-b9459.up.railway.app"]
    API -->|"remote MySQL :3306<br/>(Remote MySQL % diizinkan)"| DB[("MySQL Hostinger<br/>u768480753_marketing")]
    API -->|"HTTPS + Bearer API key"| LLM["Ollama Cloud<br/>gpt-oss:20b"]
```

**Prinsip pemisahan tanggung jawab** (berlaku di kedua mode):
- **Core Python** (`src/marketing_agent/`) memuat seluruh logic AI/riset/scoring/report — tidak tahu apakah dipanggil dari CLI, API, atau test.
- **FastAPI (`api.py`)** & **CLI (`cli.py`)** hanya "driver" tipis yang memvalidasi input dan memanggil core.
- **Next.js** murni UI — tidak ada logic bisnis (scoring/riset/AI) di sisi frontend.
- **Database** hanya lapisan persistensi opsional — core tetap bisa menghasilkan report tanpa DB aktif (lihat alur error handling di bawah).

---

## Alur Kerja Lengkap (Flow Diagram)

### 1. Alur Autentikasi (Login)
```mermaid
sequenceDiagram
    participant B as Browser
    participant F as Frontend (Next.js)
    participant A as Backend API
    participant D as MySQL

    B->>F: Buka halaman, isi username + password
    F->>A: POST /api/login {username, password}
    A->>D: ensure_seed_user() — buat admin default bila tabel users kosong
    A->>D: SELECT username, password_hash WHERE username=?
    D-->>A: password_hash (atau tidak ditemukan)
    A->>A: verify_password() — PBKDF2 compare (constant-time)
    alt kredensial valid
        A->>A: create_token() — HMAC-signed, payload {sub, exp +12 jam}
        A-->>F: 200 {token, username, ttl_hours}
        F->>F: simpan token+username di localStorage
        F-->>B: tampilkan Dashboard
    else kredensial salah / DB tidak terjangkau
        A-->>F: 401 (salah) atau 503 (DB down)
        F-->>B: tampilkan pesan error di form
    end
```
Setiap request berikutnya dari frontend menyertakan header `Authorization: Bearer <token>`
(atau `?token=` untuk link unduh file). Backend memvalidasi token lewat dependency
`get_current_user()` di setiap endpoint terproteksi. Token tidak valid/kedaluwarsa → 401
→ frontend otomatis `clearAuth()` dan menampilkan kembali halaman login.

### 2. Alur Generate Campaign (End-to-End)
```mermaid
sequenceDiagram
    participant B as Browser
    participant F as Frontend
    participant A as Backend API
    participant C as campaign_generator
    participant T as trend_research
    participant O as Ollama
    participant S as scoring
    participant D as MySQL

    B->>F: Isi form, klik "Generate Campaign"
    F->>A: POST /api/generate (Bearer token)<br/>{month, brands, budget_min/max, campaigns_per_brand, ...}
    A->>A: get_current_user() — validasi token
    A->>A: CampaignInput(**body) — validasi Pydantic
    par per brand (paralel, ThreadPoolExecutor maks 3 worker)
        A->>C: generate_campaigns_for_brand(brand)
        C->>T: research_trends(brand, month, lokasi, channel)
        T-->>C: TrendResearchResult (tren web nyata / fallback bila gagal)
        C->>C: build_brand_prompt() — Jinja2 + skills.md + starter_pack
        C->>O: generate_campaigns_json(prompt, model)
        O-->>C: JSON campaign draft (retry ≤2× bila JSON invalid)
        C->>C: top-up (re-prompt) bila kurang / truncate top-N bila lebih dari target
        C->>S: score_campaign() untuk tiap campaign (5 komponen + bobot)
        S-->>C: ScoredCampaign[] terurut desc + rank
    end
    C-->>A: FinalCampaignReport (gabungan semua brand)
    A->>A: write_reports() → outputs/*.json/.md/.csv/.html
    opt save_db = true
        A->>D: save_report() — simpan report + tiap campaign
    end
    A-->>F: 200 {report, report_id, files, db_error?}
    F-->>B: render tab per brand + kartu campaign + tombol unduh
```

### 3. Pipeline Detail per Brand (di dalam `campaign_generator.generate_campaigns_for_brand`)
```mermaid
flowchart TD
    Start(["CampaignInput tervalidasi<br/>+ BrandProfile"]) --> Q["build_trend_queries()<br/>query umum + query spesifik brand"]
    Q --> Research["search_trends() via DuckDuckGo (ddgs)"]
    Research -->|gagal / hasil kosong| Fallback["fallback_trends()<br/>tren default per brand"]
    Research -->|ada hasil| Filter["Filter SPORT_KEYWORDS<br/>buang hasil tidak relevan"]
    Filter --> Summary["summarize_trends()<br/>-&gt; TrendResearchResult"]
    Fallback --> Summary
    Summary --> Prompt["build_brand_prompt()<br/>Jinja2 + skills.md + starter_pack"]
    Prompt --> Ollama["generate_campaigns_json()<br/>POST Ollama /api/generate"]
    Ollama -->|JSON tidak valid| Repair["build_repair_prompt()<br/>retry maks 2×"]
    Repair --> Ollama
    Ollama -->|JSON valid| Drafts["_drafts_from_raw()<br/>-&gt; list CampaignDraft tervalidasi"]
    Drafts --> Count{"jumlah draft<br/>&lt; campaigns_per_brand?"}
    Count -->|ya| TopUp["Re-prompt untuk sisa campaign<br/>(1× tambahan, non-fatal bila gagal)"]
    Count -->|tidak| Score
    TopUp --> Score["score_campaign() per campaign<br/>5 komponen deterministik"]
    Score --> Sort["Sort desc by final_priority_score"]
    Sort --> Trim{"jumlah &gt; target?"}
    Trim -->|ya| TopN["Ambil top-N tertinggi"]
    Trim -->|tidak| Rank
    TopN --> Rank["Assign rank 1..N &amp; campaign_id final<br/>(BRAND-0001, BRAND-0002, ...)"]
    Rank --> Result(["BrandCampaignResult"])
```

### 4. Skema Data (Entity Relationship — MySQL)
```mermaid
erDiagram
    REPORTS ||--o{ CAMPAIGNS : "memiliki banyak"

    USERS {
        int id PK
        string username UK
        string password_hash "PBKDF2 salt$hash"
        datetime created_at
    }
    REPORTS {
        int id PK
        string report_uid "timestamp YYYYMMDD_HHMMSS"
        datetime generated_at
        string month
        string brands "comma-separated"
        bigint budget_min
        bigint budget_max
        int campaigns_per_brand
        string model_used
        int total_campaigns
        longtext input_json
        longtext report_json "seluruh FinalCampaignReport"
        string file_json
        string file_markdown
        string file_csv
        string file_html
    }
    CAMPAIGNS {
        int id PK
        int report_id FK
        string brand
        int rank
        string campaign_id "mis. AYRES-0001"
        string nama_campaign
        string jenis_kegiatan
        float final_priority_score
        bigint estimasi_budget
        text estimasi_roi
        text cta
        longtext campaign_json "seluruh ScoredCampaign"
    }
```

### 5. Penanganan Error (graceful degradation)
| Kegagalan | Perilaku sistem |
|---|---|
| Web search (DuckDuckGo) gagal/timeout | Tangkap exception per-query, lanjut ke fallback tren statis per brand — **tidak pernah crash**. |
| Model AI mengembalikan JSON rusak | Retry maks 2× dengan *repair prompt*; bila tetap gagal, raw response disimpan ke `outputs/debug_raw_response.txt` dan error jelas dilempar. |
| Model menghasilkan campaign < target | Sistem otomatis **re-prompt** untuk sisa campaign yang kurang (1× tambahan, non-fatal bila gagal). |
| Model menghasilkan campaign > target | Diambil **top-N** berdasarkan skor tertinggi, bukan dipotong asal. |
| Ollama tidak terjangkau (lokal/cloud) | `OllamaError` dengan pesan spesifik ("jalankan `ollama serve`" / "cek `OLLAMA_API_KEY`") → CLI exit 1, API 503. |
| Database tidak terjangkau saat generate | Report tetap dibuat & file tetap ditulis; `save_report()` gagal dicatat sebagai `db_error` di response, **tidak menggagalkan generate**. |
| `CREATE DATABASE` ditolak (managed hosting) | `_ensure_database()` menangkap exception & lanjut — asumsinya database sudah dibuat manual; pembuatan **tabel** tetap jalan. |
| Token tidak valid/kedaluwarsa | Endpoint 401 → frontend `clearAuth()` otomatis → kembali ke halaman login. |

---

## Model Data & Schema

Seluruh pipeline memakai model **Pydantic v2** (`src/marketing_agent/models.py`), dengan
validator yang toleran terhadap output AI (mis. field yang dikirim sebagai string
dikonversi otomatis jadi list; angka rupiah berbentuk teks seperti `"Rp12.000.000"` atau
`"15 juta"` di-parse jadi integer).

| Model | Field kunci | Catatan |
|---|---|---|
| `CampaignInput` | `month, brands, budget_min, budget_max, campaigns_per_brand, locations, channels, model` | `brands=["all"]` di-*expand* ke 3 brand; validasi `budget_max > budget_min`. |
| `BrandProfile` | `key, display_name, brand_type, focus, products, positioning, campaign_notes` | Dimuat dari `data/brand_profiles.yaml`. |
| `TrendItem` / `TrendResearchResult` | `title, source_url, snippet, opportunity, confidence` / `queries, trends, summary` | `confidence` 0.65 (hasil web) atau 0.45 (fallback). |
| `CampaignDraft` | 23 field: `nama_campaign, jenis_kegiatan, produk_didorong, target_peserta, lokasi, channel, narasumber_atau_partner, benefit_untuk_narasumber_atau_partner, yang_brand_berikan, estimasi_budget, breakdown_budget, benefit_untuk_brand, estimasi_roi, analisis_roi, relevansi_tren, alasan_campaign_ini_masuk_akal, risiko, mitigasi_risiko, timeline_pelaksanaan, kpi, cta, konsep_konten, kebutuhan_tim` | Satu rancangan campaign lengkap. |
| `CampaignScore` | `trend_relevance_score, budget_fit_score, roi_score, execution_feasibility_score, brand_fit_score, final_priority_score, scoring_notes` | Semua field di-*clamp* 0–100. |
| `ScoredCampaign` | `campaign, score, rank` | Gabungan draft + skor + peringkat. |
| `BrandCampaignResult` | `brand, trend_research, campaigns` | Hasil satu brand. |
| `FinalCampaignReport` | `generated_at, report_uid, input, results, total_campaigns, model_used` | Report gabungan seluruh brand — inilah yang di-serialize ke JSON/DB. |

---

## Sistem Scoring (Deterministik)

Skor **tidak pernah dipercaya begitu saja dari output AI** — dihitung ulang di Python
(`src/marketing_agent/scoring.py`) berdasarkan konfigurasi di `data/scoring_config.yaml`,
sehingga hasilnya deterministik, bisa diuji, dan konsisten antar model AI apa pun.

```
final_priority_score =  trend_relevance_score × 0.25
                       + budget_fit_score      × 0.20
                       + roi_score              × 0.25
                       + execution_feasibility  × 0.15
                       + brand_fit_score        × 0.15
```
*(bobot dapat diubah tanpa mengubah kode, cukup edit `scoring_config.yaml` → `weights`)*

| Komponen | Cara hitung (ringkas) |
|---|---|
| **Budget fit** | `100` bila dalam rentang input; `80` bila sedikit di bawah minimum (≥80% dari min); `55` bila jauh di bawah; interpolasi linear turun ke `40` bila melebihi maksimum hingga 1.5×; `40` (lantai) bila jauh melebihi. |
| **Brand fit** | Basis `35` + `22` per kata kunci brand yang cocok (jersey/glove untuk Ayres, toko/traffic untuk AVA, sepatu/running untuk Saifenu), di-*cap* 100. |
| **Trend relevance** | Basis `25` + `9` per kata kunci yang tumpang-tindih antara teks campaign dan ringkasan tren (setelah tokenisasi & filter stopword), rentang 10–100. |
| **ROI** | Basis `30` + bonus bila ada KPI (`+18`, `+10` jika ≥3 KPI), ada estimasi ROI (`+12`), ada analisis ROI (`+15`), ada benefit brand (`+10`), dan ada angka/persentase dalam teks ROI (`+15`). |
| **Execution feasibility** | Basis `70` + bonus timeline (`+12`) & mitigasi (`+13`); dikurangi penalti risiko (`-6`/item, maks `-24`), partner terlalu banyak pihak (`-10`), jenis kegiatan kompleks seperti event/turnamen (`-12`), dan budget mendekati plafon (hingga `-10` proporsional). |

Semua campaign dalam satu brand kemudian **diurutkan desc** berdasarkan
`final_priority_score` dan diberi `rank` 1..N — inilah dasar tampilan "urut skor" di
dashboard maupun CSV.

---

## Prasyarat
- **Python 3.11+** (production Railway memakai 3.12, lihat `.python-version`)
- **Node.js 18+** (web dashboard; Next.js 16 + React 19)
- **Ollama** — lokal (<https://ollama.com>) atau **Ollama Cloud** (API key)
- **MySQL/MariaDB** — XAMPP (lokal) atau managed (Hostinger/Railway/lainnya)

---

## Instalasi (Lokal)

### 1. Backend (Python: core + CLI + API)
```bash
python -m venv .venv
.venv\Scripts\activate            # Windows  (source .venv/bin/activate di macOS/Linux)
pip install -e ".[dev]"           # paket + dependency dev (pytest, ruff)
copy .env.example .env            # lalu sesuaikan (lihat Konfigurasi)
```

### 2. Ollama (pilih salah satu)
**Lokal:**
```bash
ollama serve
ollama pull gpt-oss
```
**Cloud** (set di `.env`):
```
OLLAMA_BASE_URL=https://ollama.com
OLLAMA_MODEL=gpt-oss:20b        # atau gpt-oss:120b-cloud (lebih detail, lebih lambat)
OLLAMA_API_KEY=<api-key-ollama-cloud>
```
Cek koneksi: `python -m marketing_agent.cli check`

### 3. Frontend
```bash
cd frontend
npm install
copy .env.local.example .env.local   # set NEXT_PUBLIC_API_BASE_URL bila perlu
```

---

## Autentikasi & Manajemen User
Dashboard & seluruh endpoint API (kecuali `/api/health` dan `/api/login`) dilindungi login.

- User disimpan di tabel MySQL `users`. Password **tidak pernah disimpan plaintext** —
  di-hash dengan **PBKDF2-HMAC-SHA256, 200.000 iterasi, salt acak per user**.
- Login sukses mengeluarkan **token bertanda tangan HMAC** (payload `{sub: username, exp}`,
  mirip JWT ringan tanpa dependency tambahan), default masa berlaku **12 jam**
  (`AUTH_TOKEN_TTL_HOURS`). Token disimpan di `localStorage` browser dan dikirim via header
  `Authorization: Bearer <token>` (atau `?token=` khusus untuk link unduh file).
- Saat tabel `users` masih **kosong**, sistem otomatis membuat **user admin default** dari
  `AUTH_DEFAULT_USER` / `AUTH_DEFAULT_PASSWORD` (default `admin` / `admin123`) pada
  percobaan login pertama — ini yang membuat demo live bisa langsung dipakai.
- Tambah user baru (lewat CLI, terhubung ke DB yang sama dengan backend):
  ```bash
  marketing-agent useradd --username namamu --password PasswordKuat123!
  ```
- **Wajib untuk produksi:**
  1. Set `AUTH_SECRET_KEY` ke string acak panjang (≥32 karakter) — token ditandatangani dengan ini.
  2. Ganti `admin123` — buat user baru dengan password kuat, atau update password admin.

---

## Menjalankan CLI
```bash
python -m marketing_agent.cli generate --month "Juli 2026" --brands all --budget-min 5000000 --budget-max 20000000
```
Uji cepat (1 brand, model besar butuh waktu):
```bash
python -m marketing_agent.cli generate --month "Juli 2026" --brands saifenu --budget-min 5000000 --budget-max 20000000 --campaigns-per-brand 2 --skip-research --save-db
```

### Opsi `generate`
| Opsi | Keterangan | Default |
|------|-----------|---------|
| `--month` | Bulan target, mis. "Juli 2026" | (wajib) |
| `--brands` | `ayres`/`ava`/`saifenu`/`all` (boleh comma) | `all` |
| `--budget-min` / `--budget-max` | Rentang budget (rupiah) | (wajib) |
| `--campaigns-per-brand` | Jumlah campaign per brand | `10` |
| `--locations` / `--channels` | Daftar (comma) | kosong |
| `--model` | Override model Ollama | dari `.env` |
| `--output-dir` | Folder output | `outputs/` |
| `--format` | `json`/`markdown`/`csv`/`html`/`all` | `all` |
| `--dry-run` | Tampilkan query/tren/prompt tanpa memanggil Ollama | off |
| `--skip-research` | Lewati web search (pakai fallback tren) | off |
| `--save-db` | Simpan report ke MySQL | off |

### Command lain
```bash
python -m marketing_agent.cli check                              # status Ollama + DB
python -m marketing_agent.cli useradd --username u --password p  # tambah user login
```

---

## Menjalankan Backend API
```bash
uvicorn marketing_agent.api:app --reload --port 8000 --app-dir src
```
Docs interaktif (Swagger): <http://127.0.0.1:8000/docs>

| Endpoint | Method | Auth | Fungsi |
|----------|--------|------|--------|
| `/` | GET | – | Info API + daftar endpoint |
| `/api/health` | GET | – | Status server, Ollama (lokal/cloud + model tersedia), koneksi DB |
| `/api/login` | POST | – | Login → token (auto-seed admin bila `users` kosong) |
| `/api/me` | GET | ✅ | Validasi token, kembalikan username |
| `/api/brands` | GET | ✅ | Profil brand (dari `brand_profiles.yaml`) |
| `/api/generate` | POST | ✅ | Jalankan pipeline generate lengkap, simpan file (+DB opsional) |
| `/api/reports` | GET | ✅ | Daftar report tersimpan di DB (limit 1–200) |
| `/api/reports/{id}` | GET | ✅ | Detail satu report (JSON lengkap) |
| `/api/reports/{id}/download?format=` | GET | ✅ | Unduh file (`json`/`markdown`/`csv`/`html`); token boleh via `?token=` |

CORS diatur via `CORS_ORIGINS` (comma-separated) — **harus** memuat origin frontend
persis (termasuk skema `https://`), atau browser akan menolak request dengan
`Failed to fetch` walau backend sehat.

---

## Menjalankan Web Dashboard
1. Jalankan backend (port 8000) + MySQL aktif.
2. `cd frontend && npm run dev` → <http://localhost:3000>
3. **Login** (`admin`/`admin123`) → isi form → **Generate Campaign**.
   - Status sistem tampil subtle di header (dot hijau "Online" + tooltip detail Ollama/DB).
   - Hasil per brand (tab segmented) + kartu campaign ringkas; klik **"Lihat detail
     lengkap"** → modal berisi breakdown budget, ROI, risiko/mitigasi, timeline, dan
     **rincian skor** (progress bar per komponen).
   - Panel **Riwayat Report** (10 terakhir dari DB, bisa dibuka ulang) + tombol unduh
     JSON/MD/CSV/HTML per report.

Build produksi: `npm run build && npm start` (atau deploy ke platform Node — lihat
[Deployment](#deployment-production-railway--hostinger)).

**Struktur komponen kunci:**
`AuthGate` (gerbang login, `useSyncExternalStore`) → `Header` (logo, status, `UserMenu`)
→ `GenerateForm` (input) + `HistoryPanel` (riwayat) → `ReportView` (tab per brand) →
`CampaignCard` + `Modal` (detail & skor). `BackgroundVideo` dipakai di halaman login &
dashboard dengan teknik *dual-video crossfade* agar loop video tidak terlihat "melompat".

---

## Database
**Lokal (XAMPP):** start MySQL → app membuat database `ai_marketing_agent` + tabel
**otomatis** saat pertama kali dipakai. Default kredensial XAMPP (`root` tanpa password)
sudah sesuai `.env.example`.

**Managed hosting (Hostinger/Railway/dll):** buat database + user terlebih dulu di panel
hosting (user managed biasanya **tidak** punya izin `CREATE DATABASE`). App otomatis
mendeteksi ini — `_ensure_database()` bersifat *best-effort*, kegagalan `CREATE DATABASE`
diabaikan (dicatat sebagai warning), lalu app langsung membuat **tabel** di database yang
sudah ada. Mendukung juga variabel `DATABASE_URL` / `MYSQL_URL` (format
`mysql://user:pass@host:port/dbname`, otomatis dinormalisasi ke driver `pymysql` +
`charset=utf8mb4`).

**Tabel:** `users` (login), `reports` (metadata + JSON lengkap tiap report),
`campaigns` (satu baris per campaign, untuk query cepat tanpa parse JSON). Relasi:
satu `report` memiliki banyak `campaigns` (foreign key `report_id`, `ON DELETE CASCADE`).
Skema manual opsional tersedia di `db/schema.sql` (untuk import via phpMyAdmin bila diinginkan).

---

## Output Report
Tersimpan di `outputs/` dengan nama unik ber-timestamp, mis.
`campaign_report_20260604_120000.{json,md,csv,html}` — tidak pernah menimpa report lama.

- **JSON** — data lengkap (`FinalCampaignReport` ter-serialize), untuk integrasi/otomasi.
- **Markdown** — laporan rapi untuk tim marketing (lihat `examples/sample_output.md`).
- **CSV** — untuk spreadsheet, kolom: `brand, rank, final_priority_score, nama_campaign,
  jenis_kegiatan, produk_didorong, lokasi, channel, estimasi_budget, estimasi_roi, kpi, cta`.
- **HTML** — laporan visual, bisa dibuka langsung di browser tanpa server.

Tiap campaign memuat 23 field: nama, jenis kegiatan, produk, target peserta, lokasi,
channel, narasumber/partner + benefit untuknya, kontribusi brand, estimasi budget +
breakdown, benefit brand, estimasi & analisis ROI, relevansi tren, alasan masuk akal,
risiko + mitigasi, timeline pelaksanaan, KPI, CTA, konsep konten, kebutuhan tim, dan
**5 komponen skor + skor akhir**.

---

## Testing
```bash
pytest          # 39 test — tanpa Ollama/internet/DB (panggilan model di-stub)
ruff check .    # lint (bersih)
```

| File test | Jumlah | Cakupan |
|---|---|---|
| `test_models.py` | 7 | Validasi `CampaignInput` (budget, brand, `all`-expansion), koersi `CampaignDraft`. |
| `test_scoring.py` | 6 | Tiap komponen scoring (budget in/out of range, brand fit per brand, batas 0–100). |
| `test_prompt_builder.py` | 3 | Prompt memuat brand/bulan/budget/instruksi JSON + `skills.md` tersuntik. |
| `test_report_writer.py` | 6 | JSON/Markdown/CSV/HTML valid, kolom CSV lengkap, format tanggal Indonesia. |
| `test_trend_research.py` | 3 | Query berbeda per brand, fallback aktif saat search gagal/di-skip. |
| `test_campaign_generator.py` | 7 | Orkestrasi 30 campaign (10/brand) terurut & lengkap, top-up/truncate saat model over/under-deliver. |
| `test_auth.py` | 7 | Hash password (salt acak, verifikasi benar/salah), token (roundtrip, secret salah, tampered, kedaluwarsa). |

Semua test memakai *stub* pada lapisan HTTP Ollama (bukan mock generator terpisah) —
sehingga test tetap memverifikasi jalur kode produksi yang sesungguhnya, hanya
memotong panggilan jaringan yang lambat/tidak deterministik.

---

## Deployment Production (Railway + Hostinger)

Arsitektur yang **sedang berjalan**: **backend di Railway**, **frontend + MySQL di
Hostinger**. Panduan langkah-demi-langkah + tabel environment variable lengkap ada di
**[`DEPLOY_RAILWAY.md`](DEPLOY_RAILWAY.md)**. Ringkasan:

### Backend → Railway
File pendukung sudah siap di repo: `requirements.txt`, `Procfile`, `railway.json`
(Nixpacks, healthcheck `/api/health`), `.python-version` (3.12).
1. New Project → **Deploy from GitHub repo** → pilih repo (root directory dibiarkan
   kosong/`/` — Railway akan mendeteksi Python di root, bukan `frontend/`).
2. **Variables** yang wajib diisi: `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` (ke
   MySQL Hostinger, **jangan** set `DATABASE_URL`), `OLLAMA_BASE_URL/OLLAMA_API_KEY/
   OLLAMA_MODEL/OLLAMA_TIMEOUT`, `AUTH_SECRET_KEY/AUTH_DEFAULT_USER/AUTH_DEFAULT_PASSWORD`,
   `CORS_ORIGINS=https://domain-frontend`.
3. **Settings → Networking → Generate Domain** → dapat URL publik.
4. Verifikasi: `https://URL-RAILWAY/api/health` harus `"db_available": true`.

### MySQL → Hostinger
hPanel → **Databases → MySQL Databases** (buat DB + user, biasanya berprefix
`uXXXXXX_`) → **Databases → Remote MySQL** (izinkan host `%` karena IP Railway
dinamis; catat *host remote* yang ditampilkan, mis. `srvXXX.hstgr.io` — **bukan**
`localhost`, inilah nilai `DB_HOST`).

> Catatan keamanan: mengizinkan `%` pada Remote MySQL hanya membuka **database
> tersebut** ke internet (bukan database lain di hosting yang sama) dan setiap user
> MySQL terisolasi ke database miliknya sendiri — pastikan tetap memakai **password
> yang kuat** karena ini satu-satunya lapisan proteksi.

### Frontend → Hostinger
Deploy dari GitHub (root directory = `frontend`, framework Next.js terdeteksi
otomatis). **Wajib** set environment variable **sebelum build**:
```
NEXT_PUBLIC_API_BASE_URL=https://URL-RAILWAY
```
lalu jalankan **rebuild/deploy ulang** — variabel `NEXT_PUBLIC_*` di-*inline* ke bundle
JavaScript saat proses build, bukan dibaca saat runtime. Mengubah env tanpa rebuild
**tidak** akan berpengaruh. Pastikan juga `CORS_ORIGINS` di Railway = domain frontend
Hostinger ini persis.

> ⚠️ **Cache CDN Hostinger:** halaman utama disajikan dengan header
> `Cache-Control: s-maxage=31536000` (cache 1 tahun) lewat CDN Hostinger. Setelah
> rebuild frontend, jika perubahan belum terlihat di browser tertentu, lakukan
> **hard refresh** (`Ctrl+Shift+R`) atau buka di jendela private/incognito — bundle
> JS (`_next/static/...`) memakai content-hash sehingga aman di-cache selamanya,
> tapi dokumen HTML utama bisa tertahan di cache browser/CDU sebelum refresh dipaksa.

---

## Konfigurasi (.env) — Referensi Lengkap
```ini
# ===== Ollama (lokal default; cloud → isi OLLAMA_API_KEY + ubah base url/model) =====
OLLAMA_BASE_URL=http://localhost:11434    # cloud: https://ollama.com
OLLAMA_MODEL=gpt-oss                       # cloud: gpt-oss:20b atau gpt-oss:120b-cloud
OLLAMA_API_KEY=                            # diisi hanya untuk Ollama Cloud
OLLAMA_TEMPERATURE=0.7
OLLAMA_TOP_P=0.9
OLLAMA_TIMEOUT=180                         # naikkan (mis. 600) untuk model besar/cloud

# ===== Campaign default =====
DEFAULT_CAMPAIGNS_PER_BRAND=10
DEFAULT_OUTPUT_DIR=outputs
DUCKDUCKGO_MAX_RESULTS=5

# ===== Database (lokal XAMPP; managed hosting bisa pakai DATABASE_URL) =====
DB_ENABLED=true
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_marketing_agent
# DATABASE_URL=mysql://user:pass@host:3306/dbname   # override di atas bila diisi (Railway plugin, dll)

# ===== API / CORS =====
API_HOST=127.0.0.1
API_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# ===== Auth (WAJIB diganti di produksi) =====
AUTH_SECRET_KEY=ubah-secret-ini-di-produksi
AUTH_DEFAULT_USER=admin
AUTH_DEFAULT_PASSWORD=admin123
AUTH_TOKEN_TTL_HOURS=12
```
Frontend (`frontend/.env.local`, hanya untuk `npm run dev` lokal):
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

---

## Kustomisasi Keahlian AI (`skills.md`)
File **`skills.md`** di root project berisi panduan strategist marketing (framework
STP/funnel/AIDA, cara mengisi tiap field dengan berkualitas, playbook spesifik per brand,
estimasi biaya realistis, checklist kualitas sebelum output). Isi file ini **otomatis
disuntikkan ke prompt** (`prompt_builder.load_skills_guide()`) setiap kali generate,
sehingga AI bekerja berdasarkan panduan tersebut dan menghasilkan campaign yang lebih
lengkap & konsisten — tanpa perlu mengubah kode.

- Ubah gaya/standar output → **edit `skills.md`** langsung.
- Loader mencari `skills.md` di root project, lalu `data/skills.md` sebagai cadangan.
- Bila file dihapus/tidak ditemukan, sistem tetap berjalan normal (prompt dasar tanpa
  panduan tambahan, tidak crash).

---

## Struktur Project
```
ai-agent-marketing/
├── README.md · IMPLEMENTATION_PLAN.md · DEPLOY_RAILWAY.md · docs.md · skills.md
├── pyproject.toml · requirements.txt · Procfile · railway.json · .python-version
├── .env.example · .gitignore
├── data/
│   ├── brand_profiles.yaml       # profil Ayres/AVA/Saifenu
│   ├── campaign_reference.yaml   # pola referensi "Starter Pack"
│   └── scoring_config.yaml       # bobot & ambang scoring (bisa diedit tanpa ubah kode)
├── db/schema.sql                 # skema manual opsional (phpMyAdmin)
├── outputs/                      # hasil report, timestamped (gitignored)
├── examples/                     # sample_input.json · sample_output.md
├── src/marketing_agent/
│   ├── config.py        # Settings dari .env (Ollama, DB, CORS, Auth) + normalisasi DATABASE_URL
│   ├── models.py         # Skema Pydantic seluruh pipeline
│   ├── utils.py          # logger, format rupiah/tanggal ID, parse currency, slugify
│   ├── brand_profiles.py # loader YAML brand & referensi campaign
│   ├── trend_research.py # query builder + DuckDuckGo + filter + fallback
│   ├── prompt_builder.py # render Jinja2 + suntik skills.md
│   ├── ollama_client.py  # HTTP client Ollama (auth, retry, JSON extractor)
│   ├── campaign_generator.py  # orkestrasi per-brand & gabungan (paralel)
│   ├── scoring.py        # 5 komponen skor deterministik + sort/rank
│   ├── report_writer.py  # JSON/CSV/Markdown/HTML writer
│   ├── auth.py            # hash password (PBKDF2) + token (HMAC signed)
│   ├── db.py              # SQLAlchemy models (users/reports/campaigns) + operasi DB
│   ├── cli.py              # Typer: generate, check, useradd
│   ├── api.py               # FastAPI: auth + seluruh endpoint
│   └── templates/  brand_prompt · markdown_report · html_report (.jinja2)
├── tests/  test_models · test_scoring · test_prompt_builder · test_report_writer
│           test_trend_research · test_campaign_generator · test_auth  (39 test total)
└── frontend/  Next.js 16 + React 19 + Tailwind 4
    ├── app/          layout.tsx · page.tsx (AuthGate → Dashboard) · globals.css · icon.png
    ├── components/   Header · UserMenu · GenerateForm · ReportView · CampaignCard · Modal
    │                 HistoryPanel · LoginForm · AuthGate · BackgroundVideo · ScoreBadge
    └── lib/          api.ts (fetch+auth) · auth.ts (token storage) · useAuth.ts
                       useHealth.ts · config.ts (API_BASE) · types.ts (mirror Pydantic)
```

---

## Troubleshooting
| Masalah | Solusi |
|---------|--------|
| Frontend **"Failed to fetch"** saat login | Backend mati atau `NEXT_PUBLIC_API_BASE_URL` salah/belum di-set saat build. Cek `https://URL-BACKEND/api/health` langsung dulu; bila backend sehat tapi browser masih gagal, kemungkinan besar **cache** — lakukan hard refresh (`Ctrl+Shift+R`) karena CDN Hostinger meng-cache HTML lama (lihat catatan cache di bagian Deployment). |
| `db_available: false` di `/api/health` | DB tidak terjangkau. Lokal: pastikan MySQL XAMPP jalan. Remote: cek Remote MySQL sudah mengizinkan `%`, dan `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` (atau `DATABASE_URL`) benar. |
| Error CORS di browser (`blocked by CORS policy`) | Set `CORS_ORIGINS` di backend = domain frontend **persis** (termasuk `https://`, tanpa trailing slash), lalu redeploy backend. |
| `Ollama tidak berjalan...` | Start Ollama lokal (`ollama serve`), atau pakai Ollama Cloud (`OLLAMA_BASE_URL=https://ollama.com` + `OLLAMA_API_KEY`). |
| `Model belum tersedia...` | `ollama pull <model>` (lokal) atau sesuaikan `OLLAMA_MODEL` ke model yang tersedia di akun cloud. |
| Login `401 Unauthorized` | Cek username/password; admin default hanya ter-seed otomatis saat tabel `users` **masih kosong** dan DB harus aktif saat itu. |
| Output model bukan JSON valid | Sistem retry otomatis 2×; bila tetap gagal, raw response disimpan di `outputs/debug_raw_response.txt` untuk didiagnosis. |
| Web search gagal / tidak ada internet | Otomatis pakai fallback tren statis per brand; tambahkan `--skip-research` (CLI) atau toggle di form untuk melewati sejak awal. |
| Generate lama (>1 menit) untuk `brands=all` | Wajar untuk model besar (mis. `gpt-oss:120b-cloud`); brand sudah diproses paralel. Gunakan model lebih kecil (`gpt-oss:20b`) atau kurangi `campaigns_per_brand` untuk uji cepat. |

---

## Roadmap
- Streaming progress generate ke dashboard (Server-Sent Events), agar tidak "menunggu diam" saat model besar.
- Caching hasil riset tren per brand/bulan untuk mengurangi panggilan DuckDuckGo berulang.
- Trend relevance berbasis embedding (saat ini keyword/token matching sederhana).
- Manajemen user via dashboard (saat ini hanya via CLI `useradd`).
- Export PowerPoint/PDF untuk presentasi tim + penjadwalan generate otomatis tiap awal bulan.
