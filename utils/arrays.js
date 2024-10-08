import naturalCompare from "natural-compare";

/* eslint-disable no-plusplus */

export function firstElement(array) {
  return array.length ? array[0] : undefined;
}

export function filterByQuery(rows, query) {
  const ids = [];
  for (const row of rows) {
    let match = true;
    for (const [ field, value ] of Object.entries(query)) {
      if (Array.isArray(value) ? (!value.includes(row[field])) : (row[field] !== value)) {
        match = false;
        break;
      }
    }
    if (match) {
      ids.push(row[0]);
    }
  }

  return ids;
}

export function lastElement(array) {
  return array.length ? array[array.length - 1] : undefined;
}

// export function leftJoin(
//   array1,
//   array2,
//   { key, key1, key2, match, propMap1, propMap2, leftAs, rightAs } = {}
// ) {
//   if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length === 0 || array2.length === 0) {
//     throw new Error("Cannot join empty arrays.");
//   }

//   const matchItems = match;

//   if (typeof matchItems !== "function") {
//     return [];
//   }

//   const emptyMatch = array2[0].map(() => null);

//   return array1.reduce((prev, cur) => {
//     const matches = array2.filter((a2) => matchItems(cur, a2));

//     return matches.length === 0
//       ? prev.concat(
//         [
//           ...cur,
//           ...emptyMatch,
//         ]
//       )
//       : prev.concat(
//         matches.map((m) =>
//           [
//             ...cur,
//             ...m,
//           ]
//         )
//       );
//   }, []);
// }

export function mode(array, valueOf)
{
  if (array.length === 0) {
    return undefined;
  }
  const modeMap = {};
  let maxEl = valueOf ? valueOf(array[0]) : array[0];
  let maxCount = 1;
  for (let i = 0; i < array.length; i++)
  {
    const el = valueOf ? valueOf(array[i]) : array[i];
    if (modeMap[el] == null) {
      modeMap[el] = 1;
    }
    else {
      modeMap[el]++;
    }
    if (modeMap[el] > maxCount)
    {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}

export function summarise(array) {
  if (!array || array.length === 0) {
    return "none";
  }

  else if (array.length <= 2) {
    return array.join(", and ");
  }

  else {
    const [ first, second, third ] = array;
    if (array.length === 3) {
      return `${first}, ${second}, and ${third}`;
    }
    else {
      return `${first}, ${second}, ${third} + ${array.length - 3}`;
    }
  }
}

export function sortComparator(property) {
  if (property) {
    return (a, b) => {
      return naturalCompare(
        a?.[property]?.toString()?.toLowerCase(),
        b?.[property]?.toString()?.toLowerCase()
      );
    };
  }
  else {
    return (a, b) => {
      return naturalCompare(
        a?.toString()?.toLowerCase(),
        b?.toString()?.toLowerCase()
      );
    };
  }
}

export function swap(array, oldInex, newIndex) {
  const copy = array.slice();
  copy[newIndex] = array[oldInex];
  copy[oldInex] = array[newIndex];
  return copy;
}

export function uniqueElements(array, valueOf, sort = false) {
  const unique = new Set();

  if (typeof valueOf === "function") {
    for (const item of array) {
      unique.add(valueOf(item));
    }
  }
  else if (typeof valueOf === "string") {
    for (const item of array) {
      unique.add(item[valueOf]);
    }
  }
  else {
    for (const item of array) {
      unique.add(item);
    }
  }

  if (sort) {
    return Array.from(unique).sort();
  }
  else {
    return Array.from(unique);
  }
}

export function remove(array, predicate, clone = true) {
  const index = array.findIndex(predicate);

  if (index >= 0) {
    if (clone) {
      const copy = [ ...array ];
      copy.splice(index, 1);
      return copy;
    }
    else {
      array.splice(index, 1);
      return array;
    }
  }
  else if (clone) {
    return [ ...array ];
  }
  else {
    return array;
  }
}

export function update(array, predicate, updater) {
  const newArray = [ ...array ];
  const index = array.findIndex(predicate);
  if (index >= 0) {
    newArray[index] = {
      ...array[index],
      ...updater,
    };
  }
  else {
    newArray.push(updater);
  }

  return newArray;
}
