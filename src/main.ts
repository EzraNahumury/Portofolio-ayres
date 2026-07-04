import "./main.css";
import WebGL from "./webgl";
import { initI18n } from "./i18n";

initI18n();
WebGL();

const root = document.documentElement;

function onScroll() {
  if (window.scrollY > 10) root.dataset.scroll = "true";
  else root.dataset.scroll = "false";
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
