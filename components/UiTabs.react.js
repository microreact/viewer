import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

// import "../styles/ui-tabs.css";
import { nextAnimation } from "../utils/browser";

class UiTabs extends React.PureComponent {

  static getDerivedStateFromProps(props) {
    if (props.selectedIndex) {
      return { value: props.selectedIndex.toString() };
    }
    else {
      return null;
    }
  }

  state = {
    value: this.props.defaultPaneIndex?.toString() ?? "0",
  }

  componentDidMount() {
    nextAnimation(() => this.setState({ loaded: true }));
  }

  handleChange = (event, newValue) => {
    this.selectTab(newValue);
  }

  selectTab = (index) => {
    this.setState({ value: index.toString() });
  }

  render() {
    const { props, state } = this;

    const tabs = props.children.filter((x) => !!x);

    return (
      <TabContext value={state.value}>
        <div
          className={
            classnames(
              "mr-ui-tabs",
              props.className,
            )
          }
          style={props.style}
        >
          <TabList
            onChange={this.handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            {
              tabs.map(
                (tab, index) => {
                  return (
                    <Tab
                      key={tab.props.label || tab.key || index}
                      label={tab.props.label || index}
                      value={index.toString()}
                    />
                  );
                }
              )
            }
          </TabList>
          {
            tabs.map(
              (tab, index) => {
                return (
                  <TabPanel
                    key={tab.props.label || tab.key || index}
                    value={index.toString()}
                  >
                    { tab.props.children }
                  </TabPanel>
                );
              }
            )
          }
        </div>
      </TabContext>
    );
  }

}

UiTabs.displayName = "UiTabs";

UiTabs.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  defaultPaneIndex: PropTypes.number,
  selectedIndex: PropTypes.number,
  style: PropTypes.object,
};

UiTabs.TabPanel = "div";

export default UiTabs;
