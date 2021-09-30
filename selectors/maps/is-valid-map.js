import mapStateSelector from "./map-state";

function isValidMapSelector(state, mapId) {
  const mapState = mapStateSelector(state, mapId);
  return (
    (
      mapState.dataType === "geographic-coordinates"
      &&
      mapState.latitudeField
      &&
      mapState.longitudeField
    )
    ||
    (
      mapState.dataType === "iso-3166-codes"
      &&
      mapState.iso3166Field
    )
  );
}

export default isValidMapSelector;
