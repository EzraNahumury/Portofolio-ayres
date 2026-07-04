import "../main.css";
import "./detail.css";
import mermaid from "mermaid";
import { marked } from "marked";
import flows from "./flows.json";
import { initI18n, t, getLang } from "../i18n";

type Section = { title: string; body: string };
type Project = {
  title: string;
  tag: string;
  blurb: string;
  desc: string;
  descEn: string;
  sections: Section[];
};

const pickDesc = (p: Project): string =>
  getLang() === "en" ? p.descEn || p.desc : p.desc || p.descEn;

// Short card blurb: English lives in flows.json, Indonesian in the i18n
// dictionary (same string the homepage cards use).
function pickBlurb(slug: string, p: Project): string {
  if (getLang() === "en") return p.blurb;
  const localized = t(`proj.${slug}.desc`);
  return localized === `proj.${slug}.desc` ? p.blurb : localized;
}

const DB = flows as unknown as Record<string, Project>;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Mermaid sources collected during markdown parsing; rendered afterwards via
// mermaid.render() into clean <div>s. Rendering inside <pre> (mermaid.run's
// default flow) leaks pre/white-space styling into the HTML labels and breaks
// mermaid's text measurement — that's what inflated the diamond shapes.
let diagramSources: string[] = [];

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }): string => {
  if ((lang || "").trim().toLowerCase() === "mermaid") {
    const idx = diagramSources.push(text) - 1;
    return `
      <figure class="flow-diagram" data-mid="${idx}">
        <figcaption class="fd-bar">
          <span class="fd-label" data-i18n="detail.diagram">${t(
            "detail.diagram",
          )}</span>
          <button class="fd-expand" type="button" data-i18n="detail.expand">${t(
            "detail.expand",
          )}</button>
        </figcaption>
        <div class="fd-scroll"><div class="fd-canvas"><span class="fd-loading">rendering&hellip;</span></div></div>
      </figure>`;
  }
  return `<pre class="flow-code"><code>${escapeHtml(text)}</code></pre>`;
};

marked.use({ renderer });

const root = document.getElementById("detail-root")!;

function renderNotFound(slug: string) {
  document.title = `${t("detail.nfTitle")} — Ayres`;
  root.innerHTML = `
    <div class="detail-hero">
      <p class="dh-tag">404</p>
      <h1 class="dh-title" data-i18n="detail.nfTitle">${t("detail.nfTitle")}</h1>
      <p class="dh-blurb"><b>"${escapeHtml(slug)}"</b> — <span data-i18n="detail.nfMsg">${t(
        "detail.nfMsg",
      )}</span></p>
      <a class="dh-back-btn" href="/#projects" data-i18n="detail.backBtn">${t(
        "detail.backBtn",
      )}</a>
    </div>`;
}

/* ---------------- fullscreen diagram overlay with zoom ---------------- */

function svgNaturalWidth(svgEl: SVGSVGElement): number {
  const vb = svgEl.getAttribute("viewBox");
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2] > 0) return parts[2];
  }
  const w = parseFloat(svgEl.getAttribute("width") || "");
  return Number.isFinite(w) && w > 0 ? w : 800;
}

function openOverlay(svgHtml: string, title: string) {
  const overlay = document.createElement("div");
  overlay.className = "fd-overlay";
  overlay.innerHTML = `
    <div class="fdo-bar">
      <span class="fdo-title">${escapeHtml(title)}</span>
      <span class="fdo-controls">
        <button type="button" class="fdo-btn" data-act="out" title="Perkecil">&minus;</button>
        <span class="fdo-zoom">100%</span>
        <button type="button" class="fdo-btn" data-act="in" title="Perbesar">+</button>
        <button type="button" class="fdo-btn" data-act="reset" title="Reset">1:1</button>
        <button type="button" class="fdo-btn fdo-close" data-act="close" title="Tutup">&#x2715;</button>
      </span>
    </div>
    <div class="fdo-body"><div class="fdo-canvas">${svgHtml}</div></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add("fd-lock");

  const svgEl = overlay.querySelector<SVGSVGElement>(".fdo-canvas svg");
  const zoomLabel = overlay.querySelector(".fdo-zoom")!;
  const base = svgEl ? svgNaturalWidth(svgEl) : 800;
  let z = 1;

  const apply = () => {
    if (svgEl) {
      svgEl.style.width = `${Math.round(base * z)}px`;
      svgEl.style.maxWidth = "none";
      svgEl.style.height = "auto";
    }
    zoomLabel.textContent = `${Math.round(z * 100)}%`;
  };
  apply();

  const close = () => {
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("fd-lock");
    overlay.remove();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "+" || e.key === "=") { z = Math.min(3, z + 0.2); apply(); }
    if (e.key === "-") { z = Math.max(0.4, z - 0.2); apply(); }
  };
  document.addEventListener("keydown", onKey);

  overlay.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-act]");
    if (!btn) {
      if (e.target === overlay) close();
      return;
    }
    const act = btn.dataset.act;
    if (act === "in") z = Math.min(3, z + 0.2);
    else if (act === "out") z = Math.max(0.4, z - 0.2);
    else if (act === "reset") z = 1;
    else if (act === "close") return close();
    apply();
  });
}

/* --------------------------- page rendering --------------------------- */

async function render() {
  const slug = new URLSearchParams(location.search).get("p") || "";
  const p = DB[slug];
  if (!p) return renderNotFound(slug);

  document.title = `${p.title} — Flow — Ayres`;
  diagramSources = [];

  const sectionsHtml = p.sections
    .map((s, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `
      <section class="flow-block">
        <h2 class="flow-title"><span class="ft-num">${num}</span>${escapeHtml(
          s.title,
        )}</h2>
        <div class="flow-body">${marked.parse(s.body) as string}</div>
      </section>`;
    })
    .join("");

  // "00" — what this project is, before diving into the flows
  const introHtml = `
      <section class="flow-block flow-intro">
        <h2 class="flow-title"><span class="ft-num">00</span>${escapeHtml(
          p.title,
        )}</h2>
        <div class="flow-body">
          <p class="fi-label" data-i18n="detail.about">${t("detail.about")}</p>
          <p class="fi-desc">${escapeHtml(pickDesc(p))}</p>
        </div>
      </section>`;

  root.innerHTML = `
    <div class="detail-hero">
      <p class="dh-tag">${escapeHtml(p.tag)}</p>
      <h1 class="dh-title">${escapeHtml(p.title)}</h1>
      <p class="dh-blurb">${escapeHtml(pickBlurb(slug, p))}</p>
      <p class="dh-kicker"><span data-i18n="detail.kicker">${t(
        "detail.kicker",
      )}</span> &mdash; ${p.sections.length} <span data-i18n="detail.flows">${t(
        "detail.flows",
      )}</span></p>
    </div>
    <div class="flow-list">${introHtml}${sectionsHtml}</div>
    <div class="detail-more">
      <a class="dh-back-btn" href="/#projects" data-i18n="detail.backBtn">${t(
        "detail.backBtn",
      )}</a>
    </div>`;

  // Theme tuned to the site palette: warm cream nodes, charcoal actors,
  // orange accent frames.
  //
  // htmlLabels:false — labels are plain SVG <text>, measured with getBBox,
  // immune to page CSS (fixes the inflated-diamond / mis-placed label bug).
  // useMaxWidth:false — diagrams render at natural size and scroll inside
  // their frame instead of being shrunk to unreadable sizes.
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    themeVariables: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: "15px",
      // generic nodes (flowchart / state / misc)
      primaryColor: "#fff3e0",
      primaryBorderColor: "#b25b12",
      primaryTextColor: "#3b2a18",
      secondaryColor: "#fbe7cf",
      secondaryBorderColor: "#8a5a2b",
      tertiaryColor: "#fdeeda",
      tertiaryBorderColor: "#8a5a2b",
      lineColor: "#7a4a1d",
      textColor: "#3b2a18",
      // flowchart subgraphs
      clusterBkg: "#fbe7cf",
      clusterBorder: "#b25b12",
      edgeLabelBackground: "#ffe9b0",
      // sequence diagrams
      actorBkg: "#525252",
      actorBorder: "#140f08",
      actorTextColor: "#f6d4b1",
      actorLineColor: "#a98963",
      signalColor: "#5a3d1e",
      signalTextColor: "#3b2a18",
      labelBoxBkgColor: "#f99021",
      labelBoxBorderColor: "#b25b12",
      labelTextColor: "#140f08",
      loopTextColor: "#3b2a18",
      noteBkgColor: "#ffe9b0",
      noteBorderColor: "#c98a2e",
      noteTextColor: "#3b2a18",
      activationBkgColor: "#f6d4b1",
      activationBorderColor: "#b25b12",
    },
    flowchart: {
      curve: "basis",
      useMaxWidth: false,
      htmlLabels: false,
      nodeSpacing: 40,
      rankSpacing: 46,
      padding: 10,
    },
    sequence: {
      useMaxWidth: false,
      mirrorActors: false, // no duplicate actor row at the bottom
      wrap: true,
      width: 200, // participant box width — avoids mid-word breaks
      actorMargin: 50,
      messageMargin: 36,
      boxMargin: 10,
      noteMargin: 10,
    },
    state: {
      useMaxWidth: false,
    },
  });

  // Render each diagram into its frame; a failed diagram falls back to its
  // source instead of taking down the rest of the page.
  const figures = root.querySelectorAll<HTMLElement>(".flow-diagram");
  for (const fig of figures) {
    const idx = Number(fig.dataset.mid);
    const src = diagramSources[idx] ?? "";
    const canvas = fig.querySelector<HTMLElement>(".fd-canvas")!;
    try {
      const { svg } = await mermaid.render(`mmd-${slug}-${idx}`, src);
      canvas.innerHTML = svg;
      const svgEl = canvas.querySelector<SVGSVGElement>("svg");
      if (svgEl) {
        // if the diagram is narrower than the frame it just centers;
        // wider ones scroll horizontally at readable size
        svgEl.style.maxWidth = "none";
        svgEl.style.height = "auto";
      }
      const btn = fig.querySelector<HTMLButtonElement>(".fd-expand");
      const titleEl = fig.closest(".flow-block")?.querySelector(".flow-title");
      const numTxt = titleEl?.querySelector(".ft-num")?.textContent?.trim() ?? "";
      const rawTitle = (titleEl?.textContent ?? p.title).trim();
      const overlayTitle =
        numTxt && rawTitle.startsWith(numTxt)
          ? `${numTxt} — ${rawTitle.slice(numTxt.length).trim()}`
          : rawTitle;
      btn?.addEventListener("click", () => openOverlay(svg, overlayTitle));
    } catch {
      canvas.innerHTML = `<pre class="flow-code"><code>${escapeHtml(
        src,
      )}</code></pre>`;
      fig.querySelector(".fd-expand")?.remove();
    }
  }
}

initI18n();
render();

// Language toggle: data-i18n elements are swapped by applyI18n(); the project
// description is per-project data, so swap it here.
document.addEventListener("langchange", () => {
  const slug = new URLSearchParams(location.search).get("p") || "";
  const p = DB[slug];
  if (!p) return;
  const descEl = root.querySelector<HTMLElement>(".fi-desc");
  if (descEl) descEl.textContent = pickDesc(p);
  const blurbEl = root.querySelector<HTMLElement>(".dh-blurb");
  if (blurbEl) blurbEl.textContent = pickBlurb(slug, p);
});
