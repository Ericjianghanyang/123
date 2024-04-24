import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import Favorite from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraIcon from '@mui/icons-material/Camera';
import { Box, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/router';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const token = await getAccessToken();
    try {
      const response = await axios.get('https://api.ailecare.cn/v1.0/rooms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRooms(response.data.data.rooms.array);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // 创建新房间
  const handleCreateRoom = async () => {
    const token = await getAccessToken();
    try {
      const response = await axios.post('https://api.ailecare.cn/v1.0/rooms', {
        friendly_name: newRoomName,
        favourite_room: isFavourite
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Create room response:', response.data);
      setTimeout(() => {
        fetchRooms();
      }, 1000);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // 切换房间收藏状态
  const toggleFavourite = async (roomId, currentStatus) => {
    const token = await getAccessToken();
    try {
      const response = await axios.patch(`https://api.ailecare.cn/v1.0/rooms/${roomId}`, {
        favourite_room: !currentStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Toggle favourite response:', response.data);
      fetchRooms(); // 刷新房间列表以显示最新状态
    } catch (error) {
      console.error('Error toggling favourite status:', error);
    }
  };

  // 删除房间
  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    const token = await getAccessToken();
    try {
      const response = await axios.delete(`https://api.ailecare.cn/v1.0/rooms/${roomToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Delete room response:', response.data);
      fetchRooms(); // 刷新房间列表以显示最新状态
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // 打开创建房间对话框
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // 关闭创建房间对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 打开删除确认对话框
  const handleOpenDeleteDialog = (roomId) => {
    setRoomToDelete(roomId);
    setDeleteDialogOpen(true);
  };

  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  //跳转摄像头版本信息页面
  const navigateToCameraManagement = (roomId) => {
    router.push(`/camera-management/${roomId}`);
  };

  return (
    <div>
      <Navbar />
      <h1>房间管理</h1>
      <Button color="primary" onClick={handleOpenDialog} style={{ margin: '10px' }}>创建房间</Button>
      <Button color="secondary" onClick={fetchRooms} style={{ margin: '10px' }}>刷新房间列表</Button>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {rooms.map(room => (
          <Box key={room.id} sx={{ flex: '1 0 30%', maxWidth: '30%', margin: '10px', border: '1px solid black', padding: '10px', position: 'relative' }}>
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0, color: room.favourite_room ? 'red' : 'grey' }}
              onClick={() => toggleFavourite(room.id, room.favourite_room)}
            >
              <Favorite />
            </IconButton>
            <IconButton
              sx={{ position: 'absolute', bottom: 0, right: 0, color: 'grey' }}
              onClick={() => handleOpenDeleteDialog(room.id)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              sx={{ position: 'absolute', top: 0, left: 0, color: 'blue' }}
              onClick={() => navigateToCameraManagement(room.id)}
            >
              <CameraIcon />
            </IconButton>
            <p>房间名: {room.friendly_name}</p>
            <p>在线设备数量: {room.online_camera_count}</p>
            <p>总设备数量: {room.camera_count}</p>
          </Box>
        ))}
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>新建房间</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="房间名称"
            fullWidth
            variant="outlined"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isFavourite}
                onChange={(e) => setIsFavourite(e.target.checked)}
                color="primary"
              />
            }
            label="收藏此房间"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleCreateRoom}>创建</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"确认删除房间"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要删除这个房间吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteRoom} color="secondary" autoFocus>
            删除
          </Button>
        </DialogActions>
      </Dialog>
      </div>
  );
};

export default RoomManagement;
