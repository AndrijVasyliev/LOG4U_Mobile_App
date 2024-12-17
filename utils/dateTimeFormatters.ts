export const dateTimeFormatter = Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  // second: 'numeric',
  hour12: true,
});
