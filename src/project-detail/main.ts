import "../main.css";
import "./detail.css";
import mermaid from "mermaid";
import { marked } from "marked";
import flows from "./flows.json";
import { initI18n, t, getLang } from "../i18n";

// Arriving from the dark "Normal Mode" landing page (?theme=dark) should not
// dump the visitor into the retro peach page — keep it dark all the way
// through. Applied to <html> as early as possible so detail.css can react.
const isDarkMode = new URLSearchParams(location.search).get("theme") === "dark";

// "Back to projects" must return wherever the visitor actually came from:
// the retro homepage's #projects, or Normal Mode's own project showcase
// (#capabilities) — never hardcoded to the retro path regardless of theme.
const backHref = isDarkMode
  ? "/normal-mode/index.html#capabilities"
  : "/#projects";

if (isDarkMode) {
  document.documentElement.setAttribute("data-theme", "dark");

  // Normal Mode sets all its card/heading/body copy in Space Grotesk (its
  // --font-tech). Load it only on this path so the retro/light page never
  // pays for a font it doesn't use.
  const preconnect1 = document.createElement("link");
  preconnect1.rel = "preconnect";
  preconnect1.href = "https://fonts.googleapis.com";
  const preconnect2 = document.createElement("link");
  preconnect2.rel = "preconnect";
  preconnect2.href = "https://fonts.gstatic.com";
  preconnect2.crossOrigin = "anonymous";
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap";
  document.head.append(preconnect1, preconnect2, fontLink);

  // The top-nav "← Projects" link is static markup in project.html (already
  // in the DOM before this script runs) — repoint it here rather than
  // hardcoding two conflicting hrefs in the HTML.
  const navBack = document.querySelector<HTMLAnchorElement>(".dn-back");
  if (navBack) navBack.href = backHref;
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero content (tag/title/blurb/kicker) is always above the fold, so it
// reveals immediately on render rather than waiting for a scroll trigger.
// The double rAF ensures the browser paints the opacity:0 starting state
// before the class flip, so the transition actually animates.
function revealHeroChildren(container: Element) {
  const els = Array.from(container.children) as HTMLElement[];
  els.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.08}s`;
  });
  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      els.forEach((el) => el.classList.add("is-visible"));
    });
  });
}

// Below-the-fold sections (flow blocks, the closing "back to overview" link)
// cascade in as they're scrolled into view, each unobserved once revealed so
// the effect only ever plays once per visit.
//
// threshold must stay 0 (fire as soon as a single pixel is visible), not a
// proportion: flow blocks can contain several stacked diagrams several
// hundred to 1000+px tall each, so a block can easily run to 3000-6000px
// tall. A proportional threshold like 0.12 would require ~600px+ of it
// visible at once just to cross 12% — a window most normal scrolling never
// hits, so the block (and its diagram) would stay stuck at opacity:0
// forever, i.e. silently "disappear".
function revealOnScroll(elements: HTMLElement[]) {
  if (elements.length === 0) return;
  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add("reveal", "is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" },
  );
  elements.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i, 3) * 0.06}s`;
    io.observe(el);
  });

  // Safety net: content must never stay permanently invisible because of an
  // observer edge case (unusual scroll pattern, viewport quirk, etc.) — force
  // anything still unrevealed into view after a few seconds.
  setTimeout(() => {
    elements.forEach((el) => el.classList.add("is-visible"));
    io.disconnect();
  }, 4000);
}

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
      <a class="dh-back-btn" href="${backHref}" data-i18n="detail.backBtn">${t(
        "detail.backBtn",
      )}</a>
    </div>`;
  revealHeroChildren(root.querySelector(".detail-hero")!);
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

  if (prefersReducedMotion) {
    overlay.classList.add("is-open");
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add("is-open"));
    });
  }

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

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener("keydown", onKey);
    if (prefersReducedMotion) {
      document.body.classList.remove("fd-lock");
      overlay.remove();
      return;
    }
    overlay.classList.remove("is-open");
    const finish = () => {
      document.body.classList.remove("fd-lock");
      overlay.remove();
    };
    overlay.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 300); // safety net if transitionend never fires
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
      <section class="flow-block" data-num="${num}">
        <h2 class="flow-title"><span class="ft-num">${num}</span>${escapeHtml(
          s.title,
        )}</h2>
        <div class="flow-body">${marked.parse(s.body) as string}</div>
      </section>`;
    })
    .join("");

  // "00" — what this project is, before diving into the flows
  const introHtml = `
      <section class="flow-block flow-intro" data-num="00">
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
      <a class="dh-back-btn" href="${backHref}" data-i18n="detail.backBtn">${t(
        "detail.backBtn",
      )}</a>
    </div>`;
  revealHeroChildren(root.querySelector(".detail-hero")!);
  revealOnScroll(
    Array.from(root.querySelectorAll<HTMLElement>(".flow-block, .detail-more")),
  );

  // Theme tuned to the site palette: warm cream nodes, charcoal actors,
  // orange accent frames. A parallel dark set (same accent colors, dark
  // canvas) keeps diagrams legible when arriving from Normal Mode.
  //
  // htmlLabels:false — labels are plain SVG <text>, measured with getBBox,
  // immune to page CSS (fixes the inflated-diamond / mis-placed label bug).
  // useMaxWidth:false — diagrams render at natural size and scroll inside
  // their frame instead of being shrunk to unreadable sizes.
  const lightThemeVariables = {
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
  };

  // Matches Normal Mode's own palette (near-black surfaces, violet→blue
  // brand accent) rather than the retro site's amber — so a diagram doesn't
  // read as a color scheme swap away from the page it's embedded in.
  const darkThemeVariables = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "15px",
    // generic nodes (flowchart / state / misc)
    primaryColor: "#18181c",
    primaryBorderColor: "#9181f5",
    primaryTextColor: "#f2f2f5",
    secondaryColor: "#1c1c22",
    secondaryBorderColor: "#4361fc",
    tertiaryColor: "#141418",
    tertiaryBorderColor: "#407aff",
    lineColor: "#6b6f8c",
    textColor: "#f2f2f5",
    // flowchart subgraphs
    clusterBkg: "#18181c",
    clusterBorder: "#9181f5",
    edgeLabelBackground: "#1c1c22",
    // sequence diagrams
    actorBkg: "#18181c",
    actorBorder: "#9181f5",
    actorTextColor: "#f2f2f5",
    actorLineColor: "#4d4f66",
    signalColor: "#c9d3cf",
    signalTextColor: "#f2f2f5",
    labelBoxBkgColor: "#4361fc",
    labelBoxBorderColor: "#0f0f0f",
    labelTextColor: "#ffffff",
    loopTextColor: "#f2f2f5",
    noteBkgColor: "#1c1c22",
    noteBorderColor: "#4361fc",
    noteTextColor: "#f2f2f5",
    activationBkgColor: "#1c1c22",
    activationBorderColor: "#9181f5",
  };

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    themeVariables: isDarkMode ? darkThemeVariables : lightThemeVariables,
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
      requestAnimationFrame(() => canvas.classList.add("is-rendered"));
    } catch {
      canvas.innerHTML = `<pre class="flow-code"><code>${escapeHtml(
        src,
      )}</code></pre>`;
      fig.querySelector(".fd-expand")?.remove();
      canvas.classList.add("is-rendered");
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
