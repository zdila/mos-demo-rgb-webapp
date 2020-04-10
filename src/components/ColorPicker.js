import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { HuePicker } from './HuePicker';
import { BrightnessPicker } from './BrightnessPicker';
import { hsv2rgb } from '../color';

export function ColorPicker({
  onChange,
  color: { hue, saturation, brightness },
}) {
  const handleBrightnessChange = useCallback(
    brightness => {
      onChange({ hue, saturation, brightness });
    },
    [hue, saturation, onChange],
  );

  const handleHueChange = useCallback(
    ({ hue, saturation }) => {
      onChange({ hue, saturation, brightness });
    },
    [brightness, onChange],
  );

  const rgb = hsv2rgb(hue / 2 / Math.PI, 1, 1);

  return (
    <>
      <HuePicker
        onChange={handleHueChange}
        hue={hue}
        saturation={saturation}
        brightness={brightness}
      />

      <BrightnessPicker
        onChange={handleBrightnessChange}
        color={`rgb(${rgb.map(x => x * 255).join(',')})`}
        brightness={brightness}
      />
    </>
  );
}

ColorPicker.propTypes = {
  color: PropTypes.shape({
    hue: PropTypes.number.isRequired,
    saturation: PropTypes.number.isRequired,
    brightness: PropTypes.number.isRequired,
  }).isRequired,

  onChange: PropTypes.func.isRequired,
};
