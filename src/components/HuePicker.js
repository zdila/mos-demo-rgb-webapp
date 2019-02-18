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
    const canvas = canvasEl.current;
    const { x, y, width, height } = canvas.getBoundingClientRect();
    const px = ((e.clientX - x) - width / 2) / (width / 2);
    const py = ((e.clientY - y) - height / 2) / (height / 2);
    let h = Math.atan(py / px) - Math.PI;
    if (px < 0) {
      h -= Math.PI;
    }
    while (h < 0) {
      h += 2 * Math.PI;
    }

    const s = Math.sqrt(px * px + py * py);

    if (s <= 1) {
      onChange({ h, s });
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

  // TODO use webgl: https://github.com/gre/gl-react-dom-v2/, https://thebookofshaders.com/06/
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
