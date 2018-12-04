import React, { useState, useRef, useEffect } from 'react';
import { drawCircle } from './colorWheel';

export default function ColorPicker({ onColorSelect }) {
  const canvasEl = useRef(null);

  useEffect(() => {
    drawCircle(canvasEl.current);
  }, []);

  const [dragging, setDragging] = useState(false);

  function handleClick(e) {
    if (!onColorSelect) {
      return;
    }
    const c = canvasEl.current;
    const { x, y } = c.getBoundingClientRect();
    const ctx = c.getContext('2d');
    const [r, g, b, a] = ctx.getImageData(e.clientX - x, e.clientY - y, 1, 1).data;
    if (a === 255) {
      onColorSelect(r, g, b);
    }
  }

  function handleMouseMove(e) {
    if (!onColorSelect || !dragging) {
      return;
    }
    handleClick(e);
  }

  return (
    <canvas
      ref={canvasEl}
      width="600"
      height="600"
      onClick={handleClick}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={handleMouseMove}
    />
  );
}
