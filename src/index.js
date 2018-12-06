import React from 'react';
import ReactDOM from 'react-dom';
import mqtt from 'mqtt';
import ColorPicker from './components/ColorPicker';

const client = mqtt.connect('ws://iot.eclipse.org/ws');

client.on('connect', () => {
  console.log('Connected.');
})

client.on('error', (err) => {
  console.error('Connecttion error:', err);
})

let timeoutRef;
let rgb;

function handleColorSelect([r, g, b]) {
  rgb = [r, g, b];
  if (timeoutRef) {
    return;
  }

  send(r, g, b);

  timeoutRef = setTimeout(() => {
    timeoutRef = undefined;
    const [r1, g1, b1] = rgb;
    if (r !== r1 || g !== g1 || b !== b1) {
      send(r1, g1, b1);
    }
  }, 200);
}

function send(r, g, b) {
  client.publish('esp8266_48C9DC/rpc', JSON.stringify({
    method: 'setRGB',
    params: { r: r / 255, g: g / 255, b: b / 255 },
  }));
}

ReactDOM.render(
  <ColorPicker onChange={handleColorSelect} />,
  document.getElementById('main'),
);
