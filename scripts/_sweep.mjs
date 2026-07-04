import puppeteer from "puppeteer-core";
const slugs = ["hr","crm","ai-medsos","ai-marketing","ssb","chatbot","company-profile","landing-page","online-shop","reseller","invitation"];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
const page = await browser.newPage();
page.on("pageerror", e => console.log("PAGEERROR:", String(e).slice(0,120)));
for (const s of slugs) {
  await page.goto(`http://localhost:4173/project.html?p=${s}`, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => [...document.querySelectorAll(".fd-canvas")].every(c => c.querySelector("svg") || c.querySelector("pre")),
    { timeout: 40000 });
  const r = await page.evaluate(() => ({
    svgs: document.querySelectorAll(".fd-canvas svg").length,
    fallbacks: document.querySelectorAll(".fd-canvas pre").length,
    maxW: Math.max(...[...document.querySelectorAll(".fd-canvas svg")].map(x => Math.round(x.getBoundingClientRect().width)), 0),
    intro: !!document.querySelector(".flow-intro"),
  }));
  console.log(`${s.padEnd(16)} svgs=${r.svgs} fallback=${r.fallbacks} maxW=${r.maxW} intro=${r.intro}`);
}
await browser.close();
