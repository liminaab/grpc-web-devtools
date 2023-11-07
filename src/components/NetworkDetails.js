import React, { useMemo } from 'react';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import './NetworkDetails.css';

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3,
});
const formatTimestamp = (timestamp) =>
  timeFormatter.format(new Date(timestamp));

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
    ? 'monokai'
    : 'rjv-default';

  return (
    <div className="widget vbox details-data">
      {src != null && (
        <>
          <div className="timestamp">{formatTimestamp(entry.timestamp)}</div>
          <ReactJson
            name="grpc"
            theme={theme}
            style={{ backgroundColor: 'transparent', flex: 1 }}
            enableClipboard={clipboardIsEnabled}
            src={src}
            displayDataTypes={false}
            indentWidth={2}
          />
        </>
      )}
    </div>
  );
};
