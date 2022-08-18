export function intersect(sets) {
  if (sets.length === 0) {
    return undefined;
  }

  if (sets.length === 1) {
    return sets[0];
  }

  if (sets.length === 2) {
    let [ setA, setB ] = sets;
    if (sets[1].size < sets[0].size) {
      setA = sets[1];
      setB = sets[0];
    }
    const intersectionSet = new Set();
    for (const value of setA) {
      if (setB.has(value)) {
        intersectionSet.add(value);
      }
    }
    return intersectionSet;
  }

  const i = sets.reduce((m, s, index) => (s.size < sets[m].size ? index : m), 0);
  const [smallest] = sets.splice(i, 1);
  const res = new Set();
  for (const val of smallest) {
    if (sets.every((s) => s.has(val))) {
      res.add(val);
    }
  }
  return res;
}
