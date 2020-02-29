import React, { useState } from 'react';
import { HuePicker } from './HuePicker';
import { BrightnessPicker } from './BrightnessPicker';

export function ColorPicker({ onChange }) {
  const [hue, setHue] = useState([255, 255, 255]);

  const [brightness, setBrightness] = useState(1);

  function sendEvent(rgb, v) {
    onChange(rgb.map(x => x * v));
  }

  function handleHueChange(rgb) {
    setHue(rgb);
    sendEvent(rgb, brightness);
  }

  function handleBrightnessChange(v) {
    setBrightness(v);
    sendEvent(hue, v);
  }

  return (
    <div>
      <HuePicker onChange={handleHueChange} brightness={brightness} />
      <BrightnessPicker
        onChange={handleBrightnessChange}
        color={`rgb(${hue[0]}, ${hue[1]}, ${hue[2]})`}
      />
    </div>
  );
}
