export function mapQueryToProps(map, query = {}) {
  const props = {};
  for (const queryKey of Object.keys(query)) {
    for (const propKey of Object.keys(map)) {
      if (map[propKey].key === queryKey) {
        let newValue = null;
        if (map[propKey].values) {
          newValue = Object.keys(map[propKey].values).find(
            (valueKey) => (map[propKey].values[valueKey] === query[queryKey])
          );
        } else {
          newValue = query[queryKey];
        }
        switch (map[propKey].type) {
          case Number:
            newValue = parseInt(newValue, 10);
            break;
          case Boolean:
            newValue = (newValue || 1).toString() === "1";
            break;
          case Array:
            newValue = (newValue || "").split(",");
            break;
        }
        props[propKey] = newValue;
      }
    }
  }
  return props;
}
