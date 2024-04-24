import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { Box, Button, Grid } from '@mui/material';

export default function ViewRoom() {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    const token = await getAccessToken();
    try {
      const response = await axios.get('https://api.ailecare.cn/v1.0/cameras', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cameraData = response.data.data.cameras.array;
      await fetchCameraBackgrounds(cameraData);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const fetchCameraBackgrounds = async (cameraData) => {
    const token = await getAccessToken();
    const updates = await Promise.all(cameraData.map(async camera => {
      try {
        const bgResponse = await axios.get(`https://api.ailecare.cn/v1.0/cameras/${camera.id}/background`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return { ...camera, background_url: bgResponse.data.data.background_url };
      } catch (error) {
        console.error(`Error fetching background for camera ${camera.id}:`, error);
        return { ...camera, background_url: '/images/placeholder.jpg' }; // fallback if no background fetched
      }
    }));
    setCameras(updates);
  };

  return (
    <div>
      <Navbar />
      <h1>查看房间</h1>
      <Button onClick={fetchCameras} color="primary" style={{ marginBottom: '20px' }}>
        刷新数据
      </Button>
      <Grid container spacing={2}>
        {cameras.map(camera => (
          <Grid item xs={6} key={camera.id}>
            <Box border={1} padding={2}>
              <img src={camera.background_url || '/images/placeholder.jpg'} alt={`Camera ${camera.friendly_name}`}
                style={{
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  backgroundColor: '#f0f0f0', 
                  transform: 'scaleX(-1)' // CSS property for horizontal flip
                }}
              />
              <p>名称: {camera.friendly_name}</p>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
