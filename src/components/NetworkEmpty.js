import React from "react";
import "./NetworkEmpty.css";

export const NetworkEmpty = () => {
  var modifier = navigator.platform.indexOf("Mac") === 0 ? "⌘" : "Ctrl";
  return (
    <div className="network-empty">
      <div className="content">
        <div>Recording gRPC network activity...</div>
        <div>
          Perform a request or hit <strong>{modifier} R</strong> to record the
          reload
        </div>
      </div>
    </div>
  );
};
