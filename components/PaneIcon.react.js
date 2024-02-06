import AccessTimeTwoToneIcon from "@mui/icons-material/AccessTimeTwoTone";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import NoteTwoToneIcon from "@mui/icons-material/NoteTwoTone";
import PropTypes from "prop-types";
import PublicTwoToneIcon from "@mui/icons-material/PublicTwoTone";
import React from "react";
import ShareTwoToneIcon from "@mui/icons-material/ShareTwoTone";
import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";

import {
  mdiDataMatrix,
  mdiFilter,
  mdiGraphql,
} from "@mdi/js";

import RectangularTreeIcon from "./RectangularTreeIcon.react";
import UiSvgIcon from "./UiSvgIcon.react";
import FilterAltIcon from "./FilterAltIcon.react";

const PaneIcon = React.memo(
  (props) => {
    switch (props.component) {
      case "Chart":
        return (<EqualizerRoundedIcon />);

      case "Slicer":
        return (<FilterAltIcon />);

      case "Filters":
        return (<UiSvgIcon >{ mdiFilter }</UiSvgIcon>);

      case "History":
        return (<UndoRoundedIcon />);

      case "Map":
        return (<PublicTwoToneIcon />);

      case "Network":
        return (<UiSvgIcon >{ mdiGraphql }</UiSvgIcon>);

      case "Note":
        return (<NoteTwoToneIcon />);

      case "Table":
        return (<TableChartTwoToneIcon />);

      case "Timeline":
        return (<AccessTimeTwoToneIcon />);

      case "Tree":
        return (<RectangularTreeIcon />);

      case "Styles":
        return (<VisibilityTwoToneIcon />);

      case "Views":
        return (<ShareTwoToneIcon />);

      case "Matrix":
        return (<UiSvgIcon >{ mdiDataMatrix }</UiSvgIcon>);

      default:
        return (<DescriptionTwoToneIcon />);
    }
  }
);

PaneIcon.displayName = "History";

PaneIcon.propTypes = {
  component: PropTypes.string,
};

export default PaneIcon;
