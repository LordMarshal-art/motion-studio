import { CanvasConfig, MotionSpec } from "@/types/motion";

export function resolveCanvasDimensions(canvas: CanvasConfig): {
  width: number;
  height: number;
} {
  if (canvas.aspect === "custom") {
    const width = Math.max(240, Math.min(3840, Math.round(canvas.customWidth || 1920)));
    const height = Math.max(240, Math.min(3840, Math.round(canvas.customHeight || 1080)));
    return { width, height };
  }

  const baseLongEdge =
    canvas.resolution === "4k" ? 3840 : canvas.resolution === "720p" ? 1280 : 1920;

  if (canvas.aspect === "9:16") {
    const height = baseLongEdge;
    const width = Math.round((height * 9) / 16);
    return { width, height };
  }

  if (canvas.aspect === "1:1") {
    const side =
      canvas.resolution === "4k" ? 2160 : canvas.resolution === "720p" ? 720 : 1080;
    return { width: side, height: side };
  }

  const width = baseLongEdge;
  const height = Math.round((width * 9) / 16);
  return { width, height };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string
) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3
) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return;

  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  const visibleLines = lines.slice(0, maxLines);
  const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

  visibleLines.forEach((line, idx) => {
    ctx.fillText(line, x, startY + idx * lineHeight);
  });
}

export function renderGraphicFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spec: MotionSpec,
  canvas: CanvasConfig,
  progress: number
) {
  const p = Math.max(0, Math.min(1, progress));
  const easeOutCubic = 1 - Math.pow(1 - p, 3);

  ctx.clearRect(0, 0, width, height);

  if (!canvas.transparentBackground && spec.background !== "transparent") {
    if (spec.background === "dark") {
      ctx.fillStyle = "#07090F";
      ctx.fillRect(0, 0, width, height);
    } else if (spec.background === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#0A1428");
      grad.addColorStop(0.55, "#090C14");
      grad.addColorStop(1, "#141007");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  const scaleFactor = width / 1920;
  const fs = Math.max(16, spec.fontSize * scaleFactor);
  const cx = width / 2 + spec.offsetX * (width * 0.25);
  const cy = height / 2 + spec.offsetY * (height * 0.25);

  let yOffset = 0;
  let animScale = 1;
  let animAlpha = spec.opacity;

  if (spec.motionStyle === "rise") {
    yOffset = (1 - easeOutCubic) * (height * 0.08);
    animAlpha = spec.opacity * Math.min(1, p * 2.5);
  } else if (spec.motionStyle === "scale") {
    animScale = 0.78 + easeOutCubic * 0.22;
    animAlpha = spec.opacity * Math.min(1, p * 2.5);
  } else if (spec.motionStyle === "none") {
    animAlpha = spec.opacity;
  }

  ctx.save();
  ctx.translate(cx, cy + yOffset);
  ctx.scale(animScale, animScale);
  ctx.globalAlpha = Math.max(0, Math.min(1, animAlpha));
  ctx.textBaseline = "middle";

  const headline = spec.headline || "UNTITLED GRAPHIC";
  const subtext = spec.subtext || "";

  switch (spec.kind) {
    case "title": {
      ctx.textAlign = "center";
      drawRoundedRect(
        ctx,
        -width * 0.14,
        -fs * 0.95,
        width * 0.28,
        Math.max(4, fs * 0.06),
        3,
        spec.accentColor
      );

      ctx.font = `800 ${fs}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = spec.textColor;
      drawWrappedText(ctx, headline, 0, 0, width * 0.82, fs * 1.15, 2);

      if (subtext) {
        ctx.font = `600 ${Math.max(14, fs * 0.28)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText(subtext.toUpperCase(), 0, fs * 0.95);
      }
      break;
    }

    case "lower_third": {
      const boxW = Math.min(width * 0.76, Math.max(320 * scaleFactor, width * 0.56));
      const boxH = fs * 1.45;
      const startX = -boxW / 2;
      const startY = -boxH / 2;

      drawRoundedRect(ctx, startX, startY, boxW, boxH, 12 * scaleFactor, "rgba(8, 12, 20, 0.88)");
      drawRoundedRect(ctx, startX, startY, 8 * scaleFactor, boxH, 4 * scaleFactor, spec.accentColor);

      ctx.textAlign = "left";
      ctx.font = `800 ${fs * 0.52}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = spec.textColor;
      ctx.fillText(headline, startX + 26 * scaleFactor, startY + boxH * 0.36);

      if (subtext) {
        ctx.font = `600 ${fs * 0.3}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText(subtext, startX + 26 * scaleFactor, startY + boxH * 0.72);
      }
      break;
    }

    case "stat": {
      ctx.textAlign = "center";
      ctx.font = `900 ${fs * 1.45}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = spec.accentColor;
      ctx.fillText(headline, 0, -fs * 0.12);

      if (subtext) {
        ctx.font = `700 ${fs * 0.34}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.textColor;
        ctx.fillText(subtext.toUpperCase(), 0, fs * 0.95);
      }
      break;
    }

    case "subscribe": {
      ctx.textAlign = "center";
      const pillW = Math.min(width * 0.65, fs * 8.5);
      const pillH = fs * 1.35;
      drawRoundedRect(ctx, -pillW / 2, -pillH / 2, pillW, pillH, pillH * 0.25, "#DC2626");

      ctx.font = `900 ${fs * 0.56}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`▶  ${headline.toUpperCase()}`, 0, 0);

      if (subtext) {
        ctx.font = `600 ${fs * 0.28}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText(subtext.toUpperCase(), 0, pillH * 0.85);
      }
      break;
    }

    case "quote": {
      ctx.textAlign = "center";
      ctx.font = `900 ${fs * 1.4}px Georgia, serif`;
      ctx.fillStyle = spec.accentColor;
      ctx.fillText("“", 0, -fs * 1.05);

      ctx.font = `italic 600 ${fs * 0.62}px Georgia, serif`;
      ctx.fillStyle = spec.textColor;
      drawWrappedText(ctx, headline, 0, 0, width * 0.74, fs * 0.78, 3);

      if (subtext) {
        ctx.font = `600 ${fs * 0.28}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText(subtext, 0, fs * 1.35);
      }
      break;
    }

    case "bullets": {
      const items = headline
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);
      const list = items.length > 0 ? items : ["First key point", "Second key point"];
      const rowGap = fs * 0.78;
      const startY = -((list.length - 1) * rowGap) / 2;
      const leftX = -width * 0.32;

      ctx.textAlign = "left";
      ctx.font = `700 ${fs * 0.48}px Inter, system-ui, sans-serif`;

      list.forEach((item, index) => {
        const y = startY + index * rowGap;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText("✦", leftX, y);
        ctx.fillStyle = spec.textColor;
        ctx.fillText(item, leftX + fs * 0.65, y);
      });
      break;
    }

    case "bar_chart": {
      ctx.textAlign = "center";
      ctx.font = `800 ${fs * 0.48}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = spec.textColor;
      ctx.fillText(headline, 0, -fs * 1.25);

      const values = [0.42, 0.68, 0.84, 0.96];
      const labels = ["SPRINT 1", "SPRINT 2", "SPRINT 3", "SPRINT 4"];
      const barW = Math.min(120 * scaleFactor, width * 0.08);
      const maxBarH = fs * 1.45;
      const spacing = barW * 1.85;
      const groupStartX = -((labels.length - 1) * spacing) / 2;
      const baseLineY = fs * 0.65;

      values.forEach((val, idx) => {
        const barH = maxBarH * val * (spec.motionStyle === "none" ? 1 : Math.min(1, p * 1.25));
        const x = groupStartX + idx * spacing - barW / 2;
        drawRoundedRect(ctx, x, baseLineY - maxBarH, barW, maxBarH, 8 * scaleFactor, "#1E293B");
        drawRoundedRect(
          ctx,
          x,
          baseLineY - barH,
          barW,
          barH,
          8 * scaleFactor,
          idx === values.length - 1 ? spec.accentColor : "#38BDF8"
        );

        ctx.font = `600 ${Math.max(12, fs * 0.22)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.textColor;
        ctx.fillText(labels[idx], x + barW / 2, baseLineY + fs * 0.25);
      });

      if (subtext) {
        ctx.font = `600 ${Math.max(13, fs * 0.26)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = spec.accentColor;
        ctx.fillText(subtext.toUpperCase(), 0, baseLineY + fs * 0.72);
      }
      break;
    }

    case "callout":
    default: {
      const boxW = Math.min(width * 0.65, fs * 10);
      const boxH = fs * 1.15;
      drawRoundedRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 10 * scaleFactor, "rgba(10, 15, 26, 0.9)");
      drawRoundedRect(ctx, -boxW / 2, -boxH / 2, 8 * scaleFactor, boxH, 4 * scaleFactor, spec.accentColor);

      ctx.textAlign = "left";
      ctx.font = `800 ${fs * 0.44}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = spec.textColor;
      ctx.fillText(headline, -boxW / 2 + 24 * scaleFactor, 0);
      break;
    }
  }

  ctx.restore();

  if (spec.motionStyle === "wipe" && p < 1) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width * easeOutCubic, height);
    ctx.restore();
  }
}
