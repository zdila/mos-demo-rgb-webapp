import React, { useRef, useState, useCallback, useMemo } from 'react';

const baseBrightnessPickerStyle = {
  flexGrow: 1,
  minHeight: '40pt',
  alignSelf: 'stretch',
  touchAction: 'none',
  margin: '4pt',
};

export function BrightnessPicker({ onChange, color }) {
  const divEl = useRef(null);

  const [dragging, setDragging] = useState(false);

  const sendEvent = useCallback(
    e => {
      const { x, width } = divEl.current.getBoundingClientRect();

      onChange((e.clientX - x) / width);
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    e => {
      setDragging(true);
      sendEvent(e);
    },
    [sendEvent],
  );

  const handlePointerMove = useCallback(
    e => {
      if (dragging) {
        sendEvent(e);
      }
    },
    [sendEvent],
  );

  const brightnessPickerStyle = useMemo(
    () => ({
      ...baseBrightnessPickerStyle,
      backgroundImage: `linear-gradient(to right, black, ${color})`,
    }),
    [color],
  );

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
