import mqtt from 'mqtt';
import axios from 'axios';
import { getAccessToken } from './auth';

let client = null;
const mqttOptions = {
  connectTimeout: 4000,
  clientId: 'nextjs_client_' + Math.random().toString(16).substr(2, 8),
  keepalive: 60,
  clean: true,
};

const getMqttCredentials = async () => {
  const token = await getAccessToken();
  const response = await axios.get('https://api.ailecare.cn/v1.0/mqttAccount', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const connectMQTT = async () => {
  const { username, password, url } = await getMqttCredentials();

  client = mqtt.connect(url, {
    ...mqttOptions,
    username,
    password,
  });

  client.on('connect', () => {
    console.log('Connected to MQTT Broker');
  });

  client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end();
  });

  client.on('reconnect', () => {
    console.log('Reconnecting...');
  });

  return client;
};

export const subscribeToTopic = (topic) => {
  if (client) {
    client.subscribe(topic, { qos: 0 }, (error) => {
      if (error) {
        console.log('Subscribe to topic failed:', error);
      }
    });
  }
};

export const disconnectMQTT = () => {
  if (client) {
    client.end();
  }
};

export const publishToken = async (cameraId) => {
  const token = await getAccessToken();
  const response = await axios.get(`https://api.ailecare.cn/v1.0/cameras/${cameraId}/streamToken`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (client) {
    client.publish(`mobileClient/${response.data.groupId}/camera/${cameraId}/token`, response.data.streamToken);
  }
};
