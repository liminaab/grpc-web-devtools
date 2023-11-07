import React, { useMemo } from 'react';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import './NetworkDetails.css';

export const NetworkDetails = () => {
  const entry = useSelector((state) => state.network.selectedEntry);
  const clipboardIsEnabled = useSelector(
    (state) => state.clipboard.clipboardIsEnabled
  );

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

  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'twilight'
    : 'rjv-default';

  return (
    <div className="widget vbox details-data">
      {entry != null && (
        <ReactJson
          name="grpc"
          theme={theme}
          style={{ backgroundColor: 'transparent' }}
          enableClipboard={clipboardIsEnabled}
          src={src}
        />
      )}
    </div>
  );
};
