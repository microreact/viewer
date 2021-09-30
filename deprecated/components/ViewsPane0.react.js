import PropTypes from "prop-types";
import ListSubheader from "@material-ui/core/ListSubheader";
import React from "react";
// import ToggleButton from "@material-ui/lab/ToggleButton";
// import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import "../css/views-pane.css";

const imagePlaceholder = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' width='117.92857mm' height='77.560699mm' viewBox='0 0 117.92857 77.560699' version='1.1' id='svg8'%3E%3Cdefs id='defs2' /%3E%3Cmetadata id='metadata5'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1' transform='translate(-40.065475,-119.74287)'%3E%3Crect style='fill:%23e3e3e3;fill-opacity:1;stroke-width:0.221514' id='rect10' width='117.92857' height='25.702374' x='40.065475' y='171.6012' /%3E%3Crect style='fill:%23e3e3e3;fill-opacity:1;stroke-width:0.207676' id='rect10-8' width='55.940487' height='47.624992' x='40.065475' y='119.74287' /%3E%3Crect style='fill:%23e3e3e3;fill-opacity:1;stroke-width:0.207676' id='rect10-8-4' width='55.940491' height='47.624992' x='101.82681' y='119.74287' /%3E%3C/g%3E%3C/svg%3E%0A";

class ViewsPane extends React.PureComponent {

  static displayName = "UiFloatingFilter";

  static propTypes = {
    children: PropTypes.func.isRequired,
    className: PropTypes.string,
    items: PropTypes.array.isRequired,
    label: PropTypes.string,
  };

  state = {
    filter: null,
    isSaving: false,
  }

  // handleSaveCurrentView = () => {
  //   const onViewerAction = this.context;
  //   this.props.onCreateView(onViewerAction);
  // }

  render() {
    const { props } = this;
    const filteredEntries = (
      props.entries
      // .filter((x) => !this.state.filter || x.type === this.state.filter)
    );
    return (
      <div
        className="mr-views-pane"
        data-html2canvas-ignore="true"
      >
        <ListSubheader>Saved Views</ListSubheader>

        {/*
        <ToggleButtonGroup
          value={this.state.filter}
          exclusive
          onChange={(event, filter) => this.setState({ filter })}
          aria-label="Filter views"
          size="small"
        >
          <ToggleButton value="private">
            My views
          </ToggleButton>
          <ToggleButton value="public">
            Shared views
          </ToggleButton>
        </ToggleButtonGroup>
        */}

        <ul>
          {
            filteredEntries.map((item, index) =>
              (<li
                key={item.url || "new"}
                className={item.selected ? "mr-selected" : null}
              >
                <a
                  href={item.url}
                >
                  <img src={item.image ?? imagePlaceholder} />
                  <span>
                    { item.title }
                  </span>
                </a>
              </li>)
            )
          }
        </ul>
      </div>
    );
  }

}

ViewsPane.displayName = "ViewsPane";

ViewsPane.propTypes = {
  entries: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ViewsPane;
