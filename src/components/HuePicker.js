import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { drawCircle } from './colorWheel';

const containerStyle = {
  flexGrow: 4,
  alignSelf: 'stretch',
  margin: '4pt',
  position: 'relative',
  overflow: 'hidden',
};

const baseCanvasStyle = {
  touchAction: 'none',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%',
};

export function HuePicker({ onChange, hue, saturation, brightness }) {
  const canvasEl = useRef(null);

  const [size, setSize] = useState(100);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasEl.current;

    const w = canvas.parentNode.clientWidth;
    const h = canvas.parentNode.clientHeight;

    const size = Math.min(w, h);

    setSize(size);

    drawCircle(canvas);
  }, []);

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    setTimeout(() => {
      resizeCanvas();
    });
  }, [resizeCanvas]);

  const [dragging, setDragging] = useState(false);

  const sendEvent = useCallback(
    (e) => {
      const { x, y, width, height } = canvasEl.current.getBoundingClientRect();

      const dx = ((width / 2 - (e.clientX - x)) / width) * 2;

      const dy = ((height / 2 - (e.clientY - y)) / height) * 2;

      const ang = Math.atan2(dy, dx);

      const hue = ang < 0 ? Math.PI * 2 + ang : ang;

      const saturation = Math.sqrt(dx * dx + dy * dy);

      onChange({ hue, saturation: Math.min(saturation, 1) });
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e) => {
      sendEvent(e);
      setDragging(true);
    },
    [sendEvent],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (onChange && dragging) {
        sendEvent(e);
      }
    },
    [onChange, dragging, sendEvent],
  );

  const canvasStyle = useMemo(
    () => ({ ...baseCanvasStyle, filter: `brightness(${brightness * 100}%)` }),
    [brightness],
  );

  // TODO use webgl: https://github.com/gre/gl-react-dom-v2/, https://thebookofshaders.com/06/
  return (
    <div
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onPointerUp={() => setDragging(false)}
      // onPointerLeave={() => setDragging(false)}
      onPointerMove={handlePointerMove}
    >
      <canvas ref={canvasEl} style={canvasStyle} width={size} height={size} />

      <div
        style={{
          position: 'absolute',
          left: `calc(50% - 5px - ${
            (size / 2) * saturation * Math.cos(hue)
          }px)`,
          top: `calc(50% - 5px - ${(size / 2) * saturation * Math.sin(hue)}px)`,
          backgroundColor: brightness > 0.5 ? 'black' : 'white',
          opacity: 0.5,
          width: '16px',
          height: '16px',
          borderRadius: '8px',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

HuePicker.propTypes = {
  hue: PropTypes.number.isRequired,
  saturation: PropTypes.number.isRequired,
  brightness: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
