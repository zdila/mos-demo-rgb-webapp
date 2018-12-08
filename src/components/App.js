import React, { useState, useRef, useEffect } from 'react';
import mqtt from 'mqtt';
import ColorPicker from './ColorPicker';
import { useThrottle } from 'use-throttle';

export default function App() {
  const clientRef = useRef();
  const [color, setColor] = useState(undefined);

  useEffect(() => {
    const client = mqtt.connect('ws://iot.eclipse.org/ws');
    clientRef.current = client;
    return () => {
      client.end();
    };
  }, []);

  // let's throttle events to not to overload mqtt
  const throttledColor = useThrottle(color, 200);

  useEffect(() => {
    if (throttledColor) {
      clientRef.current.publish('esp8266_48C9DC/rpc', JSON.stringify({
        method: 'setRGB',
        params: {
          r: throttledColor[0] / 255,
          g: throttledColor[1] / 255,
          b: throttledColor[2] / 255,
        },
      }));
    }
  }, [throttledColor]);

  return (
    <ColorPicker onChange={setColor} />
  );
}



// function attachMqttEvents() {
//   conn.on('connect', () => {
//     window.alert('Connected.');
//   })

//   conn.on('reconnect', () => {
//     window.alert('Reconnected.');
//   })

//   conn.on('close', () => {
//     window.alert('Closed.');
//   })

//   conn.on('offline', () => {
//     window.alert('Offline.');
//   })

//   conn.on('error', (err) => {
//     window.alert('Errored: ' + err);
//   });
// }
