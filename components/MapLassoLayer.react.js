import React from "react";
import { useMap } from "react-map-gl";

import PropTypes from "prop-types";
import ReactPortalOverlay from "./ReactPortalOverlay";
import SvgLasso from "./SvgLasso";

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
      [ map, props.version ],
    );

    const unproject = React.useCallback(
      (point) => {
        const coordinates = map.unproject.call(map, point);
        return [ coordinates.lng, coordinates.lat ];
      },
      [ map, props.version ],
    );

    return (
      // <ReactPortalOverlay>
        <SvgLasso
          height={height}
          isActive={props.isActive}
          onPathChange={props.onPathChange}
          path={props.path}
          project={project}
          registerClick={registerClick}
          unproject={unproject}
          unregisterClick={unregisterClick}
          version={props.version}
          width={width}
        />
      // </ReactPortalOverlay>
    );
  }

  return null;
}

MapLasso.displayName = "MapLasso";

MapLasso.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  version: PropTypes.number,
};

export default function MapLassoLayer(props) {
  const { current: map } = useMap();

  if (map) {
    return (
      <ReactPortalOverlay>
        <MapLasso
          {...props}
        />
      </ReactPortalOverlay>
    );
  }

  return null;
};
