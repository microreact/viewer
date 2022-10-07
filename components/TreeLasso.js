import React from "react";

import PropTypes from "prop-types";
import SvgLasso from "./SvgLasso";

import { isPointInPolygon } from "../utils/geometry";

import styles from "../styles/tree-lasso.module.css";

function zoomToScale(zoom) {
  // eslint-disable-next-line prefer-exponentiation-operator, no-restricted-properties
  return Math.pow(2, zoom);
}

function TreeLasso(props) {
  const tree = props.tree;

  if (tree) {
    const width = tree.props.size.width;
    const height = tree.props.size.height;

    const registerClick = React.useCallback(
      (clickHandler) => { tree.lassoClickHandler = clickHandler; },
      [ tree ],
    );

    const unregisterClick = React.useCallback(
      (clickHandler) => { tree.lassoClickHandler = null; },
      [ tree ],
    );

    const project = React.useCallback(
      (point) => {
        const scale = zoomToScale(tree.getZoom());
        const [ x, y ] = props.tree.projectPoint(
          tree.relativePointToAbsolutePoint(point),
          scale,
        );
        return { x, y };
      },
      [ tree.props ],
    );

    const unproject = React.useCallback(
      (point) => {
        const coordinates = tree.absolutePointToRelativePoint(tree.unprojectPoint(point));
        return coordinates;
      },
      [ tree.props ],
    );

    const onPathChange = React.useCallback(
      (path) => {
        // if (path === null && treePane.props.selectedIds.length) {
        //   return;
        // }
        let ids = null;
        if (path) {
          ids = [];
          const graph = tree.getGraphAfterLayout();
          for (const leaf of graph.leaves) {
            if (isPointInPolygon(tree.absolutePointToRelativePoint([ leaf.x, leaf.y ]), path)) {
              ids.push(leaf.id);
            }
          }
        }
        props.onFilterChange(ids, path);
      },
      [ tree ],
    );

    return (
      <SvgLasso
        className={styles.root}
        height={height}
        isActive={props.isActive}
        onPathChange={onPathChange}
        path={props.path}
        project={project}
        registerClick={registerClick}
        unproject={unproject}
        unregisterClick={unregisterClick}
        version={props.version}
        width={width}
      />
    );
  }

  return null;
}

TreeLasso.displayName = "TreeLasso";

TreeLasso.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  tree: PropTypes.object,
};

export default TreeLasso;
