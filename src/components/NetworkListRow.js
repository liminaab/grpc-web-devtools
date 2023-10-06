import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectLogEntry } from '../state/network';
import { MethodIcon } from './MethodIcon';

// log: {"type":"__GRPCWEB_DEVTOOLS__","method":"FULL URL","methodType":"server_streaming","request": object,"endpoint":"END OF URL AFTER LAST /"}

export const NetworkListRow = memo(({ log, style, index }) => {
  const selectedEntry = useSelector((state) => state.network.selectedEntry);
  const dispatch = useDispatch();

  let endpoint = log.endpoint;
  if (log.method?.endsWith(`Service/${log.endpoint}`)) {
    const nextEndpoint = log.method.substring(log.method.lastIndexOf('.') + 1);
    endpoint = nextEndpoint.split('/').map((ep, i, arr) => {
      const isLastItem = i === arr.length - 1;
      const className = isLastItem ? '' : 'service-path';
      return (
        <span key={ep} className={className}>{`${ep}${
          isLastItem ? '' : '/'
        }`}</span>
      );
    });
  }

  return (
    <div
      className={`data-row ${(index + 1) % 2 === 0 ? '' : 'odd'} ${
        log === selectedEntry ? 'selected' : ''
      } ${log.error ? 'error' : ''} `}
      style={style}
      onClick={() => dispatch(selectLogEntry(log))}
    >
      <MethodIcon methodType={log.methodType} isRequest={!!log.request} />
      {endpoint}
    </div>
  );
});
