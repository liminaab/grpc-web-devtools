const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3,
});
export const formatTimestamp = (timestamp) =>
  timeFormatter.format(new Date(timestamp));
