import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React from "react";
import { createSelector } from "reselect";

import UiCombobox from "./UiCombobox.react";
import MiniTable from "./MiniTable.react";
import UiTabs from "./UiTabs.react";
import { fullSizeStyle } from "../constants";

class LinkDataFileStep extends React.PureComponent {

  static displayName = "LinkDataFileStep"

  static propTypes = {
    data: PropTypes.object,
  }

  tabsRef = React.createRef()

  state = {
    data: {},
  }

  getDerivedData = () => {
    return {
      ...this.props.data,
      ...this.state.data,
    };
  }

  setData = (updater) => {
    this.setState({
      data: {
        ...this.state.data,
        ...updater,
      },
    });
  }

  handleContinue = () => {
    const data = this.getDerivedData();

    if (data.masterDataField && data.linkDataField) {
      return [
        data.linkDataFile,
        {
          masterFieldName: data.masterDataField.name,
          linkFieldName: data.linkDataField.name,
        },
      ];
    }

    return false;
  }

  render() {
    const data = this.getDerivedData();

    const masterDataFile = data.masterDataFile;
    const masterDataFields = masterDataFile.content.fields;
    const linkDataFile = data.linkDataFile;
    const linkDataFields = linkDataFile.content.fields;

    return (
      <Box display="flex" style={fullSizeStyle}>
        <Box style={{ width: "50%" }}>
          <p>
            Choose the identifier field for your data row.
          </p>
          <p>
            The values of the identifier field must be unique and exclude full stops and commas.
          </p>

          <div className="mr-section">
            <UiCombobox
              label={`Column in ${masterDataFile.label}`}
              options={masterDataFields}
              onChange={
                (item) => {
                  this.setData({ masterDataField: item });
                  this.tabsRef.current.selectTab(1);
                }
              }
              value={data.masterDataField}
            />
          </div>
          <div className="mr-section">
            <UiCombobox
              label={`Column in ${linkDataFile.label}`}
              options={linkDataFields}
              onChange={
                (item) => {
                  this.setData({ linkDataField: item });
                  this.tabsRef.current.selectTab(0);
                }
              }
              value={data.linkDataField}
            />
          </div>
        </Box>
        <Box style={{ width: "50%" }}>
          <UiTabs
            ref={this.tabsRef}
            style={fullSizeStyle}
          >
            <div
              label={masterDataFile.name}
              style={fullSizeStyle}
            >
              <MiniTable
                data={masterDataFile.content}
                activeFields={masterDataFile.content.fields}
                inactiveColumnTitle="This column is not unique"
                onHeaderClick={
                  (header) => {
                    this.setData({ idDataField: header });
                  }
                }
              />
            </div>
            <div
              label={linkDataFile.name}
              style={fullSizeStyle}
            >
              <MiniTable
                data={linkDataFile.content}
                activeFields={linkDataFile.content.fields}
                inactiveColumnTitle="This column is not unique"
                onHeaderClick={
                  (header) => {
                    this.setData({ idDataField: header });
                  }
                }
              />
            </div>
          </UiTabs>
        </Box>
      </Box>
    );
  }

}

export default LinkDataFileStep;
