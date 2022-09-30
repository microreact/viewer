import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import ReactMapGL, { ScaleControl } from "react-map-gl";
import debounce from "lodash.debounce";

// import "../styles/map-pane.css";

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

const interactiveLayerIds = [ "mr-geojson-layer" ];

const InteractiveMap = React.memo(
  (props) => {
    const style = React.useMemo(
      () => ({
        width: `${props.width}px`,
        height: `${props.height}px`,
      }),
      [ props.width, props.height ]
    );
    return (
      <ReactMapGL
        {...props.viewport}
        interactiveLayerIds={props.showRegions ? interactiveLayerIds : undefined}
        mapboxAccessToken={props.mapboxApiAccessToken}
        mapId={props.mapId}
        mapStyle={props.mapboxStyle}
        onClick={props.onClick}
        onMouseMove={props.onHover}
        onMove={props.onViewportChange}
        ref={props.reactMapRef}
        renderWorldCopies={false}
        style={style}
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

        {
          !props.hideScaleControl && (<ScaleControl />)
        }

      </ReactMapGL>
    );
  }
);

InteractiveMap.displayName = "InteractiveMap";

InteractiveMap.propTypes = {
  hideScaleControl: PropTypes.bool,
  height: PropTypes.number.isRequired,
  mapboxApiAccessToken: PropTypes.string.isRequired,
  mapboxStyle: MapboxStyle.isRequired,
  mapId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  reactMapRef: ReactRef,
  showRegions: PropTypes.bool.isRequired,
  viewport: PropTypes.object,
  width: PropTypes.number.isRequired,
};

class MapPane extends React.PureComponent {

  state = {};

  elementRef = React.createRef();

  reactMapRef = React.createRef();

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

    this.props.onViewportChange(this.props.viewport);

    // const _mapbox = this.getMapboxWrapper();
    // _mapbox.setPaintProperty("water", "fill-color", "#bd0026");
  }

  componentWillUnmount() {
    this?.beforeScreenshotUnsubscribe();
    this?.afterScreenshotUnsubscribe();
  }

  componentDidUpdate(prevProps) {
    const { props } = this;

    // https://github.com/visgl/react-map-gl/issues/1984#issuecomment-1244534396
    if (props.width !== prevProps.width || props.height !== prevProps.height) {
      this.getMapboxWrapper().resize();
    }

    if (props.trackViewport && props.trackViewport !== prevProps.trackViewport) {
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
  };

  handleMarkerClick = (event) => {
    const isAppend = (event.originalEvent.metaKey || event.originalEvent.ctrlKey);

    if (this.props.showMarkers) {
      const marker = this.findMarkerAtPoint(event.point);
      if (marker) {
        this.props.onSelectRows(
          marker.rows.map((row) => row[0]),
          isAppend,
        );
        event.preventDefault();
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
        event.preventDefault();
        return;
      }
    }

    if (!isAppend) {
      this.props.onSelectRows();
    }
  };

  handleMapHover = (event) => {
    if (this.props.showMarkers) {
      const marker = this.findMarkerAtPoint(event.point);
      if (marker) {
        if (marker !== this.state.hover?.marker) {
          this.setState({
            hover: {
              marker,
              x: event.originalEvent.offsetX,
              y: event.originalEvent.offsetY,
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
              x: event.originalEvent.offsetX,
              y: event.originalEvent.offsetY,
            },
          });
        }
        return;
      }
    }

    if (this.state.hover) {
      this.setState({ hover: null });
    }
  };

  handleViewportChange = (event) => {
    const { props } = this;
    if (
      event.viewState
      ||
      event.viewState.altitude !== props.viewport.altitude
      ||
      event.viewState.bearing !== props.viewport.bearing
      ||
      event.viewState.latitude !== props.viewport.latitude
      ||
      event.viewState.longitude !== props.viewport.longitude
      ||
      event.viewState.pitch !== props.viewport.pitch
      ||
      event.viewState.zoom !== props.viewport.zoom
    ) {
      this.props.onViewportChange(event.viewState);
    }

    if (this.props.trackViewport) {
      this.debouncedViewportFilter();
    }
  };

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
  };

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
  };

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

  nodeRef = React.createRef();

  render() {
    const { props, state } = this;

    return (
      <div
        className={state.hover ? "mr-map mr-hovered" : "mr-map"}
        ref={this.elementRef}
      > 
        <InteractiveMap
          height={props.height}
          mapboxApiAccessToken={props.mapboxApiAccessToken}
          mapId={props.mapId}
          mapboxStyle={props.mapboxStyle}
          onClick={this.handleMarkerClick}
          onHover={this.handleMapHover}
          onViewportChange={this.handleViewportChange}
          reactMapRef={this.reactMapRef}
          viewport={props.viewport}
          width={props.width}
          showRegions={props.showRegions}
          hideScaleControl={props.hideScaleControl}
          // markersOverlayRef={this.markersOverlayRef}
          // lassoOverlayRef={this.lassoOverlayRef}
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
  hideScaleControl: PropTypes.bool,
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
  viewport: PropTypes.object,
  width: PropTypes.number.isRequired,
  zoom: PropTypes.number,
};

export default MapPane;
