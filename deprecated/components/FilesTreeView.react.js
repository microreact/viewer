import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import GridOnIcon from "@material-ui/icons/GridOn";
import ErrorIcon from '@material-ui/icons/Error';
import InsertDriveFileTwoToneIcon from "@material-ui/icons/InsertDriveFileTwoTone";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';


import RectangularTreeIcon from "./RectangularTreeIcon.react";
import NetworkIcon from "./NetworkIcon.react";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)",
    },
  },
  content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    "& $content": {
      paddingLeft: theme.spacing(2),
    },
  },
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
    "max-width": "100%",
    overflow: "hidden",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    "padding-right": "16px",
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { hidden, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText} title={labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
        display: hidden ? "none" : "",
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  hidden: PropTypes.bool,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.node,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function FilesTreeView(props) {
  const classes = useStyles();

  const groups = {
    data: [],
    tree: [],
    network: [],
    unknown: [],
    error: [],
  };
  for (const file of props.files) {
    if (file.success === false) {
      groups.error.push(file);
    }
    else {
      groups[file.type].push(file);
    }
  }

  return (
    <TreeView
      className={classes.root}
      defaultExpanded={[
        "1-data-files",
        "2-tree-files",
        "3-network-files",
        "4-unknown-files",
        "5-errors-files",
      ]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      onNodeToggle={(event, nodeIds) => {
        // console.debug(event, nodeIds)
      }}
    >
      <StyledTreeItem
        nodeId="1-data-files"
        labelText="Data Files"
        labelIcon={GridOnIcon}
        labelInfo={groups.data.length}
      >
        {
          groups.data
            .map(
              (item) => (
                <StyledTreeItem
                  key={item.id}
                  nodeId={item.id}
                  labelText={item.label}
                  labelIcon={item.isReady ? CheckCircleOutlinedIcon : ReportProblemOutlinedIcon}
                  // labelInfo={item.format}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              )
            )
        }
      </StyledTreeItem>
      <StyledTreeItem
        nodeId="2-tree-files"
        labelText="Tree Files"
        labelIcon={RectangularTreeIcon}
        labelInfo={groups.tree.length}
      >
        {
          groups.tree
            .map(
              (item) => (
                <StyledTreeItem
                  key={item.id}
                  nodeId={item.id}
                  labelText={item.label}
                  labelIcon={item.isReady ? CheckCircleOutlinedIcon : ReportProblemOutlinedIcon}
                  // labelInfo={item.format}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              )
            )
        }
      </StyledTreeItem>
      <StyledTreeItem
        nodeId="3-network-files"
        labelText="Network Files"
        labelIcon={NetworkIcon}
        labelInfo={groups.network.length}
      >
        {
          groups.network
            .map(
              (item) => (
                <StyledTreeItem
                  key={item.id}
                  nodeId={item.id}
                  labelText={item.label}
                  labelIcon={InsertDriveFileTwoToneIcon}
                  // labelInfo={item.format}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              )
            )
        }
      </StyledTreeItem>

      <StyledTreeItem
        nodeId="4-unknown-files"
        labelText="Unknown Files"
        labelIcon={WarningIcon}
        labelInfo={groups.unknown.length}
        hidden={groups.unknown.length === 0}
      >
        {
          groups.unknown
            .map(
              (item) => (
                <StyledTreeItem
                  key={item.id}
                  nodeId={item.id}
                  labelText={item.label}
                  labelIcon={item.isReady ? CheckCircleOutlinedIcon : ReportProblemOutlinedIcon}
                  // labelInfo={item.format}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              )
            )
        }
      </StyledTreeItem>

      <StyledTreeItem
        nodeId="5-errors-files"
        labelText="Errors"
        labelIcon={ErrorIcon}
        labelInfo={groups.error.length}
        hidden={groups.error.length === 0}
      >
        {
          groups.error
            .map(
              (item) => (
                <StyledTreeItem
                  key={item.id}
                  nodeId={item.id}
                  labelText={item.label}
                  title={item.error.message}
                  labelIcon={ErrorOutlineIcon}
                  // labelInfo={item.format}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                />
              )
            )
        }
      </StyledTreeItem>

    </TreeView>
  );
}

FilesTreeView.propTypes = {
  files: PropTypes.array,
};

export default React.memo(FilesTreeView);
