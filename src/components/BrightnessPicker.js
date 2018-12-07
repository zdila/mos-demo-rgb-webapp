import React, { useRef, useState } from 'react';

export default function BrightnessPicker({ onChange, color }) {
  const divEl = useRef(null);
  const [dragging, setDragging] = useState(false);

  function sendEvent(e) {
    const { x, width } = divEl.current.getBoundingClientRect();
    onChange((e.clientX - x) / width);
  }

  function handlePointerDown(e) {
    sendEvent(e);
    setDragging(true);
  }

  function handlePointerMove(e) {
    if (onChange && dragging) {
      sendEvent(e);
    }
  }

  return (
    <div
      ref={divEl}
      style={{
        height: '40px',
        backgroundImage: `linear-gradient(to right, black, ${color})`,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    />
  );
}
