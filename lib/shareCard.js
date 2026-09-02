"use client";

/**
 * Renders a shareable "certificate" image for a diamond — the visual
 * payload behind the save/share moment at the end of the details
 * sheet. Built on an offscreen canvas so no external asset or
 * html-to-image library is needed.
 */

const WIDTH = 1080;
const HEIGHT = 1000;

function fontStack(varName, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCheckBadge(ctx, cx, cy, r) {
  ctx.save();
  ctx.strokeStyle = "#c9a35d";
  ctx.lineWidth = r * 0.12;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.08, cy + r * 0.32);
  ctx.lineTo(cx + r * 0.46, cy - r * 0.28);
  ctx.stroke();
  ctx.restore();
}

export async function buildShareCard({ diamond, giaRecord, tracrRecord, url }) {
  if (typeof document === "undefined") return null;
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* proceed with whatever fonts are already loaded */
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const displayFont = fontStack("--font-family-display", "Georgia, serif");
  const uiFont = fontStack("--font-family-ui", "-apple-system, sans-serif");

  const bgGrad = ctx.createRadialGradient(
    WIDTH / 2, HEIGHT * 0.32, 80,
    WIDTH / 2, HEIGHT * 0.32, HEIGHT * 0.9
  );
  bgGrad.addColorStop(0, "#17181a");
  bgGrad.addColorStop(1, "#0b0b0c");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 40, 40, WIDTH - 80, HEIGHT - 80, 36);
  ctx.stroke();

  ctx.textAlign = "center";
  let y = 150;

  ctx.fillStyle = "#c9a35d";
  ctx.font = `600 26px ${uiFont}`;
  ctx.fillText("N A T U R A L   D I A M O N D   ·   V E R I F I E D", WIDTH / 2, y);

  y += 92;
  ctx.fillStyle = "#f3efe7";
  ctx.font = `400 92px ${displayFont}`;
  ctx.fillText(diamond.name, WIDTH / 2, y);

  y += 56;
  ctx.fillStyle = "#a9a49b";
  ctx.font = `400 34px ${uiFont}`;
  ctx.fillText(`${diamond.shape} · ${diamond.carat.toFixed(2)} ct`, WIDTH / 2, y);

  y += 100;
  drawCheckBadge(ctx, WIDTH / 2 - 176, y - 12, 24);
  ctx.textAlign = "left";
  ctx.fillStyle = "#f3efe7";
  ctx.font = `500 32px ${uiFont}`;
  ctx.fillText("Trust Mark Verified", WIDTH / 2 - 138, y - 1);

  y += 90;
  const specs = [
    ["COLOR", diamond.color],
    ["CLARITY", diamond.clarity],
    ["CUT", diamond.cut],
  ];
  const gap = 20;
  const colW = (WIDTH - 160 - gap * (specs.length - 1)) / specs.length;
  specs.forEach(([label, value], i) => {
    const cx = 80 + (colW + gap) * i;
    roundedRect(ctx, cx, y, colW, 132, 20);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#706c65";
    ctx.font = `600 20px ${uiFont}`;
    ctx.fillText(label, cx + 26, y + 46);
    ctx.fillStyle = "#f3efe7";
    ctx.font = `400 40px ${displayFont}`;
    ctx.fillText(String(value), cx + 26, y + 94);
  });

  y += 190;
  if (giaRecord) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#706c65";
    ctx.font = `600 20px ${uiFont}`;
    ctx.fillText("GIA INSCRIPTION NO.", 80, y);
    ctx.fillStyle = "#f3efe7";
    ctx.font = `400 32px ${uiFont}`;
    ctx.fillText(`GIA ${giaRecord.reportNumber}`, 80, y + 40);
  }
  if (tracrRecord) {
    ctx.textAlign = "right";
    ctx.fillStyle = "#706c65";
    ctx.font = `600 20px ${uiFont}`;
    ctx.fillText("TRACR ID", WIDTH - 80, y);
    ctx.fillStyle = "#f3efe7";
    ctx.font = `400 32px ${uiFont}`;
    ctx.fillText(tracrRecord.tracrId, WIDTH - 80, y + 40);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(80, HEIGHT - 140);
  ctx.lineTo(WIDTH - 80, HEIGHT - 140);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#a9a49b";
  ctx.font = `400 28px ${uiFont}`;
  ctx.fillText(url.replace(/^https?:\/\//, ""), WIDTH / 2, HEIGHT - 90);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
