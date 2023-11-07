import React from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { NetworkListRow } from './NetworkListRow';
import { selectFilteredLogs } from '../state/network';

import './NetworkList.css';

export const NetworkList = () => {
  const log = useSelector(selectFilteredLogs);

  return (
    <div className="widget vbox network-list">
      <div className="widget vbox">
        <div className="data-grid">
          <div className="header-container">
            <table className="header">
              <tbody>
                <tr>
                  <th>
                    <div>Name</div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="data-container">
            <AutoSizer disableWidth>
              {({ height }) => {
                return (
                  <List
                    className="data"
                    itemCount={log.length}
                    height={height}
                    itemSize={21}
                    itemData={log}
                    overscanCount={50}
                  >
                    {({ index, data, style }) => {
                      return (
                        <NetworkListRow
                          log={data[index]}
                          style={style}
                          index={index}
                        />
                      );
                    }}
                  </List>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
};
