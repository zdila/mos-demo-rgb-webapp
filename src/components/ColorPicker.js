import React, { useState, useCallback } from 'react';
import { HuePicker } from './HuePicker';
import { BrightnessPicker } from './BrightnessPicker';

export function ColorPicker({ onChange }) {
  const [hue, setHue] = useState([255, 255, 255]);

  const [brightness, setBrightness] = useState(1);

  const sendEvent = useCallback(
    (rgb, v) => {
      onChange(rgb.map(x => x * v));
    },
    [onChange],
  );

  const handleHueChange = useCallback(
    rgb => {
      setHue(rgb);
      sendEvent(rgb, brightness);
    },
    [sendEvent],
  );

  const handleBrightnessChange = useCallback(
    v => {
      setBrightness(v);
      sendEvent(hue, v);
    },
    [sendEvent],
  );

  return (
    <>
      <HuePicker onChange={handleHueChange} brightness={brightness} />
      <BrightnessPicker
        onChange={handleBrightnessChange}
        color={`rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`}
      />
    </>
  );
}
