/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

import React from "react";
import dynamic from "next/dynamic";

import projectJson from "../public/data/euscape";

let data;
let files;

data = projectJson;
// files = [{ url: "https://microreact.org/api/projects/json?project=rcL4EAqWx7LfhnsUyFnPSX", format: "application/json" } ];
// files = [{ url: "https://microreact.org/api/projects/json?project=dw4UAy2YoxGTvGTemCZY9K", format: "application/json" } ];

const App = dynamic(
  () => import("../dev/App"),
  {
    ssr: false ?? "",
  },
);

export default function Viewer() {
  return (
    <App
      data={files ? undefined : data}
      files={files}
    />
  );
}
