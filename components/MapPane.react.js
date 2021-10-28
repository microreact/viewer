import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import ReactMapGL, {
  ScaleControl,
} from "react-map-gl";
import debounce from "lodash.debounce";

import "../css/map-pane.css";

import ZoomControls from "./ZoomControls.react";
import MapMarkersLayer from "../containers/MapMarkersLayer.react";
import MapLassoOverlay from "../containers/MapLassoLayer.react";
import MapControls from "../containers/MapControls.react";
import MapGeojsonLayer from "../containers/MapGeojsonLayer.react";
import MapLegend from "../containers/MapLegend.react";
import MapTooltip from "../containers/MapTooltip.react";

import { downloadDataUrl } from "../utils/downloads";
import { MapboxStyle, MapMarker, ReactRef } from "../utils/prop-types";
import * as HtmlUtils from "../utils/html";
import { subscribe } from "../utils/events";

const InteractiveMap = React.memo(
  (props) => {
    return (
      <ReactMapGL
        {...props.viewport}
        height={props.height}
        mapboxApiAccessToken={props.mapboxApiAccessToken}
        mapId={props.mapId}
        mapStyle={props.mapboxStyle}
        onClick={props.onClick}
        onResize={props.onResize}
        onHover={props.onHover}
        onViewportChange={props.onViewportChange}
        ref={props.reactMapRef}
        width={props.width}
      >
        {
          props.showRegions && (
            <MapGeojsonLayer
              mapId={props.mapId}
            />
          )
        }

        <MapMarkersLayer
          mapId={props.mapId}
        />

        <MapLassoOverlay
          mapId={props.mapId}
        />

        <ScaleControl />

      </ReactMapGL>
    );
  }
);

InteractiveMap.displayName = "InteractiveMap";

InteractiveMap.propTypes = {
  height: PropTypes.number.isRequired,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  mapboxStyle: MapboxStyle.isRequired,
  mapId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  reactMapRef: ReactRef,
  showRegions: PropTypes.bool.isRequired,
  viewport: ReactMapGL.propTypes.viewState,
  width: PropTypes.number.isRequired,
};

class MapPane extends React.PureComponent {

  state = {
  }

  elementRef = React.createRef()

  reactMapRef = React.createRef()

  componentDidMount() {
    this.beforeScreenshotUnsubscribe = subscribe(
      "before-screenshot",
      () => {
        const _mapbox = this.getMapboxWrapper();
        _mapbox._preserveDrawingBuffer = true;
        _mapbox._render();
      },
    );
    this.afterScreenshotUnsubscribe = subscribe(
      "after-screenshot",
      () => {
        const _mapbox = this.getMapboxWrapper();
        _mapbox._preserveDrawingBuffer = false;
        _mapbox._render();
      },
    );
  }

  componentWillUnmount() {
    this?.beforeScreenshotUnsubscribe();
    this?.afterScreenshotUnsubscribe();
  }

  componentDidUpdate(prevProps) {
    // require("../../dev/compare-prev-props")(prevProps, this.props, "map-props");
    // require("../../dev/compare-prev-props")(prevState, this.state, "map-state");
    if (this.props.trackViewport && this.props.trackViewport !== prevProps.trackViewport) {
      this.handleViewportFilter();
    }
  }

  findMarkerAtPoint(point) {
    // Reverse order so that markers on top are tested first
    for (let index = this.props.markers.length - 1; index >= 0; index--) {
      const marker = this.props.markers[index];
      if (point.x >= marker.minx && point.x <= marker.maxx && point.y >= marker.miny && point.y <= marker.maxy) {
        return this.props.markers[index];
      }
    }

    return undefined;
  }

  getMapboxWrapper = () => {
    return this.reactMapRef.current.getMap();
  }

  handleMarkerClick = (event) => {
    const isAppend = (event.srcEvent.metaKey || event.srcEvent.ctrlKey);
    if (this.props.showMarkers) {
      const marker = this.findMarkerAtPoint(event.offsetCenter);
      if (marker) {
        this.props.onSelectRows(
          marker.rows.map((row) => row[0]),
          isAppend,
        );
        return;
      }
    }
    if (this.props.showRegions && event.features) {
      const feature = event.features.find((x) => x.layer.id === "mr-geojson-layer");
      if (feature) {
        this.props.onSelectRegion(
          feature.properties["mr-region-id"],
          isAppend,
        );
        return;
      }
    }
    if (!isAppend) {
      this.props.onSelectRows();
    }
  }

  handleMapHover = (event) => {
    if (this.props.showMarkers) {
      const marker = this.findMarkerAtPoint(event.offsetCenter);
      if (marker) {
        if (marker !== this.state.hover?.marker) {
          this.setState({
            hover: {
              marker,
              x: event.srcEvent.offsetX,
              y: event.srcEvent.offsetY,
            },
          });
        }
        return;
      }
    }

    if (this.props.showRegions) {
      const region = event.features && event.features.find((x) => x.layer.id === "mr-geojson-layer");
      if (region) {
        if (region !== this.state.hover?.region) {
          this.setState({
            hover: {
              region,
              x: event.srcEvent.offsetX,
              y: event.srcEvent.offsetY,
            },
          });
        }
        return;
      }
    }

    if (this.state.hover) {
      this.setState({ hover: null });
    }
  }

  handleViewportChange = (viewState, interactionState, oldViewState) => {
    // Ignores the very first viewport change event by waiting for the reference to be set
    if (oldViewState && Object.keys(oldViewState).length === 0) {
      this.setState({ renderedAt: new Date().valueOf() });
    }
    else {
      if (
        !oldViewState
        ||
        oldViewState.altitude !== viewState.altitude
        ||
        oldViewState.bearing !== viewState.bearing
        ||
        oldViewState.latitude !== viewState.latitude
        ||
        oldViewState.longitude !== viewState.longitude
        ||
        oldViewState.pitch !== viewState.pitch
        ||
        oldViewState.zoom !== viewState.zoom
      ) {
        this.props.onViewportChange({
          altitude: viewState.altitude,
          bearing: viewState.bearing,
          latitude: viewState.latitude,
          longitude: viewState.longitude,
          pitch: viewState.pitch,
          zoom: viewState.zoom,
        });
      }
      else {
        this.setState({ renderedAt: new Date().valueOf() });
      }

      if (this.props.trackViewport) {
        this.debouncedViewportFilter();
      }
    }
  }

  handleResize = () => {
    this.setState({
      renderedWidth: this.props.width,
      renderedHeight: this.props.height,
    });
  }

  handleZoom = (delta) => {
    this.handleViewportChange({
      ...this.props.viewport,
      zoom: this.props.viewport.zoom + delta,
    });
  };

  handleDownloadPNG = () => {
    const mapboxMap = this.reactMapRef.current.getMap();
    mapboxMap.once("render", (x) => {
      HtmlUtils.exportHtmlElementAsDataUrl(this.elementRef.current)
        .then((url) =>
          downloadDataUrl(
            url,
            "map.png",
            "image/png",
          )
        );
    });
    mapboxMap.triggerRepaint();
  }

  handleViewportFilter = () => {
    const mapboxMap = this.reactMapRef.current.getMap();
    const bounds = mapboxMap.getBounds();
    this.props.onPathChange([
      bounds.getNorthWest().toArray(),
      bounds.getNorthEast().toArray(),
      bounds.getSouthEast().toArray(),
      bounds.getSouthWest().toArray(),
      bounds.getNorthWest().toArray(),
    ]);
  }

  debouncedViewportFilter = debounce(
    this.handleViewportFilter,
    200,
  );

  renderTooltip() {
    const { state } = this;

    if (state.hover) {
      return (
        <MapTooltip
          mapId={this.props.mapId}
          {...state.hover}
        />
      );
    }

    return null;
  }

  render() {
    const { props, state } = this;

    return (
      <div
        className={state.hover ? "mr-map hovered" : "mr-map"}
        ref={this.elementRef}
        // style={
        //   {
        //     width: this.props.width,
        //     height: this.props.height,
        //   }
        // }
      >
        <InteractiveMap
          height={props.height}
          mapboxApiAccessToken={props.mapboxApiAccessToken}
          mapId={props.mapId}
          mapboxStyle={props.mapboxStyle}
          onClick={this.handleMarkerClick}
          onHover={this.handleMapHover}
          onResize={this.handleResize}
          onViewportChange={this.handleViewportChange}
          reactMapRef={this.reactMapRef}
          viewport={props.viewport}
          width={props.width}
          showRegions={props.showRegions}
          // markersOverlayRef={this.markersOverlayRef}
          // lassoOverlayRef={this.lassoOverlayRef}
          renderedWidth={state.renderedWidth}
          renderedHeight={state.renderedHeight}
          renderedAt={state.renderedAt}
        />

        { this.renderTooltip() }

        {
          props.hasLegend && (
            <MapLegend
              mapId={this.props.mapId}
            />
          )
        }

        <MapControls
          mapId={this.props.mapId}
          onDownloadPNG={this.handleDownloadPNG}
        />

        <ZoomControls
          className={classnames({ visible: this.props.controls })}
          onZoomIn={() => this.handleZoom(+1)}
          onZoomOut={() => this.handleZoom(-1)}
        />
      </div>
    );
  }

}

MapPane.displayName = "MapPane";

MapPane.propTypes = {
  controls: PropTypes.bool.isRequired,
  hasLegend: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  mapboxStyle: MapboxStyle.isRequired,
  mapId: PropTypes.string.isRequired,
  markers: PropTypes.arrayOf(MapMarker).isRequired,
  onPathChange: PropTypes.func.isRequired,
  onSelectRegion: PropTypes.func.isRequired,
  onSelectRows: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  showMarkers: PropTypes.bool.isRequired,
  showRegions: PropTypes.bool.isRequired,
  tileLayerOpts: PropTypes.string,
  tileLayerUrl: PropTypes.string,
  trackViewport: PropTypes.bool.isRequired,
  type: PropTypes.string,
  viewport: ReactMapGL.propTypes.viewState,
  width: PropTypes.number.isRequired,
  zoom: PropTypes.number,
};

export default MapPane;
