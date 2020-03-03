import React, { useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HuePicker } from './HuePicker';
import { BrightnessPicker } from './BrightnessPicker';

function reducer(state, action) {
  switch (action.type) {
    case 'setHue':
      return { ...state, modified: true, hue: action.payload };
    case 'setBrightness':
      return { ...state, modified: true, brightness: action.payload };
    default:
      break;
  }
}

export function ColorPicker({ onChange }) {
  const [state, dispatch] = useReducer(reducer, {
    hue: [255, 255, 255],
    brightness: 1,
    modified: false,
  });

  useEffect(() => {
    if (state.modified) {
      onChange(state.hue.map(x => x * state.brightness));
    }
  }, [state, onChange]);

  const handleBrightnessChange = useCallback(brightness => {
    dispatch({ type: 'setBrightness', payload: brightness });
  }, []);

  const handleHueChange = useCallback(hue => {
    dispatch({ type: 'setHue', payload: hue });
  }, []);

  return (
    <>
      <HuePicker onChange={handleHueChange} brightness={state.brightness} />
      <BrightnessPicker
        onChange={handleBrightnessChange}
        color={`rgb(${state.hue.join(',')})`}
      />
    </>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
