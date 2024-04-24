import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';

const CameraManagement = () => {
  const [cameras, setCameras] = useState([]);
  const router = useRouter();
  const { roomId } = router.query;

  useEffect(() => {
    if (roomId) {
      fetchCameras(roomId);
    }
  }, [roomId]);

  const fetchCameras = async (roomId) => {
    const token = await getAccessToken();
    try {
      const response = await axios.get('https://api.ailecare.cn/v1.0/cameras', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filteredCameras = response.data.data.cameras.array.filter(camera => camera.room_id === parseInt(roomId));
      setCameras(filteredCameras);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>摄像头管理</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {cameras.map(camera => (
          <Box key={camera.id} sx={{ flex: '1 0 30%', maxWidth: '30%', margin: '10px', border: '1px solid black', padding: '10px' }}>
            <img src="/images/camera_image.jpg" alt="Camera" style={{ width: '100%', height: '150px' }} />
            <p>名称: {camera.friendly_name}</p>
            <p>型号: {camera.model}</p>
            <p>版本: {camera.version}</p>
            <p>序列号: {camera.serial_number}</p>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default CameraManagement;
