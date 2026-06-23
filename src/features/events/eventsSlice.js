import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.category_id) params.set('category_id', filters.category_id);
      if (filters.q) params.set('q', filters.q);
      if (filters.type) params.set('type', filters.type);
      if (filters.price_type) params.set('price_type', filters.price_type);
      const qs = params.toString();
      const data = await api.get(`/events/index.php${qs ? '?' + qs : ''}`);
      return data.events || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEvent = createAsyncThunk(
  'events/fetchEvent',
  async (id, { rejectWithValue }) => {
    try {
      const data = await api.get(`/events/show.php?id=${id}`);
      return data.event || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      return await api.post('/events/store.php', eventData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerToEvent = createAsyncThunk(
  'events/registerToEvent',
  async ({ event_id, payment_method }, { rejectWithValue }) => {
    try {
      return await api.post('/events/register.php', { event_id: Number(event_id), payment_method });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addEventMessage = createAsyncThunk(
  'events/addEventMessage',
  async ({ event_id, message }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/events/message.php', { event_id: Number(event_id), message });
      dispatch(fetchEvent(event_id));
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const requestMessageModeration = createAsyncThunk(
  'events/requestMessageModeration',
  async ({ message_id, event_id }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/events/message_moderation.php', { message_id: Number(message_id) });
      dispatch(fetchEvent(event_id));
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/categories/index.php');
      return data.categories || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'events/createCategory',
  async ({ name }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/categories/store.php', { name });
      dispatch(fetchCategories());
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyRegistrations = createAsyncThunk(
  'events/fetchMyRegistrations',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/events/my_registrations.php');
      return data.registrations || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMyEvents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/events/my_events.php');
      return data.events || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rateOrganizer = createAsyncThunk(
  'events/rateOrganizer',
  async ({ event_id }, { rejectWithValue }) => {
    try {
      return await api.post('/events/rate_organizer.php', { event_id: Number(event_id) });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const requestPayout = createAsyncThunk(
  'events/requestPayout',
  async (_, { rejectWithValue }) => {
    try {
      return await api.post('/events/payout.php', {});
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    current: null,
    categories: [],
    myRegistrations: [],
    myEvents: [],
    status: 'idle',
    currentStatus: 'idle',
    createStatus: 'idle',
    registerStatus: 'idle',
    categoryStatus: 'idle',
    error: null,
  },
  reducers: {
    clearCurrent(state) { state.current = null; state.currentStatus = 'idle'; },
    clearCreateStatus(state) { state.createStatus = 'idle'; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchEvents.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = Array.isArray(a.payload) ? a.payload : []; })
      .addCase(fetchEvents.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(fetchEvent.pending, (s) => { s.currentStatus = 'loading'; })
      .addCase(fetchEvent.fulfilled, (s, a) => { s.currentStatus = 'succeeded'; s.current = a.payload; })
      .addCase(fetchEvent.rejected, (s, a) => { s.currentStatus = 'failed'; s.error = a.payload; })

      .addCase(createEvent.pending, (s) => { s.createStatus = 'loading'; s.error = null; })
      .addCase(createEvent.fulfilled, (s) => { s.createStatus = 'succeeded'; })
      .addCase(createEvent.rejected, (s, a) => { s.createStatus = 'failed'; s.error = a.payload; })

      .addCase(registerToEvent.pending, (s) => { s.registerStatus = 'loading'; s.error = null; })
      .addCase(registerToEvent.fulfilled, (s) => { s.registerStatus = 'succeeded'; })
      .addCase(registerToEvent.rejected, (s, a) => { s.registerStatus = 'failed'; s.error = a.payload; })

      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = Array.isArray(a.payload) ? a.payload : []; })

      .addCase(createCategory.pending, (s) => { s.categoryStatus = 'loading'; s.error = null; })
      .addCase(createCategory.fulfilled, (s) => { s.categoryStatus = 'succeeded'; })
      .addCase(createCategory.rejected, (s, a) => { s.categoryStatus = 'failed'; s.error = a.payload; })
      .addCase(fetchMyRegistrations.fulfilled, (s, a) => { s.myRegistrations = Array.isArray(a.payload) ? a.payload : []; })
      .addCase(fetchMyEvents.fulfilled, (s, a) => { s.myEvents = Array.isArray(a.payload) ? a.payload : []; });
  },
});

export const { clearCurrent, clearCreateStatus } = eventsSlice.actions;

export const selectEvents = (state) => state.events;
export const selectCurrentEvent = (state) => state.events.current;
export const selectCategories = (state) => state.events.categories;
export const selectMyRegistrations = (state) => state.events.myRegistrations;
export const selectMyEvents = (state) => state.events.myEvents;

export default eventsSlice.reducer;
