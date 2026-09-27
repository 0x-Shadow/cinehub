const W = 1080;
const H = 1920;
const PAD = 72;
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif";

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

function paintBackground(ctx) {
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, "#0c0c0e");
  base.addColorStop(0.55, "#0a0a0b");
  base.addColorStop(1, "#070708");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  const gold = ctx.createRadialGradient(W * 0.12, H * 0.08, 0, W * 0.12, H * 0.08, W * 0.55);
  gold.addColorStop(0, "rgba(255, 176, 32, 0.14)");
  gold.addColorStop(1, "transparent");
  ctx.fillStyle = gold;
  ctx.fillRect(0, 0, W, H);

  const violet = ctx.createRadialGradient(W * 0.9, H * 0.95, 0, W * 0.9, H * 0.95, W * 0.5);
  violet.addColorStop(0, "rgba(88, 80, 236, 0.10)");
  violet.addColorStop(1, "transparent");
  ctx.fillStyle = violet;
  ctx.fillRect(0, 0, W, H);

  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.7);
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

function glass(ctx, x, y, w, h, r) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  roundRect(ctx, x, y, w, h, r);
  const sheen = ctx.createLinearGradient(x, y, x, y + h);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.07)");
  sheen.addColorStop(0.4, "transparent");
  ctx.fillStyle = sheen;
  ctx.fill();
  ctx.restore();
}

function drawCover(ctx, img, x, y, w, h, r) {
  const ir = img.width / img.height;
  const tr = w / h;
  let sx, sy, sw, sh;
  if (ir > tr) {
    sh = img.height;
    sw = sh * tr;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / tr;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function tile(ctx, x, y, w, h, r, label) {
  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = "#1c1c21";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#6b6b76";
  ctx.font = `700 ${Math.round(h * 0.22)}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.slice(0, 1).toUpperCase(), x + w / 2, y + h / 2);
  ctx.restore();
}

function fitText(ctx, text, maxWidth, font) {
  ctx.font = font;
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(out + "…").width > maxWidth) {
    out = out.slice(0, -1);
  }
  return out + "…";
}

function loadPoster(posterPath, size = "w500") {
  return new Promise((resolve) => {
    if (!posterPath) {
      resolve(null);
      return;
    }
    const timer = setTimeout(() => resolve(null), 8000);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    image.src = `https://image.tmdb.org/t/p/${size}${posterPath}`;
  });
}

function yearOf(entry) {
  const iso = entry.release_date ?? entry.first_air_date ?? "";
  return iso ? iso.slice(0, 4) : "";
}

export async function generateShareImage(
  items,
  { stats = { watchlist: 0, favourites: 0, hours: 0, minutes: 0 }, tasteLine = "" } = {}
) {
  const list = (items ?? []).slice(0, 6);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  paintBackground(ctx);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  try {
    ctx.letterSpacing = "6px";
  } catch {
    /* older browsers ignore letter-spacing */
  }
  ctx.fillStyle = "#ffb020";
  ctx.font = `600 20px ${FONT}`;
  ctx.fillText("CINEHUB", W / 2, 128);
  try {
    ctx.letterSpacing = "0px";
  } catch {
    /* ignore */
  }

  ctx.fillStyle = "#f5f5f7";
  ctx.font = `700 72px ${FONT}`;
  ctx.fillText("My Watchlist", W / 2, 200);

  ctx.fillStyle = "#a1a1aa";
  ctx.font = `400 24px ${FONT}`;
  ctx.fillText(
    `${list.length} ${list.length === 1 ? "title" : "titles"} · ${stats.hours}h ${stats.minutes}m of watching`,
    W / 2,
    258
  );

  const hero = list[0];
  const heroY = 320;
  const heroH = 470;
  const heroW = W - PAD * 2;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 60;
  ctx.shadowOffsetY = 24;
  roundRect(ctx, PAD, heroY, heroW, heroH, 36);
  ctx.fillStyle = "#131316";
  ctx.fill();
  ctx.restore();

  if (hero) {
    const heroImg = await loadPoster(hero.posterPath, "w500");
    if (heroImg) {
      drawCover(ctx, heroImg, PAD, heroY, heroW, heroH, 36);
    } else {
      tile(ctx, PAD, heroY, heroW, heroH, 36, hero.title ?? "?");
    }

    const scrim = ctx.createLinearGradient(0, heroY + heroH * 0.35, 0, heroY + heroH);
    scrim.addColorStop(0, "transparent");
    scrim.addColorStop(1, "rgba(0, 0, 0, 0.82)");
    ctx.save();
    roundRect(ctx, PAD, heroY, heroW, heroH, 36);
    ctx.clip();
    ctx.fillStyle = scrim;
    ctx.fillRect(PAD, heroY, heroW, heroH);
    ctx.restore();

    glass(ctx, PAD + 28, heroY + 28, 168, 48, 24);
    ctx.fillStyle = "#ffb020";
    ctx.font = `700 17px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText("★ NO. 1 PICK", PAD + 28 + 84, heroY + 28 + 25);

    const heroTitle = fitText(ctx, hero.title ?? "Untitled", heroW - 220, `700 38px ${FONT}`);
    ctx.textAlign = "left";
    ctx.fillStyle = "#f5f5f7";
    ctx.font = `700 38px ${FONT}`;
    ctx.fillText(heroTitle, PAD + 32, heroY + heroH - 78);

    const meta = [yearOf(hero), hero.vote_average ? `${Number(hero.vote_average).toFixed(1)} / 10` : ""]
      .filter(Boolean)
      .join("  ·  ");
    if (meta) {
      ctx.fillStyle = "#d7d7dc";
      ctx.font = `500 21px ${FONT}`;
      ctx.fillText(meta, PAD + 32, heroY + heroH - 34);
    }
  }

  ctx.textAlign = "left";
  try {
    ctx.letterSpacing = "4px";
  } catch {
    /* ignore */
  }
  ctx.fillStyle = "#6b6b76";
  ctx.font = `600 17px ${FONT}`;
  ctx.fillText("MORE TO WATCH", PAD, 872);
  try {
    ctx.letterSpacing = "0px";
  } catch {
    /* ignore */
  }

  const minis = list.slice(1, 6);
  const gap = 20;
  const miniW = (heroW - gap * 4) / 5;
  const miniH = Math.round(miniW * 1.5);
  const miniY = 900;
  const miniImages = await Promise.all(minis.map((e) => loadPoster(e.posterPath, "w300")));

  minis.forEach((entry, i) => {
    const x = PAD + i * (miniW + gap);
    const image = miniImages[i];
    if (image) {
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      drawCover(ctx, image, x, miniY, miniW, miniH, 18);
      ctx.restore();
    } else {
      tile(ctx, x, miniY, miniW, miniH, 18, entry.title ?? "?");
    }
    ctx.fillStyle = "#a1a1aa";
    ctx.font = `400 15px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(fitText(ctx, entry.title ?? "Untitled", miniW + 8, `400 15px ${FONT}`), x + miniW / 2, miniY + miniH + 10);
  });

  const statsY = 1330;
  const statsH = 170;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 18;
  glass(ctx, PAD, statsY, heroW, statsH, 28);
  ctx.restore();

  const metrics = [
    { value: String(stats.watchlist ?? 0), label: "WATCHLIST" },
    { value: String(stats.favourites ?? 0), label: "FAVOURITES" },
    { value: `${stats.hours ?? 0}H`, label: "WATCH TIME" },
  ];
  metrics.forEach((m, i) => {
    const cx = PAD + (heroW / 3) * (i + 0.5);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = i === 0 ? "#ffb020" : "#f5f5f7";
    ctx.font = `700 52px ${FONT}`;
    ctx.fillText(m.value, cx, statsY + statsH / 2 - 16);
    ctx.fillStyle = "#6b6b76";
    ctx.font = `600 15px ${FONT}`;
    try {
      ctx.letterSpacing = "3px";
    } catch {
      /* ignore */
    }
    ctx.fillText(m.label, cx, statsY + statsH / 2 + 34);
    try {
      ctx.letterSpacing = "0px";
    } catch {
      /* ignore */
    }
  });

  if (tasteLine) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#a1a1aa";
    ctx.font = `400 22px ${FONT}`;
    ctx.fillText(fitText(ctx, tasteLine, heroW - 40, `400 22px ${FONT}`), W / 2, 1560);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffb020";
  ctx.font = `600 19px ${FONT}`;
  try {
    ctx.letterSpacing = "5px";
  } catch {
    /* ignore */
  }
  ctx.fillText("CINEHUB", W / 2, 1830);
  try {
    ctx.letterSpacing = "0px";
  } catch {
    /* ignore */
  }
  ctx.fillStyle = "#6b6b76";
  ctx.font = `400 17px ${FONT}`;
  ctx.fillText("cinehub.app", W / 2, 1862);

  return canvas.toDataURL("image/png");
}

export function downloadPNG(dataUrl, filename = "cinehub-watchlist.png") {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
