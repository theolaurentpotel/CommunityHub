import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Lister les messages reçus ou envoyés : GET /messages/index.php(?type=sent)
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (type = 'received', { rejectWithValue }) => {
    try {
      const query = type === 'sent' ? '?type=sent' : '';
      const data = await api.get(`/messages/index.php${query}`);
      return { type, items: data.messages || data.data || data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Envoyer un message privé : POST /messages/send.php
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ receiver_id, message }, { rejectWithValue }) => {
    try {
      return await api.post('/messages/send.php', {
        receiver_id: Number(receiver_id),
        message,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { items: [], view: 'received', status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.view = a.payload.type;
        s.items = Array.isArray(a.payload.items) ? a.payload.items : [];
      })
      .addCase(fetchMessages.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; });
  },
});

export const selectMessages = (state) => state.messages;
export default messagesSlice.reducer;
