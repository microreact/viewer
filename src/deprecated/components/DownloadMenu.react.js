import "../css/header.css";

import React from "react";
import PropTypes from "prop-types";

import HeaderMenu from "./HeaderMenu.react";

const DownloadLink = (
  (args) => {
    return (
      <form action={args.href} method={args.method || 'POST'} target="_blank">
        <button className={args.className}>{args.children}</button>
        <input type="hidden" name={args.fieldName || 'ids'} value={args.ids} />
      </form>
    );
  }
);

class DownloadMenu extends React.PureComponent {

  static displayName = "DownloadMenu"

  static propTypes = {
    activeIds: PropTypes.instanceOf(Set).isRequired,
    files: PropTypes.array,
    hasNetwork: PropTypes.bool.isRequired,
    hasTree: PropTypes.bool.isRequired,
    highlightedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    rowIds: PropTypes.instanceOf(Set).isRequired,
  }

  getDownloadUrl(type, ids) {
    let query = "";
    if (ids) {
      query = `&ids=${encodeURIComponent(encodeURIComponent(ids.join(" ")))}`;
    }
    return `/api/viewer/${type}?project=${this.props.id}${query}`;
  }

  render() {
    const { rowIds, activeIds, highlightedIds, hasTree, hasNetwork } = this.props;
    const hasGenesFile = this.props.files.includes("genes");
    return (
      <HeaderMenu
        icon="file_download"
        title="Download project files"
      >
        <a
          href={this.getDownloadUrl("data")}
          target="_blank"
        >
          Download Data File
        </a>
        {
          activeIds.size !== rowIds.size &&
          <DownloadLink
            href={this.getDownloadUrl('data')}
            ids={Array.from(activeIds)}
          >
            Download Data ({activeIds.size} filtered {activeIds.size === 1 ? 'row' : 'rows'})
          </DownloadLink>
        }
        {
          highlightedIds.length !== 0 &&
          <DownloadLink
            href={this.getDownloadUrl('data')}
            ids={highlightedIds}
          >
            Download Data ({highlightedIds.length} highlighted {highlightedIds.length === 1 ? 'row' : 'rows'})
          </DownloadLink>
        }
        {
          hasGenesFile &&
          <a
            href={this.getDownloadUrl("genes")}
            target="_blank"
          >
            Download Genes File
          </a>
        }
        {
          hasGenesFile && activeIds.size !== rowIds.size &&
          <DownloadLink
            href={this.getDownloadUrl('genes')}
            ids={Array.from(activeIds)}
          >
            Download Genes ({activeIds.size} filtered {activeIds.size === 1 ? 'row' : 'rows'})
          </DownloadLink>
        }
        {
          hasGenesFile && highlightedIds.length !== 0 &&
          <DownloadLink
            href={this.getDownloadUrl('genes')}
            ids={highlightedIds}
          >
            Download Genes ({highlightedIds.length} highlighted {highlightedIds.length === 1 ? 'row' : 'rows'})
          </DownloadLink>
        }
        {
          hasTree &&
          <a
            href={this.getDownloadUrl("tree")}
            target="_blank"
          >
            Download Tree File
          </a>
        }
        {
          hasNetwork &&
          <a
            href={this.getDownloadUrl("network")}
            target="_blank"
          >
            Download Network File
          </a>
        }
        {
          (activeIds.size !== rowIds.size || highlightedIds.length !== 0) && (
            <hr />
          )
        }
        {
          Array.isArray(this.props.downloads) && this.props.downloads.map(
            (item) => (
              <React.Fragment>
                {
                  activeIds.size !== rowIds.size &&
                  <DownloadLink
                    href={item.url}
                    ids={Array.from(activeIds)}
                    method={item.method}
                    fieldName={item.fieldName}
                  >
                    { item.label } ({activeIds.size} filtered {activeIds.size === 1 ? 'row' : 'rows'})
                  </DownloadLink>
                }
                {
                  highlightedIds.length !== 0 &&
                  <DownloadLink
                    href={item.url}
                    ids={highlightedIds}
                    method={item.method}
                    fieldName={item.fieldName}
                  >
                    { item.label } ({highlightedIds.length} highlighted {highlightedIds.length === 1 ? 'row' : 'rows'})
                  </DownloadLink>
                }
              </React.Fragment>
            )
          )
        }
      </HeaderMenu>
    );
  }

}

export default DownloadMenu;
