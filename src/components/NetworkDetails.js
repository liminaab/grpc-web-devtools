import React, { useMemo } from 'react';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import { selectTheme } from '../state/toolbar';
import './NetworkDetails.css';

export const NetworkDetails = () => {
  const entry = useSelector((state) => state.network.selectedEntry);
  const clipboardIsEnabled = useSelector(
    (state) => state.clipboard.clipboardIsEnabled
  );
  const theme = useSelector(selectTheme);

  const src = useMemo(() => {
    if (entry) {
      const { method, request, response, error } = entry;
      const src = { method };
      if (request) {
        src.request = request;
      }
      if (response) {
        src.response = response;
      }
      if (error) {
        src.error = error;
      }
      return src;
    }
  }, [entry]);

  return (
    <div className="widget vbox details-data">
      {src != null && (
        <ReactJson
          name="grpc"
          theme={theme}
          style={{ backgroundColor: 'transparent', flex: 1 }}
          enableClipboard={clipboardIsEnabled}
          src={src}
          displayDataTypes={false}
          indentWidth={2}
        />
      )}
    </div>
  );
};
