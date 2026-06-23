import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, setToken, clearToken, getToken } from '../../services/api';

export const register = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const payload = { ...formData, user_status_id: Number(formData.user_status_id) };
      return await api.post('/auth/register.php', payload, { auth: false });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await api.post('/auth/login.php', credentials, { auth: false });
      const token = data.token || data.auth_token || data['X-Auth-Token'];
      if (token) setToken(token);
      return { token, user: data.user || data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.get('/users/me.php');
      return data.user || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.post('/auth/logout.php', {});
  } catch {}
  clearToken();
  return true;
});

const initialState = {
  user: null,
  token: getToken() || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.token = null; clearToken(); })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.token = null; state.status = 'idle'; });
  },
});

export const { clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectIsPremium = (state) =>
  Boolean(state.auth.user && (state.auth.user.is_premium || state.auth.user.premium));

// Statuts : 1 = membre, 2 = organisateur, 3 = admin
export const selectIsAdmin = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  return Number(user.user_status_id) === 3 || user.is_admin || user.role === 'admin';
};

// Accès aux fonctionnalités premium : vrai si premium OU admin.
// Un admin a accès à tout, même sans abonnement premium.
export const selectHasPremiumAccess = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  const isPremium = user.is_premium || user.premium;
  const isAdmin = Number(user.user_status_id) === 3 || user.is_admin || user.role === 'admin';
  return Boolean(isPremium || isAdmin);
};

// Peut créer un event : organisateur (2), admin (3), + leurs variantes premium
export const selectCanCreateEvent = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  const status = Number(user.user_status_id);
  const isOrganizer = status === 2 || user.role === 'organizer' || user.is_organizer;
  const isAdmin = status === 3 || user.is_admin || user.role === 'admin';
  return Boolean(isOrganizer || isAdmin);
};

export default authSlice.reducer;
