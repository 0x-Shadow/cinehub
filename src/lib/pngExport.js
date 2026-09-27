function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawGradientBackground(ctx, w, h) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#0a0a0b");
  grad.addColorStop(0.5, "#0f0f12");
  grad.addColorStop(1, "#0a0a0b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const glow1 = ctx.createRadialGradient(w * 0.15, h * 0.1, 0, w * 0.15, h * 0.1, w * 0.5);
  glow1.addColorStop(0, "rgba(255, 176, 32, 0.12)");
  glow1.addColorStop(1, "transparent");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, w, h);

  const glow2 = ctx.createRadialGradient(w * 0.85, h * 0.9, 0, w * 0.85, h * 0.9, w * 0.5);
  glow2.addColorStop(0, "rgba(255, 176, 32, 0.08)");
  glow2.addColorStop(1, "transparent");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, w, h);
}

function drawGlassCard(ctx, x, y, w, h, r) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  roundRect(ctx, x, y, w, h, r);
  const sheen = ctx.createLinearGradient(x, y, x + w, y + h);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.06)");
  sheen.addColorStop(0.5, "transparent");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0.02)");
  ctx.fillStyle = sheen;
  ctx.fill();
  ctx.restore();
}

function drawPoster(ctx, img, x, y, w, h, r) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawStatCard(ctx, x, y, w, h, value, label, accentColor) {
  drawGlassCard(ctx, x, y, w, h, 16);

  ctx.fillStyle = accentColor;
  ctx.font = "700 28px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(value), x + w / 2, y + h / 2 - 10);

  ctx.fillStyle = "#6b6b76";
  ctx.font = "600 10px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.fillText(label.toUpperCase(), x + w / 2, y + h / 2 + 14);
}

function drawBranding(ctx, w, h, format) {
  ctx.fillStyle = "#ffb020";
  ctx.font = "600 12px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const brandY = format === "story" ? h - 40 : h - 30;
  ctx.fillText("CINEHUB", w / 2, brandY);

  ctx.fillStyle = "#6b6b76";
  ctx.font = "400 10px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
  ctx.fillText("Made with CineHub", w / 2, brandY + 18);
}

export async function generateWatchlistPNG(items, stats, format = "story") {
  const formats = {
    story: { w: 1080, h: 1920, cols: 3, rows: 2, pad: 60 },
    poster: { w: 1080, h: 1080, cols: 3, rows: 2, pad: 60 },
    wide: { w: 1200, h: 630, cols: 6, rows: 1, pad: 40 },
  };

  const cfg = formats[format] || formats.story;
  const canvas = document.createElement("canvas");
  canvas.width = cfg.w;
  canvas.height = cfg.h;
  const ctx = canvas.getContext("2d");

  drawGradientBackground(ctx, cfg.w, cfg.h);

  const headerH = format === "wide" ? 80 : 140;
  const footerH = format === "wide" ? 60 : 100;
  const gridH = cfg.h - headerH - footerH - 80;

  const titleSize = format === "wide" ? 32 : 48;
  ctx.fillStyle = "#f5f5f7";
  ctx.font = `700 ${titleSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("My Watchlist", cfg.w / 2, headerH / 2 + 10);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = `400 ${format === "wide" ? 14 : 18}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
  ctx.fillText(`${items.length} titles · ${stats.hours}h ${stats.minutes}m of watching`, cfg.w / 2, headerH / 2 + titleSize / 2 + 20);

  const gridTop = headerH + 40;
  const gap = format === "wide" ? 12 : 16;
  const posterW = (cfg.w - cfg.pad * 2 - gap * (cfg.cols - 1)) / cfg.cols;
  const posterH = format === "wide" ? posterW * 1.5 : Math.min(posterW * 1.5, gridH / cfg.rows - 20);

  const images = await Promise.all(
    items.slice(0, cfg.cols * cfg.rows).map(
      (item) =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = `https://image.tmdb.org/t/p/w300${item.posterPath}`;
        })
    )
  );

  images.forEach((img, i) => {
    const col = i % cfg.cols;
    const row = Math.floor(i / cfg.cols);
    const x = cfg.pad + col * (posterW + gap);
    const y = gridTop + row * (posterH + gap + 24);

    if (img) {
      drawPoster(ctx, img, x, y, posterW, posterH, 12);
    } else {
      ctx.save();
      roundRect(ctx, x, y, posterW, posterH, 12);
      ctx.fillStyle = "#1c1c21";
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = "#a1a1aa";
    ctx.font = "400 11px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const title = items[i].title.length > 18 ? items[i].title.slice(0, 18) + "..." : items[i].title;
    ctx.fillText(title, x + posterW / 2, y + posterH + 6);
  });

  const statsY = gridTop + cfg.rows * (posterH + gap + 24) + 20;
  const statW = format === "wide" ? 120 : 140;
  const statH = format === "wide" ? 60 : 70;
  const statGap = format === "wide" ? 16 : 20;
  const totalStatsW = 3 * statW + 2 * statGap;
  const statsX = (cfg.w - totalStatsW) / 2;

  drawStatCard(ctx, statsX, statsY, statW, statH, stats.watchlist, "Watchlist", "#ffb020");
  drawStatCard(ctx, statsX + statW + statGap, statsY, statW, statH, stats.favourites, "Favourites", "#30d158");
  drawStatCard(ctx, statsX + 2 * (statW + statGap), statsY, statW, statH, `${stats.hours}h`, "Watch Time", "#0a84ff");

  drawBranding(ctx, cfg.w, cfg.h, format);

  return canvas.toDataURL("image/png");
}

export function downloadPNG(dataUrl, filename = "cinehub-watchlist.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
