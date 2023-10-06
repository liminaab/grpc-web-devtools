import React from "react";
import { connect, useSelector } from "react-redux";
import Split from "react-split";
import "./MainLayout.css";
import { NetworkDetails } from "./NetworkDetails";
import { NetworkEmpty } from "./NetworkEmpty";
import { NetworkList } from "./NetworkList";

export const MainLayout = () => {
  const isEmpty = useSelector((state) => state.network.logs.length === 0);

  return (
    <div className="vbox flex-auto">
      <div className="shadow-split-widget hbox widget">
        {isEmpty ? (
          <NetworkEmpty />
        ) : (
          <Split
            className="hbox flex-auto"
            sizes={[30, 70]}
            gutterSize={5}
            cursor="ew-resize"
          >
            <NetworkList />
            <NetworkDetails />
          </Split>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isEmpty: state.network.logs.length === 0,
});
export default connect(mapStateToProps)(MainLayout);
