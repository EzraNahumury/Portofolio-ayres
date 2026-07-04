// When Normal Mode is showing inside the retro site's iframe overlay, links
// back to the retro site should hand control back via postMessage instead
// of navigating the iframe itself — otherwise the retro page (overlay and
// all) would load a second time nested inside the iframe. Visited
// standalone (no parent frame), callers should fall back to a normal
// navigation.
export function isInsideRetroFrame() {
  return typeof window !== "undefined" && window.self !== window.top;
}

export function goToRetroMode(hash?: string) {
  if (!isInsideRetroFrame()) return false;
  window.parent.postMessage(
    { type: "ayres:retro-mode", hash: hash || null },
    window.location.origin
  );
  return true;
}
