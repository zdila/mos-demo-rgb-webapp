import React, { useRef, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const baseBrightnessPickerStyle = {
  flexGrow: 1,
  minHeight: '40pt',
  alignSelf: 'stretch',
  touchAction: 'none',
  margin: '4pt',
  position: 'relative',
  overflow: 'hidden',
};

export function BrightnessPicker({ onChange, brightness, color }) {
  const divEl = useRef(null);

  const [dragging, setDragging] = useState(false);

  const sendEvent = useCallback(
    e => {
      const { x, width } = divEl.current.getBoundingClientRect();

      onChange(Math.max(Math.min((e.clientX - x) / width, 1), 0));
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
    [sendEvent, dragging],
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
      style={brightnessPickerStyle}
      ref={divEl}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    >
      <div
        style={{
          position: 'absolute',
          width: '8px',
          top: 0,
          bottom: 0,
          left: `calc(${brightness * 100}% - 4px)`,
          backgroundColor: brightness > 0.5 ? 'black' : 'white',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

BrightnessPicker.propTypes = {
  color: PropTypes.string.isRequired,
  brightness: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
