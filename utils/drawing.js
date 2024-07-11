/* eslint-disable no-bitwise */

// import createEmojiRegex from "emoji-regex/RGI_Emoji";
// const isEmojiRegexp = new RegExp(createEmojiRegex().source, "i");

import { Angles, Utils } from "@phylocanvas/phylocanvas.gl";

import defaults from "../defaults";

export function drawShape(ctx, x, y, radius, shape, colour, highlightColour, borderWidth = 1, borderStyle = "rgba(0, 0, 0, 0.56)") {
  if (radius <= 0 || !shape) {
    return;
  }

  ctx.fillStyle = "black";
  ctx.fillStyle = colour;

  const emoji = Utils.emoji(shape);

  if (emoji) {
    // const font = ctx.font;
    ctx.font = `${radius * 2}px Segoe UI Emoji`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(emoji, x, y - radius / 2);
    // ctx.font = font;
  }

  else if (shape in Utils.shapes) {
    ctx.beginPath();
    Utils.shapes[shape].renderCanvas(
      x,
      y,
      radius,
      ctx,
    );
    ctx.fill();

    if (borderWidth > 0) {
      ctx.strokeStyle = borderStyle;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    ctx.closePath();
  }

  else {
    console.error(`Invalid shape ${shape}`);
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

export function drawPieChart(
  ctx,
  x,
  y,
  radius,
  slices,
  highlight = false,
  borderWidth = 1,
  theme
) {
  let startingAngle = Angles.Degrees270;
  for (const [colour, value] of slices) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const endingAngle = startingAngle + (Math.PI * 2 * value);
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
    ctx.strokeStyle = theme?.palette?.primary?.main || defaults.HIGHLIGHT_COLOUR;
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

  const slices = [];

  for (const colour of Object.keys(groupedData).sort()) {
    slices.push([
      colour,
      groupedData[colour] / sum,
    ]);
  }

  return slices;
}
