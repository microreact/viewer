import Draggable from "react-draggable";
import PropTypes from "prop-types";
import React from "react";

function isClosedPath(newPath) {
  return (
    newPath.length > 3
    &&
    newPath[0][0] === newPath[newPath.length - 1][0]
    &&
    newPath[0][1] === newPath[newPath.length - 1][1]
  );
}

class SvgLasso extends React.PureComponent {

  state = {};

  handleCanvasClick = (e) => {
    const { props, state } = this;

    // if (state.path && state.path.length > 2) {
    //   const padding = this.props.pointSize;
    //   const pointTopLeft = props.unproject([ event.layerX - padding, event.layerY - padding ]);
    //   const pointBottomRight = props.unproject([ event.layerX + padding, event.layerY + padding ]);
    //   if (
    //     (pointBottomRight[0] >= state.path[0][0] && pointTopLeft[0] <= state.path[0][0])
    //     &&
    //     (
    //       (pointBottomRight[1] >= state.path[0][1] && pointTopLeft[1] <= state.path[0][1])
    //       ||
    //       (pointBottomRight[1] <= state.path[0][1] && pointTopLeft[1] >= state.path[0][1])
    //     )
    //   ) {
    //     // push the first point to the end of the path to close the polygon
    //     // and mark the path as finished
    //     const newPath = [
    //       ...state.path,
    //       state.path[0],
    //     ];
    //     this.props.onPathChange(newPath);
    //     return;
    //   }
    // }

    if (!props.path) {
      const event = e.originalEvent ?? e;
      const coordinates = props.unproject([ event.layerX, event.layerY ]);
      const newPath = [
        ...(state.path ?? []),
        coordinates,
      ];
      this.setState({ path: newPath });
    }
  };

  handleFinishPath = () => {
    const { props, state } = this;
    const newPath = [ ...(state.path ?? props.path) ];
    const closedPath = isClosedPath(newPath);
    if (
      !closedPath
      &&
      (state.path?.length > 2)
    ) {
      // push the first point to the end of the path to close the polygon
      // and mark the path as finished
      newPath.push(newPath[0]);
      props.onPathChange(newPath);
    }
  };

  handleDrag = (event, position) => {
    const { props, state } = this;
    const newPath = [ ...(state.path ?? props.path) ];
    const coordinates = props.unproject([ position.x, position.y ]);
    const pointIndex = parseInt(position.node.dataset.index, 10);
    const isFirstPoint = (pointIndex === 0);
    const closedPath = isClosedPath(newPath);
    newPath[pointIndex] = coordinates;
    if (isFirstPoint && closedPath) {
      newPath[newPath.length - 1] = coordinates;
    }
    this.setState({ path: newPath });
  };

  handleDragStop = (event, position) => {
    const { props, state } = this;
    const newPath = [ ...(state.path ?? props.path) ];
    const pointIndex = parseInt(position.node.dataset.index, 10);
    const isFirstPoint = (pointIndex === 0);
    const closedPath = isClosedPath(newPath);
    if (
      isFirstPoint
      &&
      !closedPath
      &&
      (state.path?.length > 2)
      &&
      (position.deltaX + position.deltaY === 0)
    ) {
      this.handleFinishPath();
    }
    else {
      props.onPathChange(state.path);
    }
  };

  componentDidMount() {
    const { props } = this;
    props.registerClick(this.handleCanvasClick);
  }

  componentWillUnmount() {
    const { props } = this;
    props.unregisterClick(this.handleCanvasClick);
  }

  renderContent() {
    const { props, state } = this;

    const path = state.path || props.path;

    if (path) {
      const polylinePoints = [];
      const handles = [];
      const closedPath = isClosedPath(path);
      for (let index = 0; index < path.length; index++) {
        const coordinates = path[index];
        // const isFirstPoint = (
        //   index === 0
        //   &&
        //   !closedPath
        // );
        const isLastPoint = (
          path.length > 1
          &&
          index === (path.length - 1)
          &&
          closedPath
        );

        const pixelPoint = props.project(coordinates);

        if (isLastPoint) {
          polylinePoints.push(polylinePoints[0]);
        }
        else {
          polylinePoints.push(`${pixelPoint.x},${pixelPoint.y}`);
        }

        if (!isLastPoint) {
          handles.push(
            <Draggable
              key={index}
              onDrag={this.handleDrag}
              onStop={this.handleDragStop}
              position={pixelPoint}
            >
              <rect
                className="mr-lasso-point"
                data-index={index}
                fill={props.pointFill}
                height={props.pointSize}
                // onClick={isFirstPoint ? this.handleFinishPath : undefined}
                stroke={props.pointStroke}
                title="Move point"
                width={props.pointSize}
                x={-(props.pointSize / 2)}
                y={-(props.pointSize / 2)}
              />
            </Draggable>
          );
        }
      }

      return (
        <React.Fragment>
          <polyline
            fill="none"
            points={polylinePoints.join(", ")}
            stroke={props.lineStroke}
            strokeWidth={props.lineWidth}
          />
          { handles }
        </React.Fragment>
      );
    }

    return null;
  }

  render() {
    const { props } = this;

    return (
      <svg
        className="mr-svg-lasso"
        height={props.height}
        width={props.width}
      >
        { this.renderContent() }
      </svg>
    );
  }

}

SvgLasso.displayName = "SvgLasso";

SvgLasso.propTypes = {
  height: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  lineStroke: PropTypes.string,
  lineWidth: PropTypes.number,
  onPathChange: PropTypes.func.isRequired,
  path: PropTypes.array,
  pointFill: PropTypes.string,
  pointSize: PropTypes.number,
  pointStroke: PropTypes.string,
  project: PropTypes.func.isRequired,
  registerClick: PropTypes.func.isRequired,
  unproject: PropTypes.func.isRequired,
  unregisterClick: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

SvgLasso.defaultProps = {
  lineStroke: "#3C7383",
  lineWidth: 2,
  pointFill: "#ffffff",
  pointSize: 12,
  pointStroke: "#000000",
};

export default React.memo(
  (props) => {
    if (!props.isActive) {
      return null;
    }
    return (
      <SvgLasso
        key={props.path}
        {...props}
      />
    );
  },
);
