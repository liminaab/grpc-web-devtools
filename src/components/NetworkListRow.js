import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogEntry } from '../state/network';
import { MethodIcon } from './MethodIcon';
import { formatTimestamp } from './date.utils';

// log: {"type":"__GRPCWEB_DEVTOOLS__","method":"FULL URL","methodType":"server_streaming","request": object,"endpoint":"END OF URL AFTER LAST /"}

export const NetworkListRow = memo(({ log, style, index }) => {
  const selectedEntry = useSelector((state) => state.network.selectedEntry);
  const dispatch = useDispatch();

  return (
    <div
      className={`data-row ${index % 2 === 0 ? 'even' : ''} ${
        log === selectedEntry ? 'selected' : ''
      } ${log.error ? 'error' : ''} `}
      style={style}
      onClick={() => dispatch(selectLogEntry(log))}
      tabIndex={index}
    >
      <div className="data-row-item">
        <span className="method">
          <MethodIcon methodType={log.methodType} isRequest={!!log.request} />
          <Endpoint endpoint={log.endpoint} method={log.method} />
        </span>
        <span className="timestamp">{formatTimestamp(log.timestamp)}</span>
      </div>
    </div>
  );
});

const Endpoint = ({ endpoint, method }) => {
  if (method?.endsWith(`Service/${endpoint}`)) {
    const nextEndpoint = method.substring(method.lastIndexOf('.') + 1);
    return nextEndpoint.split('/').map((ep, i, arr) => {
      const isLastItem = i === arr.length - 1;
      const className = isLastItem ? '' : 'service-path';
      return (
        <span key={ep} className={className}>{`${ep}${
          isLastItem ? '' : '/'
        }`}</span>
      );
    });
  }
  return endpoint;
};
