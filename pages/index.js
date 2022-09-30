import React from "react";
import dynamic from "next/dynamic";

import projectJson from "../public/data/ebola";

const App = dynamic(
  () => import("../dev/App"),
  {
    ssr: false,
  },
);

export default function Viewer() {
  return (
    <App
      data={projectJson}
    />
  );
}
