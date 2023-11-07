import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPreserveLog,
  clearLog,
  toggleStopResumeLogs,
} from '../state/network';
import {
  toggleFilter,
  setMethodFilter,
  setContentFilter,
  setExcludeContentFilter,
} from '../state/toolbar';
import { toggleClipboard } from '../state/clipboard';
import ClearIcon from '../icons/Clear';
import StopIcon from '../icons/Stop';
import PlayIcon from '../icons/Play';
import FilterIcon from '../icons/Filter';
import './Toolbar.css';

export const Toolbar = () => {
  const dispatch = useDispatch();

  const preserveLog = useSelector((state) => state.network.preserveLog);
  const { filterIsOpen, filterValue, filterIsEnabled } = useSelector(
    (state) => state.toolbar
  );
  const clipboardIsEnabled = useSelector(
    (state) => state.clipboard.clipboardIsEnabled
  );
  const stopIsEnabled = useSelector((state) => state.network.stopLog);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-shadow">
          <ToolbarButton
            title="Clear"
            onClick={() => dispatch(clearLog({ force: true }))}
          >
            <ClearIcon />
          </ToolbarButton>
          <ToolbarButton
            title={stopIsEnabled ? 'Resume' : 'Stop'}
            onClick={() => dispatch(toggleStopResumeLogs())}
          >
            {stopIsEnabled ? <PlayIcon /> : <StopIcon />}
          </ToolbarButton>
          <ToolbarButton
            title="Filter"
            onClick={() => dispatch(toggleFilter())}
            className={
              (filterIsOpen ? 'open ' : '') + (filterIsEnabled ? 'enabled' : '')
            }
          >
            <FilterIcon />
          </ToolbarButton>
          <ToolbarDivider />
          <span
            className="toolbar-item checkbox"
            title="Do not clear log on page reload / navigation"
          >
            <input
              type="checkbox"
              id="ui-checkbox-preserve-log"
              checked={preserveLog}
              onChange={(e) => dispatch(setPreserveLog(e.target.checked))}
            />
            <label htmlFor="ui-checkbox-preserve-log">Preserve log</label>
          </span>
          <ToolbarDivider />
          <span
            className="toolbar-item checkbox"
            title="Enables clipboard for JSON tree (decreases rendering performance)"
          >
            <input
              type="checkbox"
              id="ui-checkbox-clipboard-is-enabled"
              checked={clipboardIsEnabled}
              onChange={(e) => dispatch(toggleClipboard(e.target.checked))}
            />
            <label htmlFor="ui-checkbox-clipboard-is-enabled">
              Enable clipboard
            </label>
          </span>
        </div>
      </div>
      {filterIsOpen === true && (
        <div className="toolbar">
          <div className="toolbar-shadow">
            <span className="toolbar-item text">
              Method:{' '}
              <input
                type="text"
                placeholder="Filter Method"
                value={filterValue}
                onChange={(e) => dispatch(setMethodFilter(e.target.value))}
              />
            </span>
            <span className="toolbar-item text">
              Include Content:{' '}
              <input
                type="text"
                placeholder="Include Content Filter"
                value={filterValue}
                onChange={(e) => dispatch(setContentFilter(e.target.value))}
              />
            </span>
            <span className="toolbar-item text">
              Exclude Content:{' '}
              <input
                type="text"
                placeholder="Exclude Content Filter"
                value={filterValue}
                onChange={(e) =>
                  dispatch(setExcludeContentFilter(e.target.value))
                }
              />
            </span>
          </div>
        </div>
      )}
    </>
  );
};

const ToolbarDivider = () => <div className="toolbar-item toolbar-divider" />;

const ToolbarButton = ({ children, className = '', ...other }) => {
  return (
    <button className={'toolbar-button toolbar-item ' + className} {...other}>
      {children}
    </button>
  );
};
