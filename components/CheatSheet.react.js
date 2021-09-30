import "../css/cheat-sheet.css";

import React from "react";
import PropTypes from "prop-types";

import { LassoIcon, RcTreeIcon, CrTreeIcon, RdTreeIcon, DgTreeIcon, HrTreeIcon } from
  "../icons";
import CtrlKey from "./CtrlKey.react";
import AltlKey from "./AltlKey.react";

const Icon = (props) => (
  <i className="material-icons">
    { props.children }
  </i>
);

Icon.propTypes = {
  children: PropTypes.node.isRequired,
};

const Shortcut = (props) => (
  <div>
    <dt className="mr-cheat-sheet-shortcut">
      {
        props.icon && <Icon>{ props.icon }</Icon>
      }
      {
        props.keys && props.keys.reduce(
          (prev, item, index) => {
            if (index > 0) prev.push("+");
            prev.push(item);
            return prev;
          },
          []
        )
      }
    </dt>
    <dd>{ props.desc }</dd>
  </div>
);

Shortcut.propTypes = {
  icon: PropTypes.node,
  keys: PropTypes.array,
  desc: PropTypes.node.isRequired,
};

const ScrollDown = (
  <div className="mouse-holder" title="Mouse scroll">
    <div className="mouse">
      <div className="scroll" />
    </div>
  </div>
);

const CheatSheet = (props) => {
  if (props.isVisible === false) {
    return null;
  }

  return (
    <div className="mr-cheat-sheet-overlay">
      <div className="mr-cheat-sheet-obfuscator" onClick={props.onHideHelp} />
      <div className="mr-cheat-sheet">
        <button
          className="mr-close-overlay mdl-button mdl-button--icon"
          title="Close Cheat Sheet"
          onClick={props.onHideHelp}
        >
          <i className="material-icons">close</i>
        </button>
        <h2>Cheat Sheet</h2>
        <div className="mr-cheat-sheet-content">
          <section className="mr-cheat-sheet-tree">
            <h3>Tree</h3>
            <dl>
              <Shortcut icon="tune" desc="Show/hide tree controls" />
              <Shortcut icon={<LassoIcon />} desc="Enable/disable lasso filter" />
              <Shortcut icon={<RcTreeIcon />} desc="Set tree type to Rectangular" />
              <Shortcut icon={<CrTreeIcon />} desc="Set tree type to Circular" />
              <Shortcut icon={<RdTreeIcon />} desc="Set tree type to Radial" />
              <Shortcut icon={<DgTreeIcon />} desc="Set tree type to Diagonal" />
              <Shortcut icon={<HrTreeIcon />} desc="Set tree type to Hierarchical" />
              <Shortcut
                keys={[ CtrlKey, ScrollDown ]}
                desc="Scale tree branch lengths"
              />
              <Shortcut
                keys={[ AltlKey, ScrollDown ]}
                desc={
                  <span>
                    Change space between branches.
                    <br />
                    Not available for circular or radial tree types.
                  </span>
                }
              />
            </dl>
          </section>
          <section>
            <h3>Timeline</h3>
            <dl>
              <Shortcut icon="tune" desc="Show/hide timeline controls" />
              <Shortcut icon="zoom_out_map" desc="Reset timeline zoom" />
              <Shortcut
                icon="play_arrow"
                desc="Play timeline"
              />
              <Shortcut
                keys={[ CtrlKey, <Icon>play_arrow</Icon> ]}
                desc="Play as a moving window"
              />
              <Shortcut
                keys={[ CtrlKey, ScrollDown ]}
                desc="Zoom timeline horizontally"
              />
              <Shortcut
                keys={[ AltlKey, ScrollDown ]}
                desc="Zoom timeline vertically."
              />
            </dl>
          </section>
          <section>
            <h3>Network</h3>
            <dl>
              <Shortcut icon="tune" desc="Show/hide network controls" />
              <Shortcut icon={<LassoIcon />} desc="Enable/disable lasso filter" />
              <Shortcut icon="zoom_out_map" desc="Reset network zoom" />
              <Shortcut icon="shuffle" desc="Shuffle network nodes" />
            </dl>
          </section>
          <section>
            <h3>Map</h3>
            <dl>
              <Shortcut icon="tune" desc="Show/hide map controls" />
              <Shortcut icon={<LassoIcon />} desc="Enable/disable lasso filter" />
            </dl>
          </section>
          <section>
            <h3>Side panel</h3>
            <dl>
              <Shortcut icon="remove_red_eye" desc="Labels, Colours, Shapes & Show/hide Legend" />
              <Shortcut icon="history" desc="Project History" />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

CheatSheet.displayName = "CheatSheet";

CheatSheet.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHideHelp: PropTypes.func.isRequired,
};

export default CheatSheet;
