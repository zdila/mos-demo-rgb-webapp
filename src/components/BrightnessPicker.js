import React, { useRef, useState } from 'react';

export default function BrightnessPicker({ onChange, color }) {
  const divEl = useRef(null);

  const [dragging, setDragging] = useState(false);

  function sendEvent(e) {
    const { x, width } = divEl.current.getBoundingClientRect();

    onChange((e.clientX - x) / width);
  }

  function handlePointerDown(e) {
    setDragging(true);
    sendEvent(e);
  }

  function handlePointerMove(e) {
    if (dragging) {
      sendEvent(e);
    }
  }

  return (
    <div
      ref={divEl}
      style={{
        height: '40pt',
        backgroundImage: `linear-gradient(to right, black, ${color})`,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    />
  );
}
