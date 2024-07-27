"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Alert, Snackbar } from '@mui/material';

interface Message {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt: Date;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/messages');
      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError('Error fetching messages. Please try again later.');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onDelete = async (messageId: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await axios.post('/api/deleteMessage', { messageId });
      if (response.data.success) {
        setMessages(messages.filter((message) => message.id !== messageId));
        setSnackbar({ open: true, message: 'Message deleted successfully', severity: 'success' });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting message', severity: 'error' });
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row items-center justify-evenly p-24">
      <Button onClick={fetchMessages}>Refresh Messages</Button>
      {messages.map((message) => (
        <Card key={message.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {message.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Description: {message.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(message.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
          <Dropdown>
            <DropdownTrigger>
              <Button>Open Menu</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Action event example">
              <DropdownItem onClick={() => onDelete(message.id)} key="delete" className="z-90 text-danger" color="danger">
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Card>
      ))}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}