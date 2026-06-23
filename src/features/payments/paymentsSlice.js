import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Passer premium : POST /payments/premium.php (paiement Stripe simulé)
export const goPremium = createAsyncThunk(
  'payments/goPremium',
  async ({ payment_method = 'stripe', amount = 19.99 }, { rejectWithValue }) => {
    try {
      return await api.post('/payments/premium.php', { payment_method, amount });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Voir ses paiements : GET /payments/index.php
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/payments/index.php');
      return data.payments || data.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(goPremium.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(goPremium.fulfilled, (s) => { s.status = 'succeeded'; })
      .addCase(goPremium.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchPayments.fulfilled, (s, a) => {
        s.items = Array.isArray(a.payload) ? a.payload : [];
      });
  },
});

export const selectPayments = (state) => state.payments;
export default paymentsSlice.reducer;
