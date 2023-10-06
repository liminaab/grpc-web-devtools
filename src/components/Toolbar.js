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

  const onPreserveLogChanged = (e) => {
    dispatch(setPreserveLog(e.target.checked));
  };

  const onEnableClipboardChanged = (e) => {
    dispatch(toggleClipboard(e.target.checked));
  };

  const onMethodFilterChange = (e) => {
    dispatch(setMethodFilter(e.target.value));
  };

  const onContentFilterChange = (e) => {
    dispatch(setContentFilter(e.target.value));
  };

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-shadow">
          <ToolbarButton
            title="Clear"
            onClick={() => clearLog({ force: true })}
          >
            <ClearIcon />
          </ToolbarButton>
          <ToolbarButton
            title={stopIsEnabled ? 'Resume' : 'Stop'}
            onClick={() => toggleStopResumeLogs()}
          >
            {stopIsEnabled ? <PlayIcon /> : <StopIcon />}
          </ToolbarButton>
          <ToolbarButton
            title="Filter"
            onClick={() => toggleFilter()}
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
              onChange={onPreserveLogChanged}
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
              onChange={onEnableClipboardChanged}
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
                onChange={onMethodFilterChange}
              />
            </span>
            <span className="toolbar-item text">
              Content:{' '}
              <input
                type="text"
                placeholder="Filter Content"
                value={filterValue}
                onChange={onContentFilterChange}
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
