// Screenshot helper for visual verification (dev-only, not shipped).
// Usage: node scripts/_shot.mjs <slug> <outdir>
import puppeteer from "puppeteer-core";

const slug = process.argv[2] || "ssb";
const outdir = process.argv[3] || ".";

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(`http://localhost:4173/project.html?p=${slug}`, {
  waitUntil: "networkidle0",
  timeout: 30000,
});
// wait until every diagram frame contains an svg (or fallback)
await page.waitForFunction(
  () =>
    [...document.querySelectorAll(".fd-canvas")].length > 0 &&
    [...document.querySelectorAll(".fd-canvas")].every(
      (c) => c.querySelector("svg") || c.querySelector("pre"),
    ),
  { timeout: 30000 },
);
const stats = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll(".fd-canvas svg")];
  return {
    diagrams: document.querySelectorAll(".flow-diagram").length,
    svgs: svgs.length,
    fallbacks: document.querySelectorAll(".fd-canvas pre").length,
    widths: svgs.map((s) => Math.round(s.getBoundingClientRect().width)),
  };
});
console.log(JSON.stringify(stats));

// full page (capped) + first two diagram close-ups
await page.screenshot({ path: `${outdir}/${slug}-top.png` });
const figs = await page.$$(".flow-diagram");
for (let i = 0; i < Math.min(figs.length, 3); i++) {
  await figs[i].scrollIntoView();
  await new Promise((r) => setTimeout(r, 250));
  await figs[i].screenshot({ path: `${outdir}/${slug}-diag${i}.png` });
}
await browser.close();
