import AccessTimeTwoToneIcon from "@material-ui/icons/AccessTimeTwoTone";
import EqualizerRoundedIcon from "@material-ui/icons/EqualizerRounded";
import NoteTwoToneIcon from "@material-ui/icons/NoteTwoTone";
import PropTypes from "prop-types";
import PublicTwoToneIcon from "@material-ui/icons/PublicTwoTone";
import React from "react";
import ShareTwoToneIcon from "@material-ui/icons/ShareTwoTone";
import TableChartTwoToneIcon from "@material-ui/icons/TableChartTwoTone";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import DescriptionTwoToneIcon from "@material-ui/icons/DescriptionTwoTone";
import UndoRoundedIcon from "@material-ui/icons/UndoRounded";

import {
  mdiGraphql,
  mdiFilter,
} from "@mdi/js";

import RectangularTreeIcon from "./RectangularTreeIcon.react";
import MdiIcon from "./MdiIcon.react";
import FilterAltIcon from "./FilterAltIcon.react";

const PaneIcon = React.memo(
  (props) => {
    switch (props.component) {
      case "Chart":
        return (<EqualizerRoundedIcon />);

      case "Slicer":
        return (<FilterAltIcon />);

      case "Filters":
        return (<MdiIcon >{ mdiFilter }</MdiIcon>);

      case "History":
        return (<UndoRoundedIcon />);

      case "Map":
        return (<PublicTwoToneIcon />);

      case "Network":
        return (<MdiIcon >{ mdiGraphql }</MdiIcon>);

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
