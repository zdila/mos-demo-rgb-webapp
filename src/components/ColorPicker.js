import React, { useState, useRef, useEffect } from 'react';
import { drawCircle } from './colorWheel';

export default function ColorPicker({ onColorSelect }) {
  const canvasEl = useRef(null);

  useEffect(() => {
    const resizeCanvas = () => {
      canvasEl.current.width = window.innerWidth;
      canvasEl.current.height = window.innerWidth;
      drawCircle(canvasEl.current);
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const [dragging, setDragging] = useState(false);

  function handleChange(e) {
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

  function handlePointerDown(e) {
    handleChange(e);
    setDragging(true);
  }

  function handlePointerMove(e) {
    if (onColorSelect && dragging) {
      handleChange(e);
    }
  }

  return (
    <canvas
      ref={canvasEl}
      width="10"
      height="10"
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    />
  );
}
