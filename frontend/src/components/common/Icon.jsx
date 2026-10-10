import React from 'react';

export default function Icon({ name, className = '', title }) {
  if (!name) return null;
  return (
    <i
      className={`bi bi-${name} ${className}`}
      title={title}
      aria-hidden="true"
    />
  );
}
