import { connectToPresentStateWithRef } from "../utils/state";

import Component from "../components/DownloadFilesMenuContent.react";
import configSelector from "../selectors/config";
import selectedIdsListSelector from "../selectors/filters/selected-ids-list";
import filteredIdsSelector from "../selectors/filters/filtered-ids";

function mapStateToProps(state) {
  return {
    files: state.files,
    actions: configSelector(state)?.actions,
    selectedIds: selectedIdsListSelector(state),
    filteredIdsSet: filteredIdsSelector(state),
  };
}

export default connectToPresentStateWithRef(Component, mapStateToProps);
