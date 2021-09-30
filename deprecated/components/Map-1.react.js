/* eslint camelcase: 0 */

import "../css/map.css";

import React from "react";
import "leaflet-lassoselect";
import "../plugins/leaflet/canvas-marker-layer";
import classnames from "classnames";
import PropTypes from "prop-types";
import L from "leaflet";

import ZoomControls from "./ZoomControls.react";
import MapSummary from "./MapSummary.react";
import MapControls from "../containers/MapControls.react";
import Tour from "../containers/Tour.react";

import { HIGHLIGHT_COLOUR } from "../defaults";
import { addExportCallback, removeExportCallback, exportHtmlElement } from "../utils/downloads";
import { MapPosition, Column } from "../utils/prop-types";

const MB_URL = "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2dwc2RldiIsImEiOiJjaW96aXdzdDEwMGV0dm1tMnhqOWIzNXViIn0.2lJftMpp7LBJ_FeumUE4qw";
const MB_ATTR = `Map data &copy;
  <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
	<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
  Imagery © <a href="http://mapbox.com">Mapbox</a>`;

const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
};
const unescapedHtml = /[&<>"']/g;


export default class extends React.Component {

  static displayName = "Map"

  static propTypes = {
    bounds: PropTypes.array,
    centre: PropTypes.array,
    colourFilter: Column,
    controls: PropTypes.bool.isRequired,
    height: PropTypes.number.isRequired,
    highlightedIds: PropTypes.instanceOf(Set).isRequired,
    labelFilter: Column,
    lasso: PropTypes.bool.isRequired,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        position: MapPosition.isRequired,
        rows: PropTypes.array.isRequired,
        style: PropTypes.shape({
          colour: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          shape: PropTypes.string.isRequired,
        }),
        slices: PropTypes.object,
      })
    ).isRequired,
    nodeSize: PropTypes.number.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onStyleChange: PropTypes.func.isRequired,
    onViewPortChange: PropTypes.func.isRequired,
    path: PropTypes.arrayOf(MapPosition.isRequired),
    rowStyles: PropTypes.object.isRequired,
    scaleMarkers: PropTypes.bool.isRequired,
    setHighlightedIds: PropTypes.func.isRequired,
    shapeFilter: Column,
    showMarkers: PropTypes.bool,
    source: PropTypes.string,
    style: PropTypes.string,
    tileLayerOpts: PropTypes.string,
    tileLayerUrl: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.number.isRequired,
    zoom: PropTypes.number,
  }

  state = {
    infoMarkerPosition: null,
  }

  componentDidMount() {
    this.createLeafletMap();
    this.createLassoSelect();
    this.createMarkerLayers();

    this.drawMarkers();

    if (!this.props.bounds && !this.props.centre && !this.props.zoom) {
      this.refitMapBounds();
    }

    // event listener is attached after the map is created to aviod getting a callback on first load
    this.map.on("moveend", () => {
      const centre = this.map.getCenter();
      const zoom = this.map.getZoom();
      this.props.onViewPortChange([ centre.lat, centre.lng ], zoom);
    });

    addExportCallback("map-png", () => exportHtmlElement(this.leafletMapRef.current));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) {
      this.map.invalidateSize(true);
    }

    if (this.props.style !== prevProps.style ||
        this.props.tileLayerUrl !== prevProps.tileLayerUrl ||
        this.props.tileLayerOpts !== prevProps.tileLayerOpts
    ) {
      this.changeMapStyle(this.props.style);
    }

    if (
      this.props.markers !== prevProps.markers ||
      this.props.highlightedIds !== prevProps.highlightedIds ||
      this.props.rowStyles !== prevProps.rowStyles ||
      this.props.nodeSize !== prevProps.nodeSize ||
      this.props.scaleMarkers !== prevProps.scaleMarkers
    ) {
      this.drawMarkers();
    }

    if (this.props.showMarkers !== prevProps.showMarkers) {
      if (this.props.showMarkers) {
        this.markerLayer._canvas.classList.remove("is-hidden");
      } else {
        this.markerLayer._canvas.classList.add("is-hidden");
      }
    }

    // clear the lasso filter when lasso flag has changed
    if (prevProps.lasso !== this.props.lasso) {
      if (this.props.lasso) {
        this.lasso.enable();
      } else {
        this.lasso.disable();
      }
    }

    if (prevProps.path !== this.props.path) {
      if (this.props.path === null) {
        this.lasso.reset();
      } else if (!this.lasso.polyline || this.props.path !== this.lasso.polyline.getLatLngs()) {
        this.lasso.reset();
        this.lasso.setPath(this.props.path);
      }
    }
  }

  componentWillUnmount() {
    // const centre = this.map.getCenter();
    // const zoom = this.map.getZoom();
    // this.props.onViewPortChange([ centre.lat, centre.lng ], zoom);
    removeExportCallback("map-png");
    this.destroyLeafletMap();
  }

  leafletMapRef = React.createRef()

  createLeafletMap() {
    const { mapId, type = "mapbox", style } = this.props;
    const zoom = this.props.zoom || 0;
    const centre = this.props.centre || [ 0, 0 ];

    if (type === "mapbox") {
      this.map = L.map(
        this.leafletMapRef.current,
        {
          zoomControl: false,
        }
      );
      this.map.setView(centre, zoom);

      this.changeMapStyle(style);
      if (this.props.bounds) {
        this.map.fitBounds(this.props.bounds);
      }
    } else if (type === "imageoverlay") {
      const { source, bounds } = this.props;
      this.map = L.map("leaflet-map", {
        crs: L.CRS.Simple,
        minZoom: -1 * Math.ceil(Math.max(...bounds[1]) / 256),
        zoomControl: false,
      });
      this.map.fitBounds(bounds);
      L.imageOverlay(source, bounds).addTo(this.map);
    }

    this.infoTooltip = L.popup({ closeButton: false });

    window.cgps_microreact_map = this.map;
  }

  destroyLeafletMap() {
    this.map.remove();
  }

  createMarkerLayers() {
    this.markerLayer = L.canvasIconLayer({
      className: classnames("mr-map-canvas", { "is-hidden": !this.props.showMarkers }),
      onClick: this.handleMarkerClick,
      onHover: this.handleMarkerHover,
    });
    this.markerLayer.addTo(this.map);
  }

  drawMarkers() {
    this.markerLayer.setOptions({
      markerData: this.props.markers,
      rowStyles: this.props.rowStyles,
      highlightedIds: this.props.highlightedIds,
      nodeRadius: this.props.nodeSize / 2,
      fixedSize: !this.props.scaleMarkers,
    });
  }

  handleMarkerClick = (event, marker) => {
    if (event.stopPropagation) return;
    const append = event.originalEvent.metaKey || event.originalEvent.ctrlKey;
    if (marker) {
      this.props.setHighlightedIds(
        marker.rows.map((row) => row[0]),
        append
      );
      this.setState({ infoMarkerPosition: marker.position });
    } else {
      this.setState({ infoMarkerPosition: null });
      if (this.props.highlightedIds.size && !append) {
        this.props.setHighlightedIds();
      }
    }
  }

  handleMarkerHover = (event, marker) => {
    if (marker) {
      const firstRow = marker.rows[0];
      const labels = [ marker.position.join(", ") ];
      if (marker.rows.length === 1) {
        if (this.props.labelFilter) {
          labels.push(`${this.props.labelFilter.label}: ${firstRow[this.props.labelFilter.index]}`);
        }
        if (this.props.colourFilter && this.props.colourFilter !== this.props.labelFilter) {
          labels.push(`${this.props.colourFilter.label}: ${firstRow[this.props.colourFilter.index]}`);
        }
        if (this.props.shapeFilter && this.props.shapeFilter !== this.props.labelFilter && this.props.shapeFilter !== this.props.colourFilter) {
          labels.push(`${this.props.shapeFilter.label}: ${firstRow[this.props.shapeFilter.index]}`);
        }
      } else {
        labels.push(`${marker.rows.length} items.`);
        labels.push("Click to expand");
      }
      this.infoTooltip
        .setLatLng(marker.position)
        .setContent(labels.join("<br />"))
        .openOn(this.map);
    } else {
      L.DomUtil.removeClass(this.markerLayer._canvas, "is-hover");
      this.map.closePopup();
    }
  }

  createLassoSelect() {
    this.lasso = L.lassoSelect({
      finishedTooltip: "Click outside the region to cancel the filter.",
      polyline: {
        color: HIGHLIGHT_COLOUR,
      },
    }).addTo(this.map);

    if (this.props.lasso) {
      this.lasso.enable();
      if (this.props.path) {
        this.lasso.setPath(this.props.path);
      }
    }

    this.lasso.on("pathchange", () => {
      this.props.onFilterChange(this.lasso.getPath());
    });

    this.lasso.on("click", (event) => {
      if (!this.lasso.contains(event.latlng) && this.props.highlightedIds.size === 0) {
        event.stopPropagation = true;
        this.props.onFilterChange();
      }
    });
  }

  refitMapBounds(point) {
    const { type = "mapbox", bounds } = this.props;
    if (point) {
      if (point.getLatLng) {
        this.map.panTo(point.getLatLng());
      } else if (Array.isArray(point)) {
        this.map.panTo(point);
      }
    } else if (this.props.markers.length !== 0) {
      if (type === "mapbox") {
        this.map.fitBounds(this.props.markers.map((marker) => marker.position));
      } else if (type === "imageoverlay") {
        this.map.fitBounds(bounds);
      }
    }
  }

  changeMapStyle(style) {
    const { tileLayerUrl, tileLayerOpts } = this.props;
    const url = (style === "custom" && tileLayerUrl) ? tileLayerUrl : MB_URL;

    let opts = { attribution: MB_ATTR, id: `${style}-v9` };
    if (style === "custom") {
      opts = Object.assign({}, tileLayerOpts || {});
      if (opts.attribution) {
        opts.attribution = opts.attribution.replace(unescapedHtml, (chr) => htmlEscapes[chr]);
      }
    }
    try {
      const layer = L.tileLayer(url, opts).addTo(this.map);
      if (this.layer) {
        this.map.removeLayer(this.layer);
      }
      this.layer = layer;
      // this.props.closeTileLayerDialog();
    } catch (err) {
      this.props.setTileLayerError(err.message);
    }
  }

  renderInfoWindow = () => {
    if (this.state.infoMarkerPosition !== null) {
      const infoMarker = this.props.markers.find((x) => x.position === this.state.infoMarkerPosition);
      if (infoMarker && infoMarker.rows.length > 1) {
        return (
          <MapSummary
            rows={infoMarker.rows}
            onClose={() => this.setState({ infoMarkerPosition: null })}
            labelFilter={this.props.labelFilter}
            highlightedIds={this.props.highlightedIds}
            setHighlightedIds={this.props.setHighlightedIds}
            rowStyles={this.props.rowStyles}
          />
        );
      }
    }

    return null;
  }

  render() {
    const { width, height, mapId } = this.props;
    return (
      <div
        className="mr-map"
        style={{ width, height }}
      >
        <Tour
          id="map"
          pointer="top"
          style={{ top: "48px", left: "50%" }}
        />
        <div
          className="mr-leaflet"
          // id={`leaflet-${mapId}`}
          ref={this.leafletMapRef}
          style={{ width, height }}
        />
        <MapControls mapId={this.props.mapId} />
        <ZoomControls
          className={classnames({ visible: this.props.controls })}
          onZoomIn={() => this.map.zoomIn()}
          onZoomOut={() => this.map.zoomOut()}
        />
        { this.renderInfoWindow() }
      </div>
    );
  }

}
