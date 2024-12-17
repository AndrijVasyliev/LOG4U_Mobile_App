export const getStatusText = (status: string | undefined) => {
  switch (status) {
    case undefined:
    case 'New':
    case 'GTG':
    case 'Completed':
      return '';
    default:
      return `${status}`;
  }
};
