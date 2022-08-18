/* eslint-disable no-lonely-if */
/* eslint-disable no-bitwise */

import svgToMiniDataURI from "mini-svg-data-uri";

import { Utils } from "@phylocanvas/phylocanvas.gl";

function drawShape(shape, x, y, radius, fillColour, highlightColour, borderWidth = 1, borderColour = "rgba(0, 0, 0, 0.56)") {
  if (radius <= 0 || !shape) {
    return "";
  }

  return Utils.drawVectorShape(
    shape,
    x,
    y,
    radius,
    fillColour,
    borderColour,
    borderWidth
  );

  // if (highlightColour) {
  //   // drawHalo(ctx, x, y, radius, highlightColour);
  //   ctx.strokeStyle = highlightColour;
  //   const lineWidth = ctx.lineWidth;
  //   ctx.lineWidth = defaults.highlight.width;
  //   ctx.beginPath();
  //   ctx.arc(x, y, radius + defaults.NODE_RADIUS + Math.floor((radius / defaults.NODE_RADIUS) / 2), 0, Math.PI * 2, false);
  //   ctx.closePath();
  //   ctx.stroke();
  //   ctx.lineWidth = lineWidth;
  // }
}

export function shapeImage(width, height, size, shape, fillColour, borderWidth = 1, borderColour = "rgba(0, 0, 0, 0.56)") {
  const shapeSvgElement = drawShape(
    shape,
    width / 2,
    height / 2,
    size,
  );
  return svgToMiniDataURI(
    `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >
      <g
        fill="${fillColour}"
        stroke="${borderColour}"
        linewidth="${borderWidth}"
      >
        ${shapeSvgElement}
      </g>
    </svg>
  `
  );
}

export function linearGradientImage(width, height, startColour, stopColour) {
  return svgToMiniDataURI(
    `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >
      <defs>
        <linearGradient
          id="gradientDef" 
          gradientTransform="rotate(90)"
        >
          <stop offset="5%"  stop-color="${startColour}" />
          <stop offset="95%" stop-color="${stopColour}" />
        </linearGradient>
      </defs>

      <rect
        x="0"
        y="0"
        width="${width}"
        height="${height}"
        fill="url(#gradientDef)"
      />
    </svg>
  `
  )
    .replace("#", "%23");
}
