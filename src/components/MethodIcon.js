import React from 'react';
import DownIcon from '../icons/Down';
import UpIcon from '../icons/Up';
import UpDownIcon from '../icons/UpDown';

export const MethodIcon = ({ methodType, isRequest }) => {
  if (methodType === 'server_streaming') {
    return isRequest ? <UpIcon /> : <DownIcon />;
  }
  if (methodType === 'unary') {
    return <UpDownIcon />;
  }

  return null;
};
