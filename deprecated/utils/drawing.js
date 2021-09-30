/* eslint-disable no-bitwise */

import createEmojiRegex from "emoji-regex";
import { Angles } from "@phylocanvas/phylocanvas.gl";

import defaults from "../defaults";

const Flags = {
  ad: "🇦🇩",
  ae: "🇦🇪",
  af: "🇦🇫",
  ag: "🇦🇬",
  ai: "🇦🇮",
  al: "🇦🇱",
  am: "🇦🇲",
  ao: "🇦🇴",
  aq: "🇦🇶",
  ar: "🇦🇷",
  as: "🇦🇸",
  at: "🇦🇹",
  au: "🇦🇺",
  aw: "🇦🇼",
  ax: "🇦🇽",
  az: "🇦🇿",
  ba: "🇧🇦",
  bb: "🇧🇧",
  bd: "🇧🇩",
  be: "🇧🇪",
  bf: "🇧🇫",
  bg: "🇧🇬",
  bh: "🇧🇭",
  bi: "🇧🇮",
  bj: "🇧🇯",
  bl: "🇧🇱",
  bm: "🇧🇲",
  bn: "🇧🇳",
  bo: "🇧🇴",
  bq: "🇧🇶",
  br: "🇧🇷",
  bs: "🇧🇸",
  bt: "🇧🇹",
  bv: "🇧🇻",
  bw: "🇧🇼",
  by: "🇧🇾",
  bz: "🇧🇿",
  ca: "🇨🇦",
  cc: "🇨🇨",
  cd: "🇨🇩",
  cf: "🇨🇫",
  cg: "🇨🇬",
  ch: "🇨🇭",
  ci: "🇨🇮",
  ck: "🇨🇰",
  cl: "🇨🇱",
  cm: "🇨🇲",
  cn: "🇨🇳",
  co: "🇨🇴",
  cr: "🇨🇷",
  cu: "🇨🇺",
  cv: "🇨🇻",
  cw: "🇨🇼",
  cx: "🇨🇽",
  cy: "🇨🇾",
  cz: "🇨🇿",
  de: "🇩🇪",
  dj: "🇩🇯",
  dk: "🇩🇰",
  dm: "🇩🇲",
  do: "🇩🇴",
  dz: "🇩🇿",
  ec: "🇪🇨",
  ee: "🇪🇪",
  eg: "🇪🇬",
  eh: "🇪🇭",
  er: "🇪🇷",
  es: "🇪🇸",
  et: "🇪🇹",
  eu: "🇪🇺",
  fi: "🇫🇮",
  fj: "🇫🇯",
  fk: "🇫🇰",
  fm: "🇫🇲",
  fo: "🇫🇴",
  fr: "🇫🇷",
  ga: "🇬🇦",
  gb: "🇬🇧",
  gd: "🇬🇩",
  ge: "🇬🇪",
  gf: "🇬🇫",
  gg: "🇬🇬",
  gh: "🇬🇭",
  gi: "🇬🇮",
  gl: "🇬🇱",
  gm: "🇬🇲",
  gn: "🇬🇳",
  gp: "🇬🇵",
  gq: "🇬🇶",
  gr: "🇬🇷",
  gs: "🇬🇸",
  gt: "🇬🇹",
  gu: "🇬🇺",
  gw: "🇬🇼",
  gy: "🇬🇾",
  hk: "🇭🇰",
  hm: "🇭🇲",
  hn: "🇭🇳",
  hr: "🇭🇷",
  ht: "🇭🇹",
  hu: "🇭🇺",
  id: "🇮🇩",
  ie: "🇮🇪",
  il: "🇮🇱",
  im: "🇮🇲",
  in: "🇮🇳",
  io: "🇮🇴",
  iq: "🇮🇶",
  ir: "🇮🇷",
  is: "🇮🇸",
  it: "🇮🇹",
  je: "🇯🇪",
  jm: "🇯🇲",
  jo: "🇯🇴",
  jp: "🇯🇵",
  ke: "🇰🇪",
  kg: "🇰🇬",
  kh: "🇰🇭",
  ki: "🇰🇮",
  km: "🇰🇲",
  kn: "🇰🇳",
  kp: "🇰🇵",
  kr: "🇰🇷",
  kw: "🇰🇼",
  ky: "🇰🇾",
  kz: "🇰🇿",
  la: "🇱🇦",
  lb: "🇱🇧",
  lc: "🇱🇨",
  li: "🇱🇮",
  lk: "🇱🇰",
  lr: "🇱🇷",
  ls: "🇱🇸",
  lt: "🇱🇹",
  lu: "🇱🇺",
  lv: "🇱🇻",
  ly: "🇱🇾",
  ma: "🇲🇦",
  mc: "🇲🇨",
  md: "🇲🇩",
  me: "🇲🇪",
  mf: "🇲🇫",
  mg: "🇲🇬",
  mh: "🇲🇭",
  mk: "🇲🇰",
  ml: "🇲🇱",
  mm: "🇲🇲",
  mn: "🇲🇳",
  mo: "🇲🇴",
  mp: "🇲🇵",
  mq: "🇲🇶",
  mr: "🇲🇷",
  ms: "🇲🇸",
  mt: "🇲🇹",
  mu: "🇲🇺",
  mv: "🇲🇻",
  mw: "🇲🇼",
  mx: "🇲🇽",
  my: "🇲🇾",
  mz: "🇲🇿",
  na: "🇳🇦",
  nc: "🇳🇨",
  ne: "🇳🇪",
  nf: "🇳🇫",
  ng: "🇳🇬",
  ni: "🇳🇮",
  nl: "🇳🇱",
  no: "🇳🇴",
  np: "🇳🇵",
  nr: "🇳🇷",
  nu: "🇳🇺",
  nz: "🇳🇿",
  om: "🇴🇲",
  pa: "🇵🇦",
  pe: "🇵🇪",
  pf: "🇵🇫",
  pg: "🇵🇬",
  ph: "🇵🇭",
  pk: "🇵🇰",
  pl: "🇵🇱",
  pm: "🇵🇲",
  pn: "🇵🇳",
  pr: "🇵🇷",
  ps: "🇵🇸",
  pt: "🇵🇹",
  pw: "🇵🇼",
  py: "🇵🇾",
  qa: "🇶🇦",
  re: "🇷🇪",
  ro: "🇷🇴",
  rs: "🇷🇸",
  ru: "🇷🇺",
  rw: "🇷🇼",
  sa: "🇸🇦",
  sb: "🇸🇧",
  sc: "🇸🇨",
  sd: "🇸🇩",
  se: "🇸🇪",
  sg: "🇸🇬",
  sh: "🇸🇭",
  si: "🇸🇮",
  sj: "🇸🇯",
  sk: "🇸🇰",
  sl: "🇸🇱",
  sm: "🇸🇲",
  sn: "🇸🇳",
  so: "🇸🇴",
  sr: "🇸🇷",
  ss: "🇸🇸",
  st: "🇸🇹",
  sv: "🇸🇻",
  sx: "🇸🇽",
  sy: "🇸🇾",
  sz: "🇸🇿",
  tc: "🇹🇨",
  td: "🇹🇩",
  tf: "🇹🇫",
  tg: "🇹🇬",
  th: "🇹🇭",
  tj: "🇹🇯",
  tk: "🇹🇰",
  tl: "🇹🇱",
  tm: "🇹🇲",
  tn: "🇹🇳",
  to: "🇹🇴",
  tr: "🇹🇷",
  tt: "🇹🇹",
  tv: "🇹🇻",
  tw: "🇹🇼",
  tz: "🇹🇿",
  ua: "🇺🇦",
  ug: "🇺🇬",
  um: "🇺🇲",
  us: "🇺🇸",
  uy: "🇺🇾",
  uz: "🇺🇿",
  va: "🇻🇦",
  vc: "🇻🇨",
  ve: "🇻🇪",
  vg: "🇻🇬",
  vi: "🇻🇮",
  vn: "🇻🇳",
  vu: "🇻🇺",
  wf: "🇼🇫",
  ws: "🇼🇸",
  ye: "🇾🇪",
  yt: "🇾🇹",
  za: "🇿🇦",
  zm: "🇿🇲",
  zw: "🇿🇼",
};

const isEmojiRegexp = new RegExp(createEmojiRegex().source, "i");

function star(ctx, x, y, MARKER_CENTRE, spikes = 5) {
  const outerRadius = MARKER_CENTRE;
  const innerRadius = outerRadius * 0.5;
  const step = (Math.PI / spikes);

  let rot = Math.PI / 2 * 3;
  ctx.moveTo(x, y - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.lineTo(x, y - outerRadius);
}

function polygon(ctx, x, y, MARKER_CENTRE, sides) {
  const startAngle = (Math.PI / 2 * 3);
  const step = (2 * Math.PI / sides);
  ctx.moveTo(
    x + MARKER_CENTRE * Math.cos(startAngle),
    y + MARKER_CENTRE * Math.sin(startAngle),
  );
  for (let i = 1; i <= sides; i += 1) {
    ctx.lineTo(
      x + MARKER_CENTRE * Math.cos(startAngle + i * step),
      y + MARKER_CENTRE * Math.sin(startAngle + i * step),
    );
  }
}

let canvas;
function getDrawingContext() {
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
  }
  return canvas.getContext("2d");
}

export function drawShape(ctx, x, y, radius, shape, colour, highlightColour, borderWidth = 1, borderStyle = "rgba(0, 0, 0, 0.56)") {
  if (radius <= 0 || shape === "none") {
    return;
  }

  ctx.fillStyle = colour;

  if (shape in Flags) {
    const font = ctx.font;
    ctx.font = `${radius * 2}px Segoe UI Emoji`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(Flags[shape], x, y - radius / 2);
    ctx.font = font;
  }
  else if (isEmojiRegexp.test(shape)) {
    ctx.font = `${radius * 2}px Segoe UI Emoji`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(shape, x, y - radius / 2);
  }
  else {
    ctx.beginPath();
    if (shape === "dot") {
      ctx.arc(x, y, ctx.lineWidth * 2, Angles.Degrees0, Angles.Degrees360);
    }
    else if (shape === "circle") {
      ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
    }
    else if (shape === "square") {
      ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
    }
    else if (shape === "triangle") {
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x + radius, y + radius);
      ctx.lineTo(x - radius, y + radius);
      ctx.lineTo(x, y - radius);
    }
    else if (shape === "star") {
      star(ctx, x, y, radius, 5);
    }
    else if (shape === "hexastar") {
      star(ctx, x, y, radius, 6);
    }
    else if (shape === "heptastar") {
      star(ctx, x, y, radius, 7);
    }
    else if (shape === "octastar") {
      star(ctx, x, y, radius, 8);
    }
    else if (shape === "pentagon") {
      polygon(ctx, x, y, radius, 5);
    }
    else if (shape === "hexagon") {
      polygon(ctx, x, y, radius, 6);
    }
    else if (shape === "heptagon") {
      polygon(ctx, x, y, radius, 7);
    }
    else if (shape === "octagon") {
      polygon(ctx, x, y, radius, 8);
    }
    else {
      console.error("Invalid shape", shape);
    }
    ctx.fill();

    if (borderWidth > 0) {
      ctx.strokeStyle = borderStyle;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }
    ctx.closePath();
  }

  if (highlightColour) {
    // drawHalo(ctx, x, y, radius, highlightColour);
    ctx.strokeStyle = highlightColour;
    const lineWidth = ctx.lineWidth;
    ctx.lineWidth = defaults.highlight.width;
    ctx.beginPath();
    ctx.arc(x, y, radius + defaults.NODE_RADIUS + Math.floor((radius / defaults.NODE_RADIUS) / 2), 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = lineWidth;
  }
}

export function drawPieChart(ctx, x, y, radius, slices, highlight = false, borderWidth = 1) {
  let startingAngle = 0;
  for (const colour of Object.keys(slices)) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const endingAngle = startingAngle + (Math.PI * 2 * slices[colour]);
    // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
    ctx.arc(x, y, radius, startingAngle, endingAngle, false);
    ctx.fill();
    ctx.closePath();
    startingAngle = endingAngle;
  }

  if (borderWidth > 0) {
    ctx.beginPath();
    ctx.arc(x, y, radius, Angles.Degrees0, Angles.Degrees360);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.56)";
    ctx.strokeWidth = borderWidth;
    ctx.stroke();
    ctx.closePath();
  }

  if (highlight) {
    ctx.strokeStyle = defaults.HIGHLIGHT_COLOUR;
    ctx.lineWidth = defaults.HIGHLIGHT_WIDTH;
    ctx.beginPath();
    ctx.arc(x, y, radius * 2, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = borderWidth;
  }
}

export function getGroupedColours(rows) {
  const groupedData = {};
  let sum = 0;
  for (const row of rows) {
    const colour = row["--microreact-colour"];
    const magnitude = row["--mr-scalar"] ?? 1;
    sum += magnitude;
    if (!groupedData[colour]) {
      groupedData[colour] = magnitude;
    }
    else {
      groupedData[colour] += magnitude;
    }
  }
  for (const colour of Object.keys(groupedData)) {
    groupedData[colour] /= sum;
  }
  return groupedData;
}

export function shapeToImage(width, height, size, shape, colour, highlightColour) {
  const ctx = getDrawingContext();
  ctx.clearRect(0, 0, width, height);
  drawShape(
    ctx,
    width,
    height,
    size,
    shape,
    colour,
    highlightColour,
  );
  return canvas.toDataURL();
}

export function hexToRgba(hex, alpha = 0.08) {
  const bigint = parseInt(hex.substr(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
