import React, { useState } from 'react';
import HuePicker from './HuePicker';
import BrightnessPicker from './BrightnessPicker';

export default function ColorPicker({ onChange }) {
  const [hs, setHs] = useState({ h: 0, s: 0 });
  const [brightness, setBrightness] = useState(1);


  function handleHsChange(newHs) {
    setHs(newHs);
    onChange({ ...newHs, v: brightness });
  }

  function handleBrightnessChange(v) {
    setBrightness(v);
    onChange({ ...hs, v });
  }

  return (
    <div>
      <HuePicker onChange={handleHsChange} brightness={brightness} />
      <BrightnessPicker onChange={handleBrightnessChange} color={`hsl(${Math.round(hs.h / Math.PI * 180)}, ${Math.round(hs.s * 100)}%, 50%)`} />
    </div>
  );
}
