import React, { useRef } from 'react';

export default function BrightnessPicker({ onChange, color }) {
  const divEl = useRef(null);

  function handleClick(e) {
    const { x, width } = divEl.current.getBoundingClientRect();
    onChange((e.clientX - x) / width);
  }

  return (
    <div
      ref={divEl}
      style={{
        height: '40px',
        backgroundImage: `linear-gradient(to right, black, ${color})`,
      }}
      onClick={handleClick}
    />
  );
}
