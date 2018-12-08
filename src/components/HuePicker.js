import React, { useState, useRef, useEffect } from 'react';
import { drawCircle } from './colorWheel';

export default function HuePicker({ onChange, brightness }) {
  const canvasEl = useRef(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasEl.current;
      const w = canvas.parentNode.clientWidth;
      canvas.width = w;
      canvas.height = w;
      drawCircle(canvas);
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const [dragging, setDragging] = useState(false);

  function sendEvent(e) {
    if (!onChange) {
      return;
    }
    const c = canvasEl.current;
    const { x, y } = c.getBoundingClientRect();
    const ctx = c.getContext('2d');
    const [r, g, b, a] = ctx.getImageData(e.clientX - x, e.clientY - y, 1, 1).data;
    if (a === 255) {
      onChange([r, g, b]);
    }
  }

  function handlePointerDown(e) {
    sendEvent(e);
    setDragging(true);
  }

  function handlePointerMove(e) {
    if (onChange && dragging) {
      sendEvent(e);
    }
  }

  return (
    <canvas
      ref={canvasEl}
      width="10"
      height="10"
      style={{
        filter: `brightness(${brightness * 100}%)`,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    />
  );
}
