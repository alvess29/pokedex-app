export const formatName = (name) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const formatNumber = (id) => `#${String(id).padStart(4, '0')}`;
