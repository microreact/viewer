import { COLOR_RANGES } from "./kepler.gl/color-ranges";

export const colourRanges = [
  {
    entries: [
      "#8dd3c7", "#ffffb3", "#bebada", "#fb8072",
      "#80b1d3", "#fdb462", "#b3de69", "#fccde5",
      "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f",
      "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c",
      "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00",
      "#cab2d6", "#6a3d9a", "#ffff99", "#b15928",
    ],
    label: "Microreact Auto Colour Palette",
    name: "microreact colour palette",
    type: "qualitative",
  },
  {
    entries: [
      "#f0feff", "#00282e",
    ],
    label: "Microreact Teals-2",
    name: "microreact teal-2",
    type: "singlehue",
  },
  {
    entries: [
      "#f6efa6", "#bf444c",
    ],
    label: "Microreact Heat-1",
    name: "microreact heat-1",
    type: "singlehue",
  },
];

for (const x of COLOR_RANGES) {
  if (x.colors.length === 3 && x.name.endsWith("3")) {
    const name = `${x.name.substring(0, x.name.length - 1)}2`;
    colourRanges.push({
      entries: [ x.colors[0], x.colors[x.colors.length - 1] ],
      name,
      type: x.type,
    });

    // if (x.type === "singlehue" || x.type === "sequential") {
    //   colourRanges.push({
    //     entries: [ x.colors[0], x.colors[x.colors.length - 1] ],
    //     name: `Gradient ${x.name}`,
    //     type: "gradient",
    //     scale: "continuous",
    //   });
    // }

    if (x.type === "singlehue") {
      colourRanges.push({
        entries: [ "#ffffff", x.colors[x.colors.length - 1] ],
        name: `Stark ${name}`,
        type: x.type,
      });
      // colourRanges.push({
      //   entries: [ x.colors[x.colors.length - 1], x.colors[x.colors.length - 1] ],
      //   name: `Single colour ${name}`,
      //   type: "Single Colour",
      // });
    }
  }
  colourRanges.push({
    entries: x.colors,
    label: x.name,
    name: x.name,
    type: x.type,
  });
}

colourRanges.sort((a, b) => {
  if (a.type > b.type) {
    return 1;
  }
  else if (a.type < b.type) {
    return -1;
  }
  else {
    return 0;
  }
});

const steps = new Set();
for (const item of colourRanges) {
  steps.add(item.entries.length);
}

export const colourSteps = (
  Array.from(steps)
    .sort((a, b) => (a - b))
);

// export function textColourOnBackground(backgroundColour) {
//   const [ r, g, b ] = Utils["colour-to-rgba"](backgroundColour);
//   return (
//     (r * 0.299 + g * 0.587 + b * 0.114) > 186
//       ? "#000000"
//       : "#FFFFFF"
//   );
// }
