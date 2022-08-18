const { emptyObject } = require("../constants");

const versions = [
  // require("./version-1-to-2"),
];

const emptyDocumentPayload = {
  charts: {},
  datasets: {},
  filters: {},
  maps: {},
  meta: {},
  networks: {},
  notes: {},
  panes: {},
  query: {},
  slicers: {},
  styles: {},
  tables: {},
  timelines: {},
  trees: {},
  ui: {},
};

function updateSchema(originalDocument = emptyObject) {
  let doc = {
    ...emptyDocumentPayload,
    ...originalDocument,
  };

  return doc;

  // Determine the version of the document
  const versionRegexp = /https:\/\/microreact\.org\/schema\/v(\d+)\.json/i;
  const [ _, schemaVersion ] = originalDocument.schema.match(versionRegexp);
  const curentDocumentVersion = schemaVersion || 1;

  for (let version = curentDocumentVersion; version < versions.length + 1; version++) {
    const updater = versions[version - 1];
    doc = updater(doc);
    doc.schema = `https://microreact.org/schema/v${version + 1}.json`;
  }

  return doc;
}

module.exports = updateSchema;

module.exports.version = (versions.length + 1);
