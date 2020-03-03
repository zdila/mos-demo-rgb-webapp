import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HuePicker } from './HuePicker';
import { BrightnessPicker } from './BrightnessPicker';

export function ColorPicker({ onChange }) {
  const [hue, setHue] = useState([255, 255, 255]);

  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    onChange(hue.map(x => x * brightness));
  }, [hue, brightness, onChange]);

  return (
    <>
      <HuePicker onChange={setHue} brightness={brightness} />
      <BrightnessPicker
        onChange={setBrightness}
        color={`rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`}
      />
    </>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
