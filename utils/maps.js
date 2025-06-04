import iso3166Codes from "microreact-data/iso-3166-codes";

const regionNamesInEnglish = new Intl.DisplayNames(
  ["en"],
  { type: "region" },
);

// export function createCountryCodeToNameConvertor() {
//   return (code) => regionNamesInEnglish.of(code).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// }

export function countryCodeToName(code) {
  // const convertor = createCountryCodeToNameConvertor();
  // return convertor(code);
  return regionNamesInEnglish.of(code).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const codes = new Map();

for (const row of iso3166Codes) {
  codes.set(
    row[0],
    [
      [
        row[1],
        row[2],
      ],
      row[0].length === 2 ? countryCodeToName(row[0]) : row[3],
    ]
  );
}

export function praseCode(code) {
  if (code) {
    return codes.get(code);
  }
  return undefined;
}

export function convertDMSToDD(dms) {
  const parts = dms.split(/[^\d+(\,\d+)\d+(\.\d+)?\w]+/);
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2].replace(",", "."));
  const direction = parts[3];

  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction === "S" || direction === "W") {
    dd *= -1;
  } // Don't do anything for N or E

  return dd;
}
