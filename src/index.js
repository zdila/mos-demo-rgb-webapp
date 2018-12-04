import React from 'react';
import ReactDOM from 'react-dom';
import mqtt from 'mqtt';
import ColorPicker from './components/ColorPicker';

const client = mqtt.connect('ws://iot.eclipse.org/ws');

// client.on('connect', () => {
// })

let toRef;
let rgb;

function handleColorSelect(r, g, b) {
  rgb = [r, g, b];
  if (toRef) {
    return;
  }

  send(r, g, b);

  toRef = setTimeout(() => {
    toRef = undefined;
    const [r, g, b] = rgb;
    send(r, g, b);
  }, 200);
}

function send(r, g, b) {
  client.publish('sk.eastcode.demo/rgb', JSON.stringify({ r, g, b }));
}

ReactDOM.render(
  <ColorPicker onColorSelect={handleColorSelect} />,
  document.getElementById('main'),
);
