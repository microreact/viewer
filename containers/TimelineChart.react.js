import DeckGL from '@deck.gl/react';
import { OrthographicView } from 'deck.gl';

import { connectToPresentState } from "../utils/state";

import charLayersSelector from "../selectors/timelines/chart-layers";

const mapStateToProps = (state, { timelineId }) => {
  const layers = charLayersSelector(state, timelineId);
  return {
    views: new OrthographicView({
      flipY: true,
      // near: 0.1,
      // far: 1000,
    }),
    initialViewState: {
      target: [0, 0, 0],
      zoom: 0,
    },
    layers,
    controller: true,
  };
};

const mapDispatchToProps = null;

export default connectToPresentState(DeckGL, mapStateToProps, mapDispatchToProps);
