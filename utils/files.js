import { filesize } from "filesize";

import { generateHashId } from "./hash";
import { loadCsvFile } from "./loaders/data";
import { loadGeoJsonFile, loadJsonFile } from "./loaders/json";
import { loadTextFile } from "./loaders/text";
import { loadSpeadsheetFile } from "./loaders/xlsx";
import { emptyString } from "../constants";
import { promiseTimeout } from "./promises";

const FileTypes = [
  "data",
  "tree",
  "network",
  "geo",
  "markdown",
  "unknown",
];

export const FileKinds = [
  {
    extensions: [ "microreact" ],
    nameValidator: /\.(microreact)$/i,
    format: "application/json",
    type: "microreact",
    name: "Microreact Project",
  },
  {
    extensions: [ "csv", "tsv" ],
    nameValidator: /\.(csv|tsv)$/i,
    format: "text/csv",
    type: "data",
    name: "Data (CSV or TSV)",
    linkable: true,
  },
  {
    extensions: [ "xlsx", "xlsm", "xlam", "xlsb", "xls", "xla", "ods", "dbf" ],
    nameValidator: /\.(xlsx|xlsm|xlam|xlsb|xls|xla|ods|dbf)$/i,
    format: "application/x-speadsheet",
    type: "data",
    name: "Data (Excel or ODS Speadsheet)",
    linkable: true,
  },
  {
    extensions: [ "nwk", "newick", "tree", "tre", "nexus", "nhx" ],
    nameValidator: /\.(nwk|newick|tree|tre|nexus|nhx)$/i,
    format: "text/x-nh",
    type: "tree",
    name: "Tree (Newick)",
    linkable: true,
  },
  {
    extensions: [ "dot", "graph", "gv" ],
    nameValidator: /\.(dot|graph|gv)$/i,
    format: "text/vnd.graphviz",
    type: "network",
    name: "Network (Graphviz DOT)",
    linkable: true,
  },
  {
    extensions: [ "geojson", "geo.json" ],
    nameValidator: /\.(geojson|geo\.json)$/i,
    format: "application/geo+json",
    type: "geo",
    name: "Geographical features (GeoJSON)",
    linkable: true,
  },
  {
    extensions: [ "markdown" ],
    nameValidator: /\.md$/i,
    format: "text/markdown",
    type: "markdown",
    name: "Markdown formatted text",
    linkable: true,
  },
];

function base64ToBlob(base64) {
  return fetch(base64).then((res) => res.blob());
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export function clearLoadedContent(docFiles) {
  const files = {};

  for (const fileId of Object.keys(docFiles)) {
    files[fileId] = {
      ...docFiles[fileId],
      _content: undefined,
    };
  }

  return files;
}

export function fileSize(input) {
  const [ size, unit ] = filesize(
    input,
    { output: "array" },
  );
  return `${size.toFixed(2)} ${unit}`;
}

export function nameWithoutExtention(name) {
  return (name ?? emptyString).replace(/\.[^/.]+$/, "");
}

export function normaliseFilename(input) {
  const filename = (input || emptyString).split("/").pop().split("#")[0].split("?")[0] || emptyString;
  return filename.replace(/_/g, "-");
}

function guessFileFormat(fileName) {
  for (const { nameValidator, format } of FileKinds) {
    if (nameValidator.test(fileName)) {
      return format;
    }
  }
  return undefined;
}

export async function loadFile(input, onProgress) {
  const loadedFile = {
    id: input.id ?? generateHashId(),
    size: input.size,
    settings: input.settings,
  };

  if (!input.url) {
    loadedFile.name = normaliseFilename(input.name);
  }

  // const fileKind = FileKinds.find((x) => x.format === loadedFile.format);

  // The format of local files can be guessed from file extension
  loadedFile.format = input.format ?? guessFileFormat(input.name);

  let loader;
  if (loadedFile.format === "application/json") {
    loadedFile.type = "microreact";
    loader = loadJsonFile;
  }
  else if (loadedFile.format === "text/csv") {
    loadedFile.type = "data";
    loader = loadCsvFile;
  }
  else if (loadedFile.format === "application/x-speadsheet") {
    loadedFile.type = "data";
    loader = loadSpeadsheetFile;
  }
  else if (loadedFile.format === "text/x-nh") {
    loadedFile.type = "tree";
    loader = loadTextFile;
  }
  else if (loadedFile.format === "text/vnd.graphviz") {
    loadedFile.type = "network";
    loader = loadTextFile;
  }
  else if (loadedFile.format === "application/geo+json") {
    loadedFile.type = "geo";
    loader = loadGeoJsonFile;
  }
  else if (loadedFile.format === "text/markdown") {
    loadedFile.type = "markdown";
    loader = loadTextFile;
  }
  else {
    loadedFile.type = "unknown";
  }

  try {
    if (!loader) {
      throw new Error("Unsupported file type");
    }

    if (!input._content) {
      if (input.url) {
        loadedFile.url = input.url;
        loadedFile._content = await loader(loadedFile.url, loadedFile.settings, onProgress);
      }
      else if (input instanceof File || input.blob) {
        loadedFile.blob = input.blob || input;
        if (loadedFile.blob && typeof loadedFile.blob === "string") {
          if (/^data:.*\/.*;base64,/i.test(loadedFile.blob)) {
            loadedFile.blob = await base64ToBlob(loadedFile.blob);
          }
          else {
            loadedFile.blob = new Blob([ loadedFile.blob ], { type: input.format });
          }
        }
        loadedFile._content = await loader(loadedFile.blob, loadedFile.settings, onProgress);
      }
    }
    else {
      loadedFile.url = input.url;
      loadedFile.blob = input.blob;
      loadedFile._content = input._content;
    }
  }
  catch (error) {
    console.error("Cannot read file", input, error);
    loadedFile.error = error.message;
  }

  return loadedFile;
}

async function processFiles(files) {
  const processedFiles = [];

  for (const file of files) {
    const processedFile = await loadFile(file);
    processedFiles.push(processedFile);
  }

  processedFiles.sort(
    (a, b) => (FileTypes.indexOf(a.type) - FileTypes.indexOf(b.type))
  );

  return processedFiles;
}

export async function loadFiles(files, delay = 1000) {
  return (
    Promise.all([
      processFiles(files),
      promiseTimeout(delay),
    ])
      .then(([ processedFiles ]) => processedFiles)
  );
}

export async function serialiseBlobs(files) {
  for (const fileId of Object.keys(files)) {
    if (files[fileId].blob instanceof Blob) {
      files[fileId].blob = await blobToBase64(files[fileId].blob);
    }
  }
}
