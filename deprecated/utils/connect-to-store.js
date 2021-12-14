import React from "react";

import store from "../../dev/store";

export default function connect(
  // Component,
  mapStateToProps,
  mapDispatchToProps,
) {
  return (Component) => {
    class Wrapper extends React.PureComponent {

      state = {
        state: store.getState(),
      }

      componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
          const state = store.getState();
          this.setState({ state });
        });
      }

      componentWillUnmount() {
        this.unsubscribe();
      }

      render() {
        const props = {};
        Object.assign(props, this.props);
        if (mapStateToProps) {
          Object.assign(props, mapStateToProps(this.state.state, this.props));
        }
        if (mapDispatchToProps) {
          Object.assign(props, mapDispatchToProps(store.dispatch, this.props));
        }
        return (
          <Component
            {...props}
          />
        );
      }

    }

    return Wrapper;
  };
}
