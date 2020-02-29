import React, { useState, useRef, useEffect } from 'react';
import { useThrottle } from 'use-throttle';
import mqtt from 'mqtt';
import ColorPicker from './ColorPicker';

export default function App() {
  const clientRef = useRef();

  const [color, setColor] = useState(undefined);

  const [connState, setConnState] = useState('Disconnected.');

  useEffect(() => {
    const client = mqtt.connect({
      protocol: 'wss',
      host: 'mqtt.freemap.sk',
      port: 8083,
      username: 'demo',
      password: 'demo123',
    });

    client.on('connect', () => {
      setConnState('Connected.');
    });

    client.on('reconnect', () => {
      setConnState('Reconnecting...');
    });

    client.on('close', () => {
      setConnState('Closed.');
    });

    client.on('offline', () => {
      setConnState('Offline.');
    });

    client.on('error', err => {
      setConnState(`Error: ${err.message}`);
      window.alert(`Error: ${err.message}`);
    });

    clientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  // let's throttle events to not to overload mqtt
  const throttledColor = useThrottle(color, 200);

  useEffect(() => {
    if (throttledColor) {
      clientRef.current.publish(
        'esp32_B1B449/rpc',
        JSON.stringify({
          method: 'setRGB',
          params: {
            r: throttledColor[0] / 255,
            g: throttledColor[1] / 255,
            b: throttledColor[2] / 255,
          },
        }),
      );
    }
  }, [throttledColor]);

  return (
    <>
      <div>{connState}</div>
      <ColorPicker onChange={setColor} />
    </>
  );
}
