import React from "react";
import { createPortal } from "react-dom";
import { useControl} from "react-map-gl";
import SVGLasso from "./SvgLasso.js";

function LassoOverLay(props){
  const element = document.querySelector('canvas.mr-lasso-canvas');
 return createPortal(React.cloneElement(props.children,{path: props.path}),element);
}


export default function TreeLasso(props){
  const registerClick = React.useCallback((handler)=> props.lassoRef.addEventListener("click", handler),[]);
  const unregisterClick = React.useCallback((handler)=> props.lassoRef.removeEventListeners("click", handler),[]);

  return (
    <LassoOverLay path={props.lassoPath} ç={props.lassoRef}>
        <SVGLasso
          isActive={props.isLassoActive}
          height={props.height}
          width={props.width}
          onPathChange={props.tree.onPathChange}
          path={props.lassoPath}
          registerClick={registerClick}
          unregisterClick={unregisterClick}
          project={props.tree.project}
          unproject={props.tree.unproject}
        />
    </LassoOverLay>
  )
}