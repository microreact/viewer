import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";

import "../css/note-pane.css";
import UiControlsButton from "./UiControlsButton.react";
import * as BrowserUtils from "../utils/browser";

class NotePane extends React.PureComponent {

  static displayName = "NotePane"

  static propTypes = {
    source: PropTypes.string,
    onSourceChange: PropTypes.func.isRequired,
  }

  state = {
    isEditing: !this.props.source,
    markdown: "",
  }

  handleLinkClick = (event) => {
    event.preventDefault();
    BrowserUtils.changeLocation(event.target.href);
    const query = BrowserUtils.parseQueryString(event.target.href);
    this.props.onQueryChange(query);
  }

  renderers = {
    link: (args) => {
      if (args.href?.startsWith("?")) {
        const url = BrowserUtils.pageUrl();
        url.search = args.href;
        return (
          <a
            {...args}
            href={url.href}
            onClick={this.handleLinkClick}
          />
        );
      }
      return (
        <a {...args} />
      );
    },
  }

  componentDidMount() {
    if (this.state.isEditing) {
      this.textareaRef.current.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isEditing !== this.state.isEditing && this.state.isEditing) {
      this.textareaRef.current.focus();
    }
  }

  textareaRef = React.createRef();

  save = () => {
    this.props.onSourceChange(this.state.markdown);
    this.setState({
      isEditing: false,
    });
  }

  render() {
    if (this.state.isEditing) {
      return (
        <div className="mr-note-pane">
          <textarea
            ref={this.textareaRef}
            value={this.state.markdown}
            onChange={({ target }) => this.setState({ markdown: target.value })}
          />
          <div className="mr-main-controls">
            <UiControlsButton
              aria-label="Preview changes"
              color="inherit"
              size="small"
              onClick={this.save}
              title="Preview changes"
            >
              <DoneOutlineRoundedIcon />
            </UiControlsButton>
          </div>
        </div>
      );
    }

    return (
      <div className="mr-note-pane">
        <ReactMarkdown
          renderers={this.renderers}
          source={this.props.source || ""}
        />
        <div className="mr-main-controls">
          <UiControlsButton
            aria-label="Edit note"
            title="Edit note"
            color="inherit"
            size="small"
            onClick={() => this.setState({ markdown: this.props.source, isEditing: true })}
          >
            <EditRoundedIcon />
          </UiControlsButton>
        </div>
      </div>
    );
  }

}

NotePane.displayName = "NotePane";

NotePane.propTypes = {
  source: PropTypes.string,
  onQueryChange: PropTypes.func.isRequired,
  onSourceChange: PropTypes.func.isRequired,
};

export default NotePane;
