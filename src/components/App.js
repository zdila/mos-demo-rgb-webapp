import React, { useRef, useEffect, useCallback, useReducer } from 'react';
import { useThrottle } from 'use-throttle';
import mqtt from 'mqtt';
import { ColorPicker } from './ColorPicker';
import { hsv2rgb, rgb2hsv } from '../color';

const clientId = Math.random().toString(36).slice(2);

const connStateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: '4pt',
  zIndex: 100,
};

const colorPickerStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case 'setColor':
      return payload.clientId === clientId
        ? state
        : {
            ...state,
            colors: Object.assign({}, state.colors, {
              [payload.device || state.device]: payload.color,
            }),
            clientId: payload.clientId,
          };

    case 'setDevice':
      return { ...state, device: payload };

    case 'setConnState':
      return { ...state, connState: payload };

    default:
      return state;
  }
}

const defaultColor = {
  hue: 0,
  saturation: 0,
  brightness: 1,
};

const connStateMessages = {
  disconnected: 'Disconnected.',
  connected: 'Connected.',
  reconnect: 'Reconnecting…',
  offline: 'Offline.',
  closed: 'Closed.',
};

export function App() {
  const clientRef = useRef();

  const [state, dispatch] = useReducer(reducer, {
    colors: {},
    device: 'esp32_B1B449',
    connState: 'disconnected',
  });

  useEffect(() => {
    const client = mqtt.connect({
      protocol: 'wss',
      host: 'mqtt.freemap.sk',
      port: 8083,
      username: 'demo',
      password: 'demo123',
    });

    client.on('connect', () => {
      dispatch({ type: 'setConnState', payload: 'connected' });
    });

    client.on('reconnect', () => {
      dispatch({ type: 'setConnState', payload: 'reconnect' });
    });

    client.on('close', () => {
      dispatch({ type: 'setConnState', payload: 'closed' });
    });

    client.on('offline', () => {
      dispatch({ type: 'setConnState', payload: 'offline' });
    });

    client.on('error', (err) => {
      dispatch({ type: 'setConnState', payload: `Error: ${err.message}` });
      window.alert(`Error: ${err.message}`);
    });

    client.on('message', (topic, msg) => {
      try {
        const data = JSON.parse(msg.toString('ascii'));

        const [hue, saturation, brightness] = rgb2hsv(data.r, data.g, data.b);

        dispatch({
          type: 'setColor',
          payload: {
            device: topic.replace(/\/.*/, ''),
            color: { hue, saturation, brightness },
            clientId: data.clientId,
          },
        });
      } catch (err) {
        console.log(err);
      }
    });

    client.subscribe('esp32_B1B449/rgb');

    client.subscribe('esp32_B04601/rgb');

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  // let's throttle events to not to overload mqtt
  const throttledState = useThrottle(state, 100);

  const handleDeviceChange = useCallback((e) => {
    dispatch({ type: 'setDevice', payload: e.target.value });
  }, []);

  useEffect(() => {
    const color = throttledState.colors[throttledState.device];

    if (color && !throttledState.clientId) {
      const rgb = hsv2rgb(
        color.hue / 2 / Math.PI,
        color.saturation,
        color.brightness,
      );

      clientRef.current.publish(
        `${state.device}/rgb`,
        JSON.stringify({
          r: rgb[0],
          g: rgb[1],
          b: rgb[2],
          clientId,
        }),
        {
          retain: true,
        },
      );
    }
    // note that device dep is missing not to set color on device change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledState]);

  const handleColorChange = useCallback((color) => {
    dispatch({ type: 'setColor', payload: { color } });
  }, []);

  return (
    <>
      <div style={connStateStyle}>
        <select
          style={{ display: 'block', marginBottom: 4 }}
          onChange={handleDeviceChange}
          value={state.device}
          disabled={state.connState !== 'connected'}
        >
          <option value="esp32_B1B449">Spálňa</option>
          <option value="esp32_B04601">Obývačka</option>
        </select>
        {connStateMessages[state.connState] || state.connState}
      </div>
      <div style={colorPickerStyle}>
        <ColorPicker
          onChange={handleColorChange}
          color={state.colors[state.device] || defaultColor}
        />
      </div>
    </>
  );
}
