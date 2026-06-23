import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Lister ses contacts : GET /contacts/index.php
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/contacts/index.php');
      return data.contacts || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Envoyer une demande de contact : POST /contacts/store.php
export const sendContactRequest = createAsyncThunk(
  'contacts/sendContactRequest',
  async ({ receiver_id }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/contacts/store.php', { receiver_id: Number(receiver_id) });
      dispatch(fetchContacts());
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Accepter une demande : POST /contacts/accept.php
export const acceptContact = createAsyncThunk(
  'contacts/acceptContact',
  async ({ contact_id }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/contacts/accept.php', { contact_id: Number(contact_id) });
      dispatch(fetchContacts());
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchContacts.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.items = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchContacts.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; });
  },
});

export const selectContacts = (state) => state.contacts;
export default contactsSlice.reducer;
