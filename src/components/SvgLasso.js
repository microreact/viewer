import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";

class SvgLasso extends React.PureComponent {

  state = {};

  handleClick = (e) => {
    const { props, state } = this;
    const event = e.originalEvent || e;
    const coordinates = props.unproject([ event.layerX, event.layerY ]);

    if (state.path && state.path.length > 2) {
      const padding = this.props.pointSize;
      const pointTopLeft = props.unproject([ event.layerX - padding, event.layerY - padding ]);
      const pointBottomRight = props.unproject([ event.layerX + padding, event.layerY + padding ]);
      if (
        (pointBottomRight[0] >= state.path[0][0] && pointTopLeft[0] <= state.path[0][0])
        &&
        (
          (pointBottomRight[1] >= state.path[0][1] && pointTopLeft[1] <= state.path[0][1])
          ||
          (pointBottomRight[1] <= state.path[0][1] && pointTopLeft[1] >= state.path[0][1])
        )
      ) {
        // push the first point to the end of the path to close the polygon
        // and mark the path as finished
        const newPath = [
          ...state.path,
          state.path[0],
        ];
        this.props.onPathChange(newPath);
        return;
      }
    }

    const newPath = [
      ...(state.path || []),
      coordinates,
    ];
    this.setState({ path: newPath });
  };

  handleDrag = (event, position) => {
    const { props, state } = this;
    const newPath = [
      ...(state.path || props.path),
    ];
    const coordinates = props.unproject([ position.x, position.y ]);
    const pointIndex = parseInt(position.node.dataset.index, 10);
    const isFirstPoint = (
      pointIndex === 0
      &&
      newPath[newPath.length - 1][0] === newPath[0][0]
      &&
      newPath[newPath.length - 1][1] === newPath[0][1]
    );
    newPath[pointIndex] = coordinates;
    if (isFirstPoint) {
      newPath[newPath.length - 1] = coordinates;
    }
    this.setState({ path: newPath });
  };

  componentDidMount() {
    const { props } = this;
    props.registerClick(this.handleClick);
  }

  componentWillUnmount() {
    const { props } = this;
    props.unregisterClick(this.handleClick);
  }

  renderContent() {
    const { props, state } = this;

    const path = state.path || props.path;

    // if (path) {
    //   const points = [];
    //   for (const coordinates of path) {
    //     const pixelPoint = props.project(coordinates);
    //     points.push(`${pixelPoint.x},${pixelPoint.y}`);
    //   }

    //   // return (
    //   //   <React.Fragment>
    //   //     <polyline
    //   //       points={points.join(", ")}
    //   //       stroke={props.lineStroke}
    //   //       fill="none"
    //   //       strokeWidth={props.lineWidth}
    //   //     />
    //   //     {
    //   //       path.map((coordinates) => {
    //   //         const pixelPoint = props.project(coordinates);
    //   //         return (
    //   //             <rect
    //   //               className="mr-lasso-point"
    //   //               fill={props.pointFill}
    //   //               height={props.pointSize}
    //   //               key={coordinates.join()}
    //   //               stroke={props.pointStroke}
    //   //               title="Move point"
    //   //               width={props.pointSize}
    //   //               x={pixelPoint.x - (props.pointSize / 2)}
    //   //               y={pixelPoint.y - (props.pointSize / 2)}
    //   //             />
    //   //         );
    //   //       })
    //   //     }
    //   //   </React.Fragment>
    //   // );
    // }

    if (path) {
      const points = [];
      const handles = [];
      for (let index = 0; index < path.length; index++) {
        const coordinates = path[index];
        const isLastPoint = (
          index === (path.length - 1)
          &&
          path[path.length - 1][0] === path[0][0]
          &&
          path[path.length - 1][1] === path[0][1]
        );

        const pixelPoint = props.project(coordinates);

        if (isLastPoint) {
          points.push(points[0]);
        }
        else {
          points.push(`${pixelPoint.x},${pixelPoint.y}`);
        }

        if (!isLastPoint) {
          handles.push(
            <Draggable
              key={index}
              onDrag={this.handleDrag}
              onStart={this.handleStart}
              onStop={this.handleStop}
              position={pixelPoint}
            >
              <rect
                className="mr-lasso-point"
                data-index={index}
                fill={props.pointFill}
                height={props.pointSize}
                stroke={props.pointStroke}
                title="Move point"
                width={props.pointSize}
                x={-(props.pointSize / 2)}
                y={-(props.pointSize / 2)}
                // x={pixelPoint.x - (props.pointSize / 2)}
                // y={pixelPoint.y - (props.pointSize / 2)}
              />
            </Draggable>
          );
        }
      }

      return (
        <React.Fragment>
          <polyline
            points={points.join(", ")}
            stroke={props.lineStroke}
            fill="none"
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
