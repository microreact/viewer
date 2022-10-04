import React from "react";
import dynamic from "next/dynamic";

import projectJson from "../public/data/ebola";

let data;
let files;

// data = projectJson;

files = [{ url: "https://microreact.org/api/projects/json?project=6D42Y7TKsxWSQnyo375EYy", format: "application/json" } ];

const App = dynamic(
  () => import("../dev/App"),
  {
    ssr: false,
  },
);

export default function Viewer() {
  return (
    <App
      data={data}
      files={files}
    />
  );
}
