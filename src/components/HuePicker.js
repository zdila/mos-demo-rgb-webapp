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
};

const baseCanvasStyle = {
  touchAction: 'none',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%',
};

export function HuePicker({ onChange, brightness }) {
  const canvasEl = useRef(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasEl.current;

      const w = canvas.parentNode.clientWidth;
      const h = canvas.parentNode.clientHeight;

      const size = Math.min(w, h);

      canvas.width = size;
      canvas.height = size;

      drawCircle(canvas);
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const [dragging, setDragging] = useState(false);

  const sendEvent = useCallback(
    e => {
      if (!onChange) {
        return;
      }

      const c = canvasEl.current;

      const { x, y } = c.getBoundingClientRect();

      const ctx = c.getContext('2d');

      const [r, g, b, a] = ctx.getImageData(
        e.clientX - x,
        e.clientY - y,
        1,
        1,
      ).data;

      if (a === 255) {
        onChange([r, g, b]);
      }
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    e => {
      sendEvent(e);
      setDragging(true);
    },
    [sendEvent],
  );

  const handlePointerMove = useCallback(
    e => {
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
    <div style={containerStyle}>
      <canvas
        ref={canvasEl}
        style={canvasStyle}
        onPointerDown={handlePointerDown}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        onPointerMove={handlePointerMove}
      />
    </div>
  );
}

HuePicker.propTypes = {
  brightness: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
