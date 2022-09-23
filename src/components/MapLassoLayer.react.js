import React from "react";
import { useMap } from "react-map-gl";

import PropTypes from "prop-types";
import CustomOverlay from "./ReactPortalOverlay";
import Lasso from "./SvgLasso";

function MapLasso(props) {
  const { current: map } = useMap();

  if (map) {
    const width = map.getContainer().clientWidth;
    const height = map.getContainer().clientHeight;

    const registerClick = React.useCallback(
      (clickHandler) => map.on("click", clickHandler),
      [ map ],
    );

    const unregisterClick = React.useCallback(
      (clickHandler) => map.off("click", clickHandler),
      [ map ],
    );

    const project = React.useCallback(
      (point) => {
        return map.project.call(map, point);
      },
      [ map ],
    );

    const unproject = React.useCallback(
      (point) => {
        const coordinates = map.unproject.call(map, point);
        return [ coordinates.lng, coordinates.lat ];
      },
      [ map ],
    );

    return (
      <Lasso
        version={props.version}
        height={height}
        isActive={props.isActive}
        onPathChange={props.onPathChange}
        path={props.path}
        project={project}
        unproject={unproject}
        width={width}
        registerClick={registerClick}
        unregisterClick={unregisterClick}
      />
    );
  }

  return null;
}

MapLasso.displayName = "MapLasso";

MapLasso.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  version: PropTypes.number.isRequired,
};

export default function MapLassoOverlay(props) {
  return (
    <CustomOverlay>
      <MapLasso {...props} />
    </CustomOverlay>
  );
}

MapLassoOverlay.displayName = "MapLassoOverlay";

MapLassoOverlay.propTypes = {
  map: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
};
