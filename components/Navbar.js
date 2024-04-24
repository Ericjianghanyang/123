import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Link href="/room-management" passHref>
                    <Button color="inherit">房间管理</Button>
                </Link>
                <Link href="/view-room" passHref>
                    <Button color="inherit">查看房间</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}
