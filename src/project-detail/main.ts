import "../main.css";
import "./detail.css";
import { initI18n, t, getLang } from "../i18n";
import { PROJECTS, type Project, type LStr } from "./projects";
import { mountVisual } from "./visual";

// Arriving from the dark "Normal Mode" landing page (?theme=dark) should not
// dump the visitor into the retro peach page — keep it dark all the way
// through. Applied to <html> as early as possible so detail.css can react.
const isDarkMode = new URLSearchParams(location.search).get("theme") === "dark";

// "Back to projects" must return wherever the visitor actually came from:
// Normal Mode's own showcase (#capabilities) when dark, or the retro
// homepage's #projects when light. The retro link carries ?retro=1 because
// the homepage now boots into the Normal Mode overlay by default — the flag
// tells it to skip the overlay and land on the retro page itself.
const backHref = isDarkMode
  ? "/normal-mode/index.html#capabilities"
  : "/?retro=1#projects";

if (isDarkMode) {
  document.documentElement.setAttribute("data-theme", "dark");

  // Normal Mode sets all its copy in Space Grotesk (its --font-tech). Load it
  // only on this path so the retro/light page never pays for a font it
  // doesn't use.
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

  const navBack = document.querySelector<HTMLAnchorElement>(".dn-back");
  if (navBack) navBack.href = backHref;
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WA = "https://wa.me/6282226508883";

const lang = () => getLang();
const pick = (s: LStr): string => (lang() === "en" ? s.en : s.id);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ------------------------------- reveals ------------------------------- */

// Above-the-fold hero reveals immediately; the double rAF paints the
// opacity:0 start state before flipping so the transition actually runs.
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
    requestAnimationFrame(() => els.forEach((el) => el.classList.add("is-visible")));
  });
}

// Below-the-fold elements cascade in as scrolled into view; each unobserved
// once revealed so the effect plays once. threshold 0 (any pixel) so tall
// blocks never stay stuck invisible.
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
    { threshold: 0, rootMargin: "0px 0px -50px 0px" },
  );
  elements.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
  // Safety net: never leave content permanently invisible.
  setTimeout(() => {
    elements.forEach((el) => el.classList.add("is-visible"));
    io.disconnect();
  }, 4500);
}

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

/* ---------------------------- section markup --------------------------- */

function stepsMarkup(p: Project): string {
  const rows = p.steps
    .map(
      (s, i) => `
      <li class="fw-step">
        <span class="fw-step-node">${String(i + 1).padStart(2, "0")}</span>
        <div class="fw-step-body">
          <h3 class="fw-step-title">${escapeHtml(pick(s.title))}</h3>
          <p class="fw-step-text">${escapeHtml(pick(s.body))}</p>
        </div>
      </li>`,
    )
    .join("");
  return `
    <section class="det-section fw-section">
      <div class="det-head">
        <span class="det-eyebrow" data-i18n="detail.how">${t("detail.how")}</span>
        <h2 class="det-h2" data-i18n="detail.howTitle">${t("detail.howTitle")}</h2>
      </div>
      <ol class="fw-steps">${rows}</ol>
    </section>`;
}

function featuresMarkup(p: Project): string {
  const cards = p.features
    .map(
      (f, i) => `
      <article class="feat-card" style="--fi:${i}">
        <span class="feat-idx">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="feat-title">${escapeHtml(pick(f.title))}</h3>
        <p class="feat-text">${escapeHtml(pick(f.body))}</p>
      </article>`,
    )
    .join("");
  return `
    <section class="det-section feat-section">
      <div class="det-head">
        <span class="det-eyebrow" data-i18n="detail.edge">${t("detail.edge")}</span>
        <h2 class="det-h2" data-i18n="detail.edgeTitle">${t("detail.edgeTitle")}</h2>
      </div>
      <div class="feat-grid">${cards}</div>
    </section>`;
}

function resultsMarkup(p: Project): string {
  const items = p.results
    .map(
      (r) => `
      <li class="res-item">
        <span class="res-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" pathLength="1"/></svg>
        </span>
        <span class="res-text">${escapeHtml(pick(r))}</span>
      </li>`,
    )
    .join("");
  return `
    <section class="det-section res-section">
      <div class="det-head">
        <span class="det-eyebrow" data-i18n="detail.impact">${t("detail.impact")}</span>
        <h2 class="det-h2" data-i18n="detail.impactTitle">${t("detail.impactTitle")}</h2>
      </div>
      <ul class="res-list">${items}</ul>
      <div class="res-cta">
        <p class="res-cta-line" data-i18n="detail.ctaLine">${t("detail.ctaLine")}</p>
        <a class="res-cta-btn" href="${WA}" target="_blank" rel="noopener">
          <span data-i18n="detail.ctaBtn">${t("detail.ctaBtn")}</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>
        </a>
      </div>
    </section>`;
}

/* ------------------------- interactive touches ------------------------- */

// Thin progress bar at the very top that fills as the page scrolls.
function setupProgressBar() {
  let bar = document.getElementById("det-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "det-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
  }
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight || 1;
    bar!.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

// 3D tilt on the screenshot window, following the cursor. The idle floating
// bob animates the separate `translate` property, so both can run together.
// Skipped on touch devices and under reduced motion.
function setupShotTilt() {
  const shot = root.querySelector<HTMLElement>(".shot");
  if (!shot) return;
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches)
    return;
  shot.classList.add("has-tilt");
  shot.addEventListener("pointermove", (e) => {
    const r = shot.getBoundingClientRect();
    const kx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const ky = (e.clientY - r.top) / r.height - 0.5;
    shot.style.transform = `perspective(950px) rotateY(${(kx * 5).toFixed(
      2,
    )}deg) rotateX(${(-ky * 4).toFixed(2)}deg)`;
  });
  shot.addEventListener("pointerleave", () => {
    shot.style.transform = "perspective(950px) rotateY(0deg) rotateX(0deg)";
  });
}

// Radial glow that follows the cursor across each feature card.
function setupCardGlow() {
  root.querySelectorAll<HTMLElement>(".feat-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// Track which timeline step is closest to the viewport centre: it gets
// .is-active (pulsing node), everything above it .is-passed (filled node).
function setupStepTracking() {
  const steps = Array.from(root.querySelectorAll<HTMLElement>(".fw-step"));
  if (steps.length === 0) return;
  if (prefersReducedMotion) {
    steps.forEach((s) => s.classList.add("is-passed"));
    return;
  }
  let ticking = false;
  const update = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const mid = (window.innerHeight || 1) * 0.55;
      let active = -1;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top < mid) active = i;
      });
      steps.forEach((s, i) => {
        s.classList.toggle("is-active", i === active);
        s.classList.toggle("is-passed", i < active);
      });
      ticking = false;
    });
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Floating mini-CTA bar: appears once the visitor is past the first screen,
// disappears while the main CTA block is already in view.
function setupStickyCta() {
  const bar = root.querySelector<HTMLElement>(".sticky-cta");
  const mainCta = root.querySelector<HTMLElement>(".res-cta");
  if (!bar) return;
  let mainCtaVisible = false;
  if (mainCta && "IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        mainCtaVisible = entries[0]?.isIntersecting ?? false;
        update();
      },
      { threshold: 0 },
    ).observe(mainCta);
  }
  const update = () => {
    const past = window.scrollY > (window.innerHeight || 800) * 0.9;
    bar.classList.toggle("is-shown", past && !mainCtaVisible);
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function render() {
  const slug = new URLSearchParams(location.search).get("p") || "";
  const p = PROJECTS[slug];
  if (!p) return renderNotFound(slug);

  document.title = `${p.title} — Ayres`;

  root.innerHTML = `
    <div class="detail-hero">
      <p class="dh-tag">${escapeHtml(p.tag)}</p>
      <h1 class="dh-title reveal-boot">${escapeHtml(p.title)}</h1>
      <p class="dh-tagline">${escapeHtml(pick(p.tagline))}</p>
    </div>

    <figure class="shot">
      <div class="shot-bar">
        <span class="shot-dot"></span><span class="shot-dot"></span><span class="shot-dot"></span>
        <span class="shot-url">ayres://${escapeHtml(slug)}</span>
        <span class="shot-live" data-i18n="detail.live">${t("detail.live")}</span>
      </div>
      <div class="shot-frame" id="shot-canvas"></div>
    </figure>

    <section class="det-section intro-section">
      <p class="intro-lead">${escapeHtml(pick(p.intro))}</p>
    </section>

    <section class="det-section ps-section">
      <div class="ps-grid">
        <article class="ps-card ps-problem">
          <span class="ps-eyebrow" data-i18n="detail.problem">${t(
            "detail.problem",
          )}</span>
          <h2 class="ps-title" data-i18n="detail.problemTitle">${t(
            "detail.problemTitle",
          )}</h2>
          <p class="ps-text">${escapeHtml(pick(p.problem))}</p>
        </article>
        <div class="ps-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </div>
        <article class="ps-card ps-solution">
          <span class="ps-eyebrow" data-i18n="detail.solution">${t(
            "detail.solution",
          )}</span>
          <h2 class="ps-title" data-i18n="detail.solutionTitle">${t(
            "detail.solutionTitle",
          )}</h2>
          <p class="ps-text">${escapeHtml(pick(p.solution))}</p>
        </article>
      </div>
    </section>

    ${stepsMarkup(p)}
    ${featuresMarkup(p)}
    ${resultsMarkup(p)}

    <div class="detail-more">
      <a class="dh-back-btn" href="${backHref}" data-i18n="detail.backBtn">${t(
        "detail.backBtn",
      )}</a>
    </div>

    <div class="sticky-cta" aria-hidden="true">
      <span class="sc-text" data-i18n="detail.ctaLine">${t("detail.ctaLine")}</span>
      <a class="sc-btn" href="${WA}" target="_blank" rel="noopener">
        <span data-i18n="detail.ctaBtn">${t("detail.ctaBtn")}</span>
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>
      </a>
    </div>`;

  revealHeroChildren(root.querySelector(".detail-hero")!);
  revealOnScroll(
    Array.from(
      root.querySelectorAll<HTMLElement>(
        ".shot, .det-section, .ps-card, .ps-arrow, .fw-step, .feat-card, .res-item, .res-cta, .detail-more",
      ),
    ),
  );

  // live animated scene inside the window frame (replaces the old static
  // screenshot — every project gets its own interactive mini-demo)
  const canvasHost = root.querySelector<HTMLElement>("#shot-canvas");
  if (canvasHost) mountVisual(canvasHost, slug);

  setupProgressBar();
  setupShotTilt();
  setupCardGlow();
  setupStepTracking();
  setupStickyCta();
}

initI18n();
render();

// Language toggle re-renders the whole page so every project string swaps.
document.addEventListener("langchange", () => {
  render();
});
