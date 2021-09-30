import PropTypes from "prop-types";
import React from "react";
import { Transition } from "react-transition-group";

const duration = 300;

const transition = `opacity ${duration}ms ease-in-out`;

const outStyle = {
  transition,
  opacity: 0,
};

const inStyle = {
  transition,
  opacity: 1,
};

const hiddenStyle = {
  transition,
  opacity: 0,
  visibility: "hidden",
};

const transitionStyles = {
  entering: inStyle,
  entered: inStyle,
  exiting: outStyle,
  exited: hiddenStyle,
};

// const Animation = ({ in: inProp, children }) => (
//   <Transition in={inProp} timeout={duration}>
//     {(state) => (
//       <div style={{
//         ...defaultStyle,
//         ...transitionStyles[state],
//       }}>
//         { children }
//       </div>
//     )}
//   </Transition>
// );

const Animation = (props) => {
  if (Array.isArray(props.children)) {
    return (
      <Transition
        in={props.in}
        mountOnEnter
        timeout={duration}
        unmountOnExit
      >
        {
          (state) => {
            return props.children.map((el, index) => {
              if (React.isValidElement(el)) {
                return React.cloneElement(
                  el,
                  {
                    key: index,
                    style: transitionStyles[state],
                  },
                );
              }
              else {
                return el;
              }
            });
          }
        }
      </Transition>
    );
  }
  else {
    return (
      <Transition
        in={props.in}
        mountOnEnter
        timeout={duration}
        unmountOnExit
      >
        {
          (state) => {
            return React.cloneElement(
              props.children,
              {
                style: transitionStyles[state],
              },
            );
          }
        }
      </Transition>
    );
  }
};

Animation.propTypes = {
  children: PropTypes.node,
  in: PropTypes.bool,
};

export default Animation;
