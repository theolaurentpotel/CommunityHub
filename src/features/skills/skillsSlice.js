import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Lister les compétences : GET /skills/index.php
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/skills/index.php');
      return data.skills || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Créer une compétence premium : POST /skills/store.php
export const createSkill = createAsyncThunk(
  'skills/createSkill',
  async (skill, { rejectWithValue }) => {
    try {
      // daily_price en nombre
      const payload = { ...skill, daily_price: Number(skill.daily_price) };
      return await api.post('/skills/store.php', payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchSkills.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.items = Array.isArray(a.payload) ? a.payload : [];
      })
      .addCase(fetchSkills.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(createSkill.fulfilled, (s) => { s.status = 'succeeded'; });
  },
});

export const selectSkills = (state) => state.skills;
export default skillsSlice.reducer;
