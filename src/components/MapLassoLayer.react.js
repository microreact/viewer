import React,{useCallback} from "react";

import DrawControl from "./DrawControl.react";

import PropTypes from "prop-types";

const handleCreate = (controls,onPathChange) =>{
    const path = controls?.features[0]?.geometry?.coordinates;
    console.log('controls', controls?.features);
    onPathChange(path[0]);
    return null;
};

const handleDelete = (onPathChange)=>{
    onPathChange(null);
    return null;
}

 export default function MapLassoOverlay(props) {

  const {isActive, strokeStyle, pointFillStyle, path, pointSize} = props;

  const onCreate = useCallback((controls)=> handleCreate(controls, props.onPathChange),[]);
  const onDelete = useCallback(()=> handleDelete(props.onPathChange),[]);

  return isActive ? (
      <DrawControl
      displayControlsDefault={false}
      defaultMode= 'draw_polygon'
      path={path}
      onCreate={onCreate}
      onUpdate={onCreate}
      onDelete={onDelete}
      userProperties={true}
      styles={[
        {
          "id": "gl-draw-line",
          "type": "line",
          "paint": {
            "line-color": strokeStyle,
            "line-width": 2,
          }
        },
        {
            "id": "gl-draw-line-vertex",
            "type": "circle",
          "paint": {
            "circle-radius": pointSize,
            "circle-color": pointFillStyle,
            "circle-stroke-color": strokeStyle,
            'circle-stroke-width':2,
            "circle-opacity": 0.8,
          }
        }
      ]}
  />) : null;
}

MapLassoOverlay.displayName = "MapLassoOverlay";

MapLassoOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  pointSize: PropTypes.number,
};

MapLassoOverlay.defaultProps = {
  dotsStyle: "#383838",
  isActive: false,
  lineWidth: 2,
  path: null,
  pointFillStyle: "#ffffff",
  pointSize: 14,
  pointStrokeStyle: "#000000",
  strokeStyle: "#3C7383",
};
