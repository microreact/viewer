import PropTypes from "prop-types";
import React from "react";

import UiCombobox from "./UiCombobox.react";
import UiRadioList from "./UiRadioList.react";

class LinkGeoFileStep extends React.PureComponent {

  static displayName = "LinkGeoFileStep"

  static propTypes = {
    data: PropTypes.object,
  }

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

    if ((data.linkType === "geographic-coordinates") || (data.masterDataField && data.linkPropertyName)) {
      return [
        data.linkFile,
        {
          linkType: data.linkType,
          masterFieldName: data.masterDataField ? data.masterDataField.name : undefined,
          linkPropertyName: data.linkPropertyName,
        },
      ];
    }

    return false;
  }

  render() {
    const data = this.getDerivedData();
    const masterDataFile = data.masterDataFile;
    const masterDataFields = masterDataFile.content.fields;
    return (
      <div>
      <UiRadioList
        items={
          [
            { label: "Link GeoJSON features to metadata using each row latitude and longitude.", value: "geographic-coordinates" },
            { label: "Link a GeoJSON property to a metadata field.", value: "field-property" },
          ]
        }
        onChange={(value) => this.setData({ linkType: value })}
        value={data.linkType}
      />
      {
        (data.linkType === "field-property") && (
          <div className="mr-link-section">
            <UiCombobox
              label="Metadata field"
              options={masterDataFields}
              onChange={(item) => this.setData({ masterDataField: item })}
              value={data.masterDataField}
            />
            <span>
              &equiv;
            </span>
            <UiCombobox
              label="GeoJSON property"
              options={data.allPropertyNames}
              onChange={(item) => this.setData({ linkPropertyName: item })}
              value={data.linkPropertyName}
            />
          </div>
        )
      }
    </div>
    );
  }

}

export default LinkGeoFileStep;
