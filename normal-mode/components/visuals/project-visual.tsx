"use client";

import { useEffect, useRef } from "react";

/**
 * Per-project animated canvas visuals for the "Apps Behind Our Sales" grid.
 * Each project slug gets its own mini-scene in the shared house style
 * (dark bg, dot grid, purple/pink/blue accents) and reacts to the cursor.
 */

type Mouse = { x: number; y: number; active: boolean };
type DrawCtx = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  t: number; // ms since mount
  dt: number; // ms since last frame
  mouse: Mouse;
  S: Record<string, any>; // per-mount scratch state
};

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SANS = "ui-sans-serif, system-ui, -apple-system";

const FG = "rgba(224, 228, 244, 0.95)";
const DIM = "rgba(205, 210, 230, 0.5)";
const LINE = "rgba(255, 255, 255, 0.14)";

const acc = (hue: number, a: number, l = 70) => `hsla(${hue}, 82%, ${l}%, ${a})`;

function dotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const step = 8;
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  for (let y = step / 2; y < H; y += step)
    for (let x = step / 2; x < W; x += step) ctx.fillRect(x, y, 1, 1);
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function glowDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  hue: number,
  a = 1,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
  g.addColorStop(0, acc(hue, 0.35 * a));
  g.addColorStop(1, acc(hue, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = acc(hue, 0.95 * a, 78);
  ctx.fill();
}

function label(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  size = 9,
  color = DIM,
  align: CanvasTextAlign = "center",
) {
  ctx.fillStyle = color;
  ctx.font = `500 ${size}px ${MONO}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(s, x, y);
}

const easeOut = (k: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);
const easeIn = (k: number) => Math.pow(Math.min(1, Math.max(0, k)), 3);
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));

/* ------------------------------------------------------------------ */
/* HR — live clock + week of check-ins                                 */
/* ------------------------------------------------------------------ */
function drawHr({ ctx, W, H, t, mouse }: DrawCtx) {
  const CYCLE = 5600;
  const phase = (t % CYCLE) / CYCLE;
  const cx = W / 2;

  // cursor glow
  if (mouse.active) glowSpot(ctx, mouse.x, mouse.y, 60, 262, 0.14);

  // simulated clock, ticking fast
  const totalSec = Math.floor(8 * 3600 + 55 * 60 + (t / 1000) * 60) % 86400;
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  ctx.fillStyle = FG;
  ctx.font = `600 ${Math.min(34, W * 0.12)}px ${SANS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${hh}:${mm}:${ss}`, cx, H * 0.34);
  label(ctx, "SHIFT PAGI · GPS OK", cx, H * 0.34 + 16);

  // week strip
  const days = ["S", "S", "R", "K", "J", "S", "M"];
  const cell = Math.min(30, (W - 60) / 7 - 8);
  const totalW = days.length * (cell + 8) - 8;
  const x0 = cx - totalW / 2;
  const y0 = H * 0.56;
  const doneCount = Math.floor(t / CYCLE) % 8;
  for (let i = 0; i < days.length; i++) {
    const x = x0 + i * (cell + 8);
    const hov =
      mouse.active &&
      mouse.x > x &&
      mouse.x < x + cell &&
      mouse.y > y0 &&
      mouse.y < y0 + cell;
    rr(ctx, x, y0, cell, cell, 6);
    ctx.fillStyle = hov ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)";
    ctx.fill();
    ctx.strokeStyle = hov ? acc(262, 0.8) : LINE;
    ctx.lineWidth = 1;
    ctx.stroke();
    label(ctx, days[i], x + cell / 2, y0 + cell + 11, 8);

    const checked = i < doneCount;
    const isNow = i === doneCount;
    const k = checked ? 1 : isNow ? easeOut(phase * 3) : 0;
    if (k > 0.05) {
      ctx.strokeStyle = acc(isNow ? 320 : 262, 0.95);
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      const mx = x + cell / 2;
      const my = y0 + cell / 2;
      ctx.beginPath();
      ctx.moveTo(mx - 6, my);
      ctx.lineTo(mx - 6 + 5 * Math.min(1, k * 2), my + 4 * Math.min(1, k * 2));
      if (k > 0.5) {
        ctx.lineTo(mx - 1 + 8 * (k - 0.5) * 2 * 0.9, my + 4 - 10 * (k - 0.5) * 2 * 0.9);
      }
      ctx.stroke();
    }
  }

  // "check-in" chip pops at cycle start
  if (phase < 0.3) {
    const k = easeOut(phase / 0.12) * (phase > 0.22 ? 1 - (phase - 0.22) / 0.08 : 1);
    ctx.globalAlpha = clamp01(k);
    const w = 108;
    rr(ctx, cx - w / 2, H * 0.82, w, 20, 10);
    ctx.fillStyle = acc(150, 0.16);
    ctx.fill();
    ctx.strokeStyle = acc(150, 0.75);
    ctx.lineWidth = 1;
    ctx.stroke();
    label(ctx, "✓ CHECK-IN 08:55", cx, H * 0.82 + 10, 8, acc(150, 0.95, 80));
    ctx.globalAlpha = 1;
  }
}

function glowSpot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  hue: number,
  a: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, acc(hue, a));
  g.addColorStop(1, acc(hue, 0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/* ------------------------------------------------------------------ */
/* CRM — kanban chip travelling ORDER → PROD → SHIP                    */
/* ------------------------------------------------------------------ */
function drawCrm({ ctx, W, H, t, mouse }: DrawCtx) {
  const CYCLE = 5200;
  const phase = (t % CYCLE) / CYCLE;
  const cols = ["ORDER", "PRODUKSI", "KIRIM"];
  const pad = 18;
  const gap = 10;
  const colW = (W - pad * 2 - gap * 2) / 3;
  const colY = H * 0.16;
  const colH = H * 0.68;

  const colX = (i: number) => pad + i * (colW + gap);
  const hovCol = mouse.active
    ? cols.findIndex(
        (_, i) => mouse.x > colX(i) && mouse.x < colX(i) + colW,
      )
    : -1;

  for (let i = 0; i < 3; i++) {
    rr(ctx, colX(i), colY, colW, colH, 10);
    ctx.fillStyle =
      i === hovCol ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)";
    ctx.fill();
    ctx.strokeStyle = i === hovCol ? acc(262, 0.7) : LINE;
    ctx.lineWidth = 1;
    ctx.stroke();
    label(ctx, cols[i], colX(i) + colW / 2, colY + 14, 8);
    // ghost chips
    for (let g = 0; g < 2; g++) {
      const gy = colY + 30 + g * 22;
      rr(ctx, colX(i) + 8, gy, colW - 16, 14, 5);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fill();
    }
  }

  // hero chip journey
  const seg = phase * 3; // 0..3
  const idx = Math.min(2, Math.floor(seg));
  const k = easeOut((seg - idx) * 1.6);
  const fromX = colX(idx) + 8;
  const toX = colX(Math.min(2, idx + 1)) + 8;
  const chipX = idx >= 2 ? colX(2) + 8 : fromX + (toX - fromX) * (k > 0.55 ? easeOut((k - 0.55) / 0.45) : 0);
  const chipY = colY + 30 + 2 * 22 + 8;
  const hue = idx === 0 ? 215 : idx === 1 ? 285 : 150;

  rr(ctx, chipX, chipY, colW - 16, 16, 6);
  ctx.fillStyle = acc(hue, 0.18);
  ctx.fill();
  ctx.strokeStyle = acc(hue, 0.9);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  label(
    ctx,
    idx === 2 ? "✓ WO-812 SENT" : "WO-812",
    chipX + (colW - 16) / 2,
    chipY + 8,
    7.5,
    acc(hue, 0.95, 82),
  );
  glowSpot(ctx, chipX + (colW - 16) / 2, chipY + 8, 26, hue, 0.12);

  // progress dots under columns
  for (let i = 0; i < 3; i++) {
    const on = i <= idx;
    ctx.beginPath();
    ctx.arc(colX(i) + colW / 2, colY + colH + 12, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = on ? acc(285, 0.9) : "rgba(255,255,255,0.15)";
    ctx.fill();
  }
}

/* ------------------------------------------------------------------ */
/* AI MEDSOS — compose post → publish → likes rain                     */
/* ------------------------------------------------------------------ */
function drawMedsos({ ctx, W, H, t, dt, mouse, S }: DrawCtx) {
  const CYCLE = 6200;
  const phase = (t % CYCLE) / CYCLE;
  S.hearts ??= [] as { x: number; y: number; vy: number; life: number; hue: number }[];

  const cw = Math.min(120, W * 0.34);
  const ch = cw * 1.18;
  const cx = W / 2 - cw / 2;
  const flyK = phase > 0.62 ? easeIn((phase - 0.62) / 0.18) : 0;
  const gone = phase > 0.8;
  const cy = H * 0.5 - ch / 2 - flyK * (H * 0.5 + ch);

  if (!gone) {
    // card
    rr(ctx, cx, cy, cw, ch, 8);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.stroke();
    // avatar + handle
    ctx.beginPath();
    ctx.arc(cx + 12, cy + 12, 5, 0, Math.PI * 2);
    ctx.fillStyle = acc(285, 0.85);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(cx + 22, cy + 10, cw * 0.4, 3);
    // image area with animated gradient
    const iy = cy + 22;
    const ih = ch * 0.52;
    const g = ctx.createLinearGradient(cx, iy, cx + cw, iy + ih);
    const shift = (t / 40) % 360;
    g.addColorStop(0, `hsla(${250 + Math.sin(t / 900) * 30}, 70%, 55%, 0.55)`);
    g.addColorStop(1, `hsla(${(310 + shift / 8) % 360}, 75%, 60%, 0.45)`);
    rr(ctx, cx + 6, iy, cw - 12, ih, 6);
    ctx.fillStyle = g;
    ctx.fill();
    label(ctx, "AI DRAFT", cx + cw / 2, iy + ih / 2, 7, "rgba(255,255,255,0.85)");
    // caption typing
    const typeK = clamp01(phase / 0.45);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(cx + 8, iy + ih + 8, (cw - 16) * Math.min(1, typeK * 1.4), 3);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(cx + 8, iy + ih + 15, (cw - 16) * 0.7 * clamp01((typeK - 0.5) * 2), 3);
    // schedule chip
    if (phase > 0.5 && phase < 0.62) {
      const k = easeOut((phase - 0.5) / 0.08);
      ctx.globalAlpha = k;
      label(ctx, "⏱ 19:00 WIB — AUTO POST", cx + cw / 2, cy + ch + 12, 7.5, acc(215, 0.9, 80));
      ctx.globalAlpha = 1;
    }
  } else {
    // posted state
    label(ctx, "✓ POSTED @ayresapparel", W / 2, H * 0.3, 9, acc(150, 0.95, 80));
  }

  // hearts
  const spawnRate = gone ? 3 : phase > 0.62 ? 1 : 0;
  S.heartAcc = (S.heartAcc ?? 0) + spawnRate * (dt / 160);
  while (S.heartAcc > 1) {
    S.heartAcc -= 1;
    const bx = mouse.active ? mouse.x : W / 2 + (Math.random() - 0.5) * 60;
    S.hearts.push({
      x: bx + (Math.random() - 0.5) * 30,
      y: H * 0.9,
      vy: 0.6 + Math.random() * 0.8,
      life: 1,
      hue: Math.random() > 0.5 ? 320 : 285,
    });
  }
  for (let i = S.hearts.length - 1; i >= 0; i--) {
    const h = S.hearts[i];
    h.y -= h.vy * (dt / 16);
    h.x += Math.sin(t / 300 + i) * 0.4;
    h.life -= dt / 2400;
    if (h.life <= 0) {
      S.hearts.splice(i, 1);
      continue;
    }
    drawHeart(ctx, h.x, h.y, 5, acc(h.hue, h.life * 0.9, 75));
  }

  // like counter
  const likes = 1240 + Math.floor((t / CYCLE) % 1 === 0 ? 0 : (t % CYCLE) / 40) + Math.floor(t / CYCLE) * 155;
  label(ctx, `♥ ${likes.toLocaleString("en-US")}`, W - 16, H - 14, 9, acc(320, 0.9, 78), "right");
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 10, s / 10);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(-8, -4, -3, -10, 0, -5);
  ctx.bezierCurveTo(3, -10, 8, -4, 0, 4);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* AI MARKETING — growing campaign bars + trend line                   */
/* ------------------------------------------------------------------ */
function drawMarketing({ ctx, W, H, t, mouse }: DrawCtx) {
  const CYCLE = 5600;
  const phase = (t % CYCLE) / CYCLE;
  const pad = 26;
  const baseY = H * 0.78;
  const n = 7;
  const bw = (W - pad * 2) / n - 8;

  label(ctx, "CAMPAIGN REACH", pad, H * 0.14, 8, DIM, "left");
  const reach = Math.floor(easeOut(phase * 1.3) * 48200);
  ctx.fillStyle = FG;
  ctx.font = `600 20px ${SANS}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`+${reach.toLocaleString("en-US")}`, W - pad, H * 0.17);

  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = pad + i * (bw + 8);
    const target = (0.3 + 0.6 * Math.abs(Math.sin(i * 2.7 + 1))) * (0.5 + i / n / 2);
    const grow = easeOut(clamp01(phase * 2.2 - i * 0.12));
    let h = target * H * 0.5 * grow;
    // magnet: bar near cursor grows
    if (mouse.active) {
      const d = Math.abs(mouse.x - (x + bw / 2));
      h *= 1 + Math.max(0, 1 - d / 90) * 0.3;
    }
    const hue = 215 + (i / n) * 110;
    const g = ctx.createLinearGradient(0, baseY - h, 0, baseY);
    g.addColorStop(0, acc(hue, 0.85));
    g.addColorStop(1, acc(hue, 0.15));
    rr(ctx, x, baseY - h, bw, h, 4);
    ctx.fillStyle = g;
    ctx.fill();
    pts.push([x + bw / 2, baseY - h]);
  }

  // trend line above bars
  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    const yy = y - 12;
    if (i === 0) ctx.moveTo(x, yy);
    else ctx.lineTo(x, yy);
  });
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.4;
  ctx.setLineDash([1, 0]);
  ctx.stroke();
  const last = pts[pts.length - 1];
  glowDot(ctx, last[0], last[1] - 12, 3, 320);

  ctx.strokeStyle = LINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, baseY + 1);
  ctx.lineTo(W - pad, baseY + 1);
  ctx.stroke();
  label(ctx, "IG · TIKTOK · ADS · EMAIL", W / 2, baseY + 14, 7.5);
}

/* ------------------------------------------------------------------ */
/* SSB — football pitch, ball passing between players                  */
/* ------------------------------------------------------------------ */
function drawSsb({ ctx, W, H, t, mouse, S }: DrawCtx) {
  const pad = 22;
  const fx = pad;
  const fy = H * 0.14;
  const fw = W - pad * 2;
  const fh = H * 0.72;

  // pitch
  rr(ctx, fx, fy, fw, fh, 10);
  ctx.fillStyle = "rgba(120, 240, 170, 0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(140, 235, 180, 0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(fx + fw / 2, fy);
  ctx.lineTo(fx + fw / 2, fy + fh);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx + fw / 2, fy + fh / 2, fh * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  // goals
  ctx.strokeRect(fx - 4, fy + fh * 0.35, 4, fh * 0.3);
  ctx.strokeRect(fx + fw, fy + fh * 0.35, 4, fh * 0.3);

  // players 2-3-1
  const P: [number, number][] = [
    [0.14, 0.3],
    [0.14, 0.7],
    [0.42, 0.2],
    [0.45, 0.55],
    [0.42, 0.85],
    [0.78, 0.45],
  ].map(([u, v]) => [fx + u * fw, fy + v * fh]);

  const SEQ = [0, 2, 3, 1, 4, 3, 5];
  const SEG = 700;
  const total = SEQ.length * SEG;
  const tt = t % (total + 900);
  const scoring = tt > total;
  S.trail ??= [];

  let bx: number, by: number;
  let targetIdx = SEQ[SEQ.length - 1];
  if (!scoring) {
    const si = Math.min(SEQ.length - 2, Math.floor(tt / SEG));
    const k = easeOut(((tt % SEG) / SEG) * 1.15);
    let [ax, ay] = P[SEQ[si]];
    let bxy = P[SEQ[si + 1]];
    // hover: pass toward player nearest cursor
    if (mouse.active) {
      let best = 0;
      let bd = 1e9;
      P.forEach(([px, py], i) => {
        const d = (px - mouse.x) ** 2 + (py - mouse.y) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      bxy = P[best];
      targetIdx = best;
    } else {
      targetIdx = SEQ[si + 1];
    }
    const mxp = (ax + bxy[0]) / 2;
    const myp = (ay + bxy[1]) / 2 - 26; // arc
    bx = (1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mxp + k * k * bxy[0];
    by = (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * myp + k * k * bxy[1];
    // trail
    if (Number.isFinite(bx) && Number.isFinite(by)) S.trail.push([bx, by]);
    if (S.trail.length > 10) S.trail.shift();
  } else {
    // shot on goal + flash
    const k = easeIn(clamp01((tt - total) / 500));
    const [sx, sy] = P[5];
    bx = sx + (fx + fw + 2 - sx) * k;
    by = sy + (fy + fh / 2 - sy) * k;
    if (k >= 1) {
      ctx.fillStyle = acc(150, 0.9, 80);
      ctx.font = `700 16px ${SANS}`;
      ctx.textAlign = "center";
      ctx.fillText("GOAL!", fx + fw * 0.82, fy + fh * 0.25);
    }
  }

  // trail
  S.trail.forEach(([tx, ty]: [number, number], i: number) => {
    ctx.beginPath();
    ctx.arc(tx, ty, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${(i / 10) * 0.35})`;
    ctx.fill();
  });

  P.forEach(([px, py], i) => {
    const isT = i === targetIdx;
    glowDot(ctx, px, py, isT ? 6 : 5, i < 5 ? 262 : 320, isT ? 1 : 0.75);
  });
  // ball
  if (Number.isFinite(bx!) && Number.isFinite(by!)) {
    ctx.beginPath();
    ctx.arc(bx!, by!, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  label(ctx, "JADWAL · PEMBAYARAN · LAPORAN", W / 2, H - 10, 7.5);
}

/* ------------------------------------------------------------------ */
/* CHATBOT — chat thread: question → typing → answer                   */
/* ------------------------------------------------------------------ */
function drawChatbot({ ctx, W, H, t, mouse }: DrawCtx) {
  const speed = mouse.active ? 2 : 1;
  const CYCLE = 6800 / speed;
  const tt = (t % CYCLE) / CYCLE;
  const pad = 20;
  const bw = W * 0.52;

  const bubble = (
    y: number,
    right: boolean,
    w: number,
    lines: number,
    k: number,
    hue?: number,
  ) => {
    if (k <= 0) return;
    const bh = 12 + lines * 9;
    const x = right ? W - pad - w : pad;
    ctx.globalAlpha = clamp01(k * 1.4);
    const rise = (1 - easeOut(k)) * 10;
    rr(ctx, x, y + rise, w, bh, 9);
    if (right && hue != null) {
      const g = ctx.createLinearGradient(x, y, x + w, y + bh);
      g.addColorStop(0, acc(262, 0.5));
      g.addColorStop(1, acc(320, 0.42));
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.07)";
    }
    ctx.fill();
    ctx.strokeStyle = right ? acc(285, 0.55) : LINE;
    ctx.lineWidth = 1;
    ctx.stroke();
    for (let l = 0; l < lines; l++) {
      ctx.fillStyle = `rgba(255,255,255,${right ? 0.55 : 0.3})`;
      const lw = (w - 20) * (l === lines - 1 ? 0.55 : 0.9);
      ctx.fillRect(x + 10, y + rise + 9 + l * 9, lw * clamp01(k * 2 - l * 0.3), 3);
    }
    ctx.globalAlpha = 1;
  };

  // conversation timeline
  bubble(H * 0.12, false, bw, 2, clamp01(tt / 0.12));
  // typing dots
  if (tt > 0.18 && tt < 0.42) {
    const x = W - pad - 54;
    const y = H * 0.42;
    rr(ctx, x, y, 54, 20, 10);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const bump = Math.sin(t / 130 - i * 0.9) * 3;
      ctx.beginPath();
      ctx.arc(x + 14 + i * 13, y + 10 + Math.min(0, bump), 2.4, 0, Math.PI * 2);
      ctx.fillStyle = acc(285, 0.9);
      ctx.fill();
    }
  }
  bubble(H * 0.42, true, bw * 1.05, 3, clamp01((tt - 0.42) / 0.14), 285);
  bubble(H * 0.78, false, bw * 0.6, 1, clamp01((tt - 0.66) / 0.12));

  // status row
  label(ctx, mouse.active ? "● AI ONLINE — FAST MODE" : "● AI ONLINE 24/7", pad, H - 12, 7.5, acc(150, 0.85, 75), "left");
  label(ctx, "WA BUSINESS", W - pad, H - 12, 7.5, DIM, "right");
}

/* ------------------------------------------------------------------ */
/* COMPANY PROFILE — auto-scrolling browser page                       */
/* ------------------------------------------------------------------ */
function drawProfile({ ctx, W, H, t, mouse }: DrawCtx) {
  const pad = 18;
  const bx = pad;
  const by = H * 0.1;
  const bw = W - pad * 2;
  const bh = H * 0.8;

  // browser chrome
  rr(ctx, bx, by, bw, bh, 10);
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fill();
  ctx.strokeStyle = LINE;
  ctx.stroke();
  const barH = 20;
  ctx.beginPath();
  ctx.moveTo(bx, by + barH);
  ctx.lineTo(bx + bw, by + barH);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(bx + 12 + i * 10, by + barH / 2, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fill();
  }
  rr(ctx, bx + 44, by + 5, bw * 0.5, 10, 5);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();
  label(ctx, "ayresapparel.com", bx + 44 + (bw * 0.5) / 2, by + 10, 6.5);

  // page content (virtual, scrolling)
  const vh = bh - barH;
  const pageH = vh * 2.3;
  const maxS = pageH - vh;
  const CYCLE = 9000;
  const ph = (t % CYCLE) / CYCLE;
  const autoS = (ph < 0.5 ? easeOut(ph * 2) : easeOut((1 - ph) * 2)) * maxS;
  const scroll = mouse.active
    ? clamp01((mouse.y - by) / bh) * maxS
    : autoS;

  ctx.save();
  ctx.beginPath();
  ctx.rect(bx + 1, by + barH + 1, bw - 2, vh - 2);
  ctx.clip();
  const ox = bx + 12;
  const oy = by + barH + 10 - scroll;
  const cw = bw - 24;

  // hero block
  const g = ctx.createLinearGradient(ox, oy, ox + cw, oy + vh * 0.5);
  g.addColorStop(0, acc(258, 0.4));
  g.addColorStop(1, acc(215, 0.25));
  rr(ctx, ox, oy, cw, vh * 0.5, 6);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillRect(ox + 12, oy + vh * 0.18, cw * 0.44, 5);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(ox + 12, oy + vh * 0.18 + 11, cw * 0.3, 3);

  // text rows
  let yy = oy + vh * 0.5 + 12;
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(ox, yy, cw * (0.95 - i * 0.18), 3);
    yy += 9;
  }
  // two-column image blocks
  yy += 8;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const iw = (cw - 8) / 2;
      rr(ctx, ox + c * (iw + 8), yy + r * (vh * 0.3 + 8), iw, vh * 0.3, 5);
      ctx.fillStyle = `hsla(${262 + (r * 2 + c) * 24}, 60%, 60%, 0.22)`;
      ctx.fill();
      ctx.strokeStyle = LINE;
      ctx.stroke();
    }
  }
  yy += 2 * (vh * 0.3 + 8) + 8;
  // footer rows
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fillRect(ox, yy + i * 9, cw * (0.5 - i * 0.15), 3);
  }
  ctx.restore();

  // scrollbar
  const sbH = (vh / pageH) * vh;
  const sbY = by + barH + (scroll / maxS) * (vh - sbH);
  rr(ctx, bx + bw - 6, sbY, 3, sbH, 2);
  ctx.fillStyle = acc(262, 0.6);
  ctx.fill();

  label(ctx, "ID ↔ EN · i18n", W / 2, H - 8, 7);
}

/* ------------------------------------------------------------------ */
/* LANDING PAGE — cursor clicks CTA, leads counter goes up             */
/* ------------------------------------------------------------------ */
function drawLanding({ ctx, W, H, t, mouse, S }: DrawCtx) {
  const CYCLE = 4200;
  const phase = (t % CYCLE) / CYCLE;
  S.leads ??= 128;
  S.lastCycle ??= -1;

  const cyc = Math.floor(t / CYCLE);
  const bw = Math.min(150, W * 0.44);
  const bh = 34;
  let bx = W / 2 - bw / 2;
  let by = H * 0.42 - bh / 2;
  // magnet toward cursor
  if (mouse.active) {
    bx += (mouse.x - W / 2) * 0.08;
    by += (mouse.y - H * 0.42) * 0.08;
  }

  // fake cursor flies in and clicks
  const k = easeOut(clamp01(phase / 0.4));
  const clickT = 0.48;
  const clicked = phase > clickT;
  if (clicked && S.lastCycle !== cyc) {
    S.lastCycle = cyc;
    S.leads += 1;
  }
  const press = clicked ? 1 - clamp01((phase - clickT) / 0.1) : 0;

  // ripples
  if (clicked) {
    const rk = clamp01((phase - clickT) / 0.4);
    for (const m of [0, 0.35]) {
      const kk = clamp01(rk - m) / (1 - m);
      if (kk <= 0 || kk >= 1) continue;
      ctx.beginPath();
      ctx.arc(bx + bw / 2, by + bh / 2, 20 + kk * 70, 0, Math.PI * 2);
      ctx.strokeStyle = acc(285, (1 - kk) * 0.5);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // headline ghost
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(W / 2 - W * 0.24, H * 0.16, W * 0.48, 5);
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.fillRect(W / 2 - W * 0.17, H * 0.16 + 12, W * 0.34, 3);

  // CTA button
  const scale = 1 - press * 0.08;
  ctx.save();
  ctx.translate(bx + bw / 2, by + bh / 2);
  ctx.scale(scale, scale);
  const g = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
  g.addColorStop(0, acc(258, 0.95, 62));
  g.addColorStop(1, acc(215, 0.95, 60));
  rr(ctx, -bw / 2, -bh / 2, bw, bh, bh / 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = `600 11px ${SANS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ORDER VIA WHATSAPP", 0, 0.5);
  ctx.restore();
  glowSpot(ctx, bx + bw / 2, by + bh / 2, 70, 262, 0.2);

  // fake cursor (hidden while user hovers)
  if (!mouse.active) {
    const sx = W * 0.85;
    const sy = H * 0.85;
    const cx2 = sx + (bx + bw / 2 + 14 - sx) * k;
    const cy2 = sy + (by + bh / 2 + 12 - sy) * k;
    ctx.save();
    ctx.translate(cx2, cy2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 13);
    ctx.lineTo(3.6, 9.6);
    ctx.lineTo(6.4, 15);
    ctx.lineTo(8.8, 13.8);
    ctx.lineTo(6, 8.6);
    ctx.lineTo(11, 8.2);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
  }

  // leads counter
  const pop = clicked ? easeOut(clamp01((phase - clickT) / 0.15)) : 0;
  ctx.fillStyle = FG;
  ctx.font = `600 ${15 + pop * 3}px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillText(`${S.leads} LEADS`, W / 2, H * 0.78);
  label(ctx, "CONVERSION-FIRST · CTA WA", W / 2, H * 0.78 + 16, 7.5);
}

/* ------------------------------------------------------------------ */
/* ONLINE SHOP — products fly into the cart                            */
/* ------------------------------------------------------------------ */
function drawShop({ ctx, W, H, t, mouse, S }: DrawCtx) {
  const CYCLE = 4600;
  const phase = (t % CYCLE) / CYCLE;
  const cyc = Math.floor(t / CYCLE);
  S.count ??= 2;
  S.lastCyc ??= -1;

  // cart (top right)
  const cx = W * 0.82;
  const cy = H * 0.22;
  const landed = phase > 0.62;
  if (landed && S.lastCyc !== cyc) {
    S.lastCyc = cyc;
    S.count += 1;
  }
  const bump = landed ? Math.sin(clamp01((phase - 0.62) / 0.25) * Math.PI) * 3 : 0;

  // products row
  const n = 3;
  const pw = Math.min(58, W * 0.16);
  const phh = pw * 1.15;
  const gap = 14;
  const x0 = W / 2 - ((pw + gap) * n - gap) / 2 - W * 0.08;
  const py = H * 0.52;
  const active = cyc % n;

  for (let i = 0; i < n; i++) {
    let x = x0 + i * (pw + gap);
    let y = py;
    let sc = 1;
    let alpha = 1;
    const hov = mouse.active && Math.abs(mouse.x - (x + pw / 2)) < pw && Math.abs(mouse.y - (y + phh / 2)) < phh;
    if (hov) y -= 6;
    if (i === active && phase > 0.28) {
      const k = easeIn(clamp01((phase - 0.28) / 0.34));
      const mx = (x + cx) / 2;
      const my = Math.min(y, cy) - 40;
      const nx = (1 - k) * (1 - k) * x + 2 * (1 - k) * k * mx + k * k * (cx - 10);
      const ny = (1 - k) * (1 - k) * y + 2 * (1 - k) * k * my + k * k * (cy - 6);
      x = nx;
      y = ny;
      sc = 1 - k * 0.75;
      alpha = 1 - k * 0.4;
      if (phase > 0.62) alpha = 0;
    }
    if (alpha <= 0) continue;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + pw / 2, y + phh / 2);
    ctx.scale(sc, sc);
    rr(ctx, -pw / 2, -phh / 2, pw, phh, 7);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = hov ? acc(285, 0.85) : LINE;
    ctx.stroke();
    // jersey icon-ish
    const hue = 215 + i * 45;
    const g = ctx.createLinearGradient(0, -phh / 4, 0, phh / 4);
    g.addColorStop(0, acc(hue, 0.75));
    g.addColorStop(1, acc(hue + 30, 0.45));
    rr(ctx, -pw * 0.28, -phh * 0.3, pw * 0.56, phh * 0.42, 4);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(-pw * 0.28, phh * 0.2, pw * 0.56, 3);
    ctx.fillRect(-pw * 0.28, phh * 0.2 + 7, pw * 0.36, 3);
    ctx.restore();
  }

  // cart icon
  ctx.save();
  ctx.translate(cx, cy - bump);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.6;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-12, -6);
  ctx.lineTo(-7, -6);
  ctx.lineTo(-4, 8);
  ctx.lineTo(9, 8);
  ctx.lineTo(12, -3);
  ctx.lineTo(-6, -3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-1, 13, 2, 0, Math.PI * 2);
  ctx.arc(7, 13, 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();
  ctx.restore();
  // badge
  const bs = landed ? 1 + Math.sin(clamp01((phase - 0.62) / 0.2) * Math.PI) * 0.25 : 1;
  ctx.beginPath();
  ctx.arc(cx + 14, cy - 14 - bump, 8 * bs, 0, Math.PI * 2);
  ctx.fillStyle = acc(320, 0.95, 62);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `700 8px ${SANS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(S.count), cx + 14, cy - 13.5 - bump);

  // checkout bar
  const barW = W * 0.5;
  rr(ctx, W / 2 - barW / 2, H * 0.87, barW, 5, 3);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  rr(ctx, W / 2 - barW / 2, H * 0.87, barW * easeOut(phase), 5, 3);
  const g2 = ctx.createLinearGradient(W / 2 - barW / 2, 0, W / 2 + barW / 2, 0);
  g2.addColorStop(0, acc(258, 0.9));
  g2.addColorStop(1, acc(320, 0.9));
  ctx.fillStyle = g2;
  ctx.fill();
  label(ctx, "CART → JNE → PAID", W / 2, H * 0.87 + 14, 7.5);
}

/* ------------------------------------------------------------------ */
/* RESELLER — orbiting partner network, goods out / payouts in         */
/* ------------------------------------------------------------------ */
function drawReseller({ ctx, W, H, t, mouse, S }: DrawCtx) {
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.32;
  const n = 7;
  const dir = mouse.active ? ((mouse.x - cx) / W) * 4 : 1;
  S.rot = (S.rot ?? 0) + 0.00022 * dir * 16;

  // spokes + nodes
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = S.rot + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * R;
    const y = cy + Math.sin(a) * R * 0.78;
    nodes.push([x, y, 250 + ((i * 26) % 90)]);
  }
  ctx.lineWidth = 0.7;
  for (const [x, y, hue] of nodes) {
    ctx.strokeStyle = acc(hue, 0.16);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // flowing particles: goods out (pink), payout in (amber)
  for (let i = 0; i < n; i++) {
    const [x, y] = nodes[i];
    const k1 = ((t / 1400) + i * 0.37) % 1;
    ctx.beginPath();
    ctx.arc(cx + (x - cx) * k1, cy + (y - cy) * k1, 2, 0, Math.PI * 2);
    ctx.fillStyle = acc(320, 0.8 * (1 - k1 * 0.4));
    ctx.fill();
    const k2 = ((t / 1800) + i * 0.53) % 1;
    ctx.beginPath();
    ctx.arc(x + (cx - x) * k2, y + (cy - y) * k2, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(42, 90%, 65%, ${0.85 * (1 - k2 * 0.3)})`;
    ctx.fill();
  }

  // center diamond (house style)
  glowSpot(ctx, cx, cy, 46, 262, 0.3);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4 + Math.sin(t / 1400) * 0.05);
  ctx.fillStyle = "#0a0a0a";
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.rect(-14, -14, 28, 28);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  label(ctx, "AYRES", cx, cy + 26, 8, FG);

  // partner nodes
  nodes.forEach(([x, y, hue], i) => {
    const d = mouse.active ? Math.hypot(mouse.x - x, mouse.y - y) : 1e9;
    const boost = Math.max(0, 1 - d / 70);
    const r = 11 + boost * 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0f0f0f";
    ctx.fill();
    ctx.strokeStyle = acc(hue, 0.6 + boost * 0.4);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    label(ctx, `R${i + 1}`, x, y, 7, acc(hue, 0.95, 85));
  });

  // payout ticker
  const payout = 4.2 + ((t / 900) % 100) * 0.01 + Math.floor(t / 90000);
  label(ctx, `PAYOUT Rp ${payout.toFixed(2)} jt`, W - 16, H - 12, 8, "hsla(42, 90%, 70%, 0.95)", "right");
  label(ctx, "KATALOG → ORDER → KOMISI", 16, H - 12, 7.5, DIM, "left");
}

/* ------------------------------------------------------------------ */
/* INVITATION — envelope opens, card rises, confetti                   */
/* ------------------------------------------------------------------ */
function drawInvitation({ ctx, W, H, t, dt, mouse, S }: DrawCtx) {
  const CYCLE = 6800;
  const phase = (t % CYCLE) / CYCLE;
  const cx = W / 2;
  const cy = H * 0.58;
  const ew = Math.min(130, W * 0.36);
  const eh = ew * 0.62;
  S.conf ??= [];
  S.rsvp ??= 87;
  S.lastCyc ??= -1;
  const cyc = Math.floor(t / CYCLE);

  const openK = easeOut(clamp01((phase - 0.08) / 0.2));
  const cardK = easeOut(clamp01((phase - 0.26) / 0.28));
  const closeK = phase > 0.78 ? easeIn((phase - 0.78) / 0.22) : 0;
  const lift = cardK * eh * 0.72 * (1 - closeK);

  if (cardK > 0.9 && S.lastCyc !== cyc) {
    S.lastCyc = cyc;
    S.rsvp += 1;
    for (let i = 0; i < 26; i++) {
      S.conf.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy - eh * 0.9,
        vx: (Math.random() - 0.5) * 3.4,
        vy: -2.4 - Math.random() * 2.2,
        hue: [258, 285, 320, 205, 42][i % 5],
        life: 1,
        rot: Math.random() * Math.PI,
      });
    }
  }
  // hover confetti trickle
  if (mouse.active && Math.random() < 0.3) {
    S.conf.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 1.5,
      hue: [258, 285, 320, 205, 42][Math.floor(Math.random() * 5)],
      life: 0.8,
      rot: Math.random() * Math.PI,
    });
  }

  // card rising from envelope
  const cw = ew * 0.82;
  const chh = eh * 1.05;
  const cardY = cy - eh / 2 - lift;
  if (cardK > 0.02 && closeK < 1) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - ew, cardY - chh, ew * 2, chh + eh * 0.5);
    ctx.clip();
    rr(ctx, cx - cw / 2, cardY - chh + eh * 0.5, cw, chh, 5);
    ctx.fillStyle = "rgba(250, 246, 238, 0.94)";
    ctx.fill();
    ctx.fillStyle = "rgba(20,20,30,0.75)";
    ctx.font = `600 8px ${SANS}`;
    ctx.textAlign = "center";
    ctx.fillText("GRAND OPENING", cx, cardY - chh + eh * 0.5 + 16);
    ctx.fillStyle = "rgba(20,20,30,0.4)";
    ctx.fillRect(cx - cw * 0.32, cardY - chh + eh * 0.5 + 24, cw * 0.64, 2.4);
    ctx.fillRect(cx - cw * 0.24, cardY - chh + eh * 0.5 + 31, cw * 0.48, 2.4);
    // gold seal
    ctx.beginPath();
    ctx.arc(cx, cardY - chh + eh * 0.5 + chh * 0.68, 7, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(42, 85%, 62%, 0.95)";
    ctx.fill();
    ctx.restore();
  }

  // envelope body
  rr(ctx, cx - ew / 2, cy - eh / 2, ew, eh, 6);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fill();
  ctx.strokeStyle = acc(285, 0.6);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // V fold
  ctx.beginPath();
  ctx.moveTo(cx - ew / 2, cy - eh / 2 + 2);
  ctx.lineTo(cx, cy + eh * 0.12);
  ctx.lineTo(cx + ew / 2, cy - eh / 2 + 2);
  ctx.strokeStyle = acc(285, 0.35);
  ctx.stroke();
  // flap (opens by flattening)
  const flapH = eh * 0.46 * (1 - openK * (1 - closeK)) - eh * 0.46 * 0;
  ctx.beginPath();
  ctx.moveTo(cx - ew / 2, cy - eh / 2);
  ctx.lineTo(cx, cy - eh / 2 - (openK * (1 - closeK) > 0.5 ? flapH : -flapH));
  ctx.lineTo(cx + ew / 2, cy - eh / 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(20, 16, 28, 0.85)";
  ctx.fill();
  ctx.strokeStyle = acc(285, 0.6);
  ctx.stroke();

  // confetti physics
  for (let i = S.conf.length - 1; i >= 0; i--) {
    const c = S.conf[i];
    c.x += c.vx * (dt / 16);
    c.y += c.vy * (dt / 16);
    c.vy += 0.09 * (dt / 16);
    c.rot += 0.12;
    c.life -= dt / 2600;
    if (c.life <= 0 || c.y > H + 10) {
      S.conf.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = acc(c.hue, Math.min(1, c.life) * 0.9);
    ctx.fillRect(-2.4, -1.2, 4.8, 2.4);
    ctx.restore();
  }

  // RSVP counter
  label(ctx, `RSVP: ${S.rsvp} HADIR`, cx, H * 0.93, 9, acc(150, 0.95, 78));
  label(ctx, "AUTO → GOOGLE SHEETS + EMAIL", cx, H * 0.93 + 12, 6.8);
}

/* ------------------------------------------------------------------ */

const DRAWERS: Record<string, (d: DrawCtx) => void> = {
  hr: drawHr,
  crm: drawCrm,
  "ai-medsos": drawMedsos,
  "ai-marketing": drawMarketing,
  ssb: drawSsb,
  chatbot: drawChatbot,
  "company-profile": drawProfile,
  "landing-page": drawLanding,
  "online-shop": drawShop,
  reseller: drawReseller,
  invitation: drawInvitation,
};

export function ProjectVisual({ kind }: { kind: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let visible = true;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let last = 0;
    const started = performance.now();
    const S: Record<string, any> = {};
    const mouse: Mouse = { x: 0, y: 0, active: false };
    const draw = DRAWERS[kind];

    function sizeUp() {
      const r = wrap!.getBoundingClientRect();
      W = Math.max(280, r.width);
      H = Math.max(160, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame(now: number) {
      if (!running) return;
      // schedule the next frame FIRST so a drawing exception can never kill
      // the loop and leave a permanently blank card
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = now - started;
      const dt = Math.min(50, last ? now - last : 16);
      last = now;
      try {
        // hard-reset context state (a throwing drawer may leave transforms,
        // alpha, dashes or clips behind)
        ctx!.reset?.();
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx!.globalAlpha = 1;
        ctx!.setLineDash([]);
        ctx!.lineCap = "butt";
        ctx!.lineJoin = "miter";
        ctx!.clearRect(0, 0, W, H);
        dotGrid(ctx!, W, H);
        if (draw) draw({ ctx: ctx!, W, H, t, dt, mouse, S });
      } catch {
        /* skip this frame; the next one starts from a clean slate */
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);

    sizeUp();
    const ro = new ResizeObserver(sizeUp);
    ro.observe(wrap);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [kind]);

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
