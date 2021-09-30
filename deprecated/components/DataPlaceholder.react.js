import PropTypes from "prop-types";
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import Viewer from "../containers/Viewer.react";
import FileLoader from "../containers/FileLoader.react";
import DropFiles from "../containers/DropFiles.react";
import { emptyObject } from "../constants";

// class DataPlaceholder extends React.Component {
//   render () {
//     const { props } = this;
//     if (props.datasets) {
//       for (const datasetId of Object.keys(props.datasets)) {
//         const dataset = props.datasets[datasetId];
//         if (dataset.file && !dataset.file._content) {
//           return (
//             <FilePlaceholder
//               file={dataset.file}
//               onFileChange={(file) => {}}
//             />
//           );
//         }
//       }
//     }

//     if (props.isEmpty) {
//       return (
//         <DropFiles />
//       );
//     }

//     return (
//       <Viewer />
//     );

//   }
// }

const DataPlaceholder = React.memo(
  (props) => {
    const datasetIds = Object.keys(props.datasets || emptyObject);
    if (datasetIds.length) {
      for (const datasetId of datasetIds) {
        const dataset = props.datasets[datasetId];
        const datasetFileDescriptor = props.files[dataset.file];
        if (!datasetFileDescriptor._content) {
          return (
            <div
              className="microreact-viewer"
              id="microreact-viewer"
            >
              <FileLoader file={datasetFileDescriptor} />
            </div>
          );
        }
      }
    }

    return (
      <div
        className="microreact-viewer"
        id="microreact-viewer"
      >
        {
          (props.isEmpty)
            ?
            (<DropFiles />)
            :
            (
              <Viewer components={props.components}>
                { props.children }
              </Viewer>
            )
        }
        {
          (props.isLoading) && (
            <div className="mr-process-files-spinner">
              <CircularProgress
                size={430}
                thickness={1}
              />
            </div>
          )
        }
      </div>
    );
  }
);

DataPlaceholder.displayName = "DataPlaceholder";

DataPlaceholder.propTypes = {
  children: PropTypes.node,
  components: PropTypes.object,
  datasets: PropTypes.object,
  files: PropTypes.object,
  isEmpty: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default DataPlaceholder;
