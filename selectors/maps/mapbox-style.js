import { createKeyedStateSelector } from "../../utils/state";

// const categories = [ "labels", "roads", "buildings", "parks", "water", "background" ];
// const layerSelector = {
//   background: /background/,
//   water: /water/,
//   parks: /park/,
//   buildings: /building/,
//   roads: /bridge|road|tunnel/,
//   labels: /label|place|poi/
// };

const mapboxStyleSelector = createKeyedStateSelector(
  (state, mapId) => state.maps[mapId].style,
  (
    style,
  ) => {
    // const visibility = {
    //   water: false,
    //   parks: true,
    //   buildings: true,
    //   roads: true,
    //   labels: true,
    //   background: true,
    // };
    // for (const layer of mapboxStyle.layers) {
    //   return categories.every(name => visibility[name] || !layerSelector[name].test(layer.id));
    // }

    // mapboxStyle.layers = mapboxStyle.layers.filter(layer => {
    //   return categories.every(name => visibility[name] || !layerSelector[name].test(layer.id));
    // })

    // return mapboxStyle;

    return `mapbox://styles/mapbox/${style}-v9`;
  },
);

export default mapboxStyleSelector;
