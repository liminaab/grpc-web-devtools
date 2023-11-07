import React, { useEffect } from 'react';
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
  setSelectedTheme,
  selectTheme,
} from '../state/toolbar';
import { toggleClipboard } from '../state/clipboard';
import ClearIcon from '../icons/Clear';
import StopIcon from '../icons/Stop';
import PlayIcon from '../icons/Play';
import FilterIcon from '../icons/Filter';
import { themes } from './themes';
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
  const selectedTheme = useSelector(selectTheme);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(['theme']).then(({ theme }) => {
      dispatch(setSelectedTheme(theme));
    });
  }, [dispatch]);

  const isDarkMode =
    window.matchMedia('(prefers-color-scheme: dark)').matches === true;

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

          <ToolbarDivider />
          <span className="toolbar-item" title="Select theme">
            <label htmlFor="ui-select-theme">Theme: </label>
            <select
              id="ui-select-theme"
              onChange={(event) => {
                const theme = event.target.value;
                dispatch(setSelectedTheme(theme));
                // eslint-disable-next-line no-undef
                chrome.storage.sync.set({ theme });
              }}
            >
              {themes
                .filter(({ dark }) => dark === isDarkMode)
                .map(({ value: theme }) => {
                  return (
                    <option
                      key={theme}
                      value={theme}
                      selected={theme === selectedTheme}
                    >
                      {theme}
                    </option>
                  );
                })}
            </select>
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
