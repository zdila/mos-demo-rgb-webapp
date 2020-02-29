import React, { useRef, useState } from 'react';

const brightnessPickerStyle = {
  flexGrow: 1,
  minHeight: '40pt',
  alignSelf: 'stretch',
  backgroundImage: `linear-gradient(to right, black, ${color})`,
  touchAction: 'none',
  margin: '4pt',
};

export function BrightnessPicker({ onChange, color }) {
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
      style={brightnessPickerStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    />
  );
}
