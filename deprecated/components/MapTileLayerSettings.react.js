import React from "react";
import PropTypes from "prop-types";

import Dialog from "./Dialog.react";

const OptionInput = (props) => (
  <div
    className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"
    style={{ width: "100%" }}
    title={props.title}
  >
    <input
      className="mdl-textfield__input"
      value={props.value || ""}
      onChange={({ target }) => props.onChange(target.value)}
    />
    <label className="mdl-textfield__label">
      {props.label}
    </label>
  </div>
);

OptionInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default class extends React.PureComponent {

  static displayName = "MapControls";

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onTileLayerChange: PropTypes.func.isRequired,
    tileLayerOpts: PropTypes.string,
    tileLayerUrl: PropTypes.string,
    tileLayerError: PropTypes.string,
  }

  state = {
    tileLayerUrl: this.props.tileLayerUrl,
    tileLayerOpts: this.props.tileLayerOpts,
  }

  componentDidMount() {
    componentHandler.upgradeDom();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tileLayerUrl !== this.props.tileLayerUrl || nextProps.tileLayerOpts !== this.props.tileLayerOpts) {
      this.setState({
        tileLayerUrl: nextProps.tileLayerUrl,
        tileLayerOpts: nextProps.tileLayerOpts,
      });
    }
  }

  setOption(options) {
    const tileLayerOpts = this.state.tileLayerOpts || {};
    this.setState({
      tileLayerOpts: {
        ...tileLayerOpts,
        ...options,
      },
    });
  }

  render() {
    const tileLayerOpts = this.state.tileLayerOpts || {};
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title="Tile layer settings"
        submitLabel="Change"
        closeLabel="Cancel"
        onSubmit={() => {
          this.props.onTileLayerChange({
            style: "custom",
            tileLayerUrl: this.state.tileLayerUrl,
            tileLayerOpts: this.state.tileLayerOpts,
            tileLayerError: null,
          });
        }}
        onClose={this.props.onClose}
        submitDisabled={!this.state.tileLayerUrl}
      >
        <p>
          Map tiles can be changed by entering tile layer details below. Refer to<br />
          <a href="http://leaflet-extras.github.io/leaflet-providers/preview/index.html" target="_blank">
            http://leaflet-extras.github.io/leaflet-providers/preview/index.html
          </a> for examples.
        </p>
        {
          this.props.tileLayerError && (
            <p className="mr-tile-layer-error">{this.props.tileLayerError}</p>
          )
        }
        <OptionInput
          label="URL template"
          value={this.state.tileLayerUrl || ""}
          onChange={(value) => this.setState({ tileLayerUrl: value })}
        />
        <OptionInput
          label="Attribution"
          title="String to be shown in the attribution control, e.g. '© OpenStreetMap contributors'."
          value={tileLayerOpts.attribution}
          onChange={(value) => this.setOption({ attribution: value })}
        />
        <OptionInput
          label="Max zoom (optional)"
          title="The minimum zoom level down to which this layer will be displayed."
          value={tileLayerOpts.minZoom}
          onChange={(value) => this.setOption({ minZoom: value })}
        />
        <OptionInput
          label="Max zoom (optional)"
          title="The maximum zoom level up to which this layer will be displayed."
          value={tileLayerOpts.maxZoom}
          onChange={(value) => this.setOption({ maxZoom: value })}
        />
      </Dialog>
    );
  }

}
