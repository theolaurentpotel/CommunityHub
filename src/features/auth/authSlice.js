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

// Modifier le profil de l'utilisateur connecté.
// Le statut n'est jamais envoyé (l'utilisateur ne peut pas le modifier).
// Si le mot de passe est vide, il n'est pas changé côté serveur.
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const payload = {
        pseudo: formData.pseudo,
        email: formData.email,
        avatar: formData.avatar || '',
        lastname: formData.lastname,
        firstname: formData.firstname,
        birthdate: formData.birthdate,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        phone: formData.phone,
        password: formData.password || '',
      };
      const res = await api.post('/users/update.php', payload);
      // On rafraîchit le profil pour récupérer les données à jour.
      await dispatch(fetchMe());
      return res;
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
  updateStatus: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    clearUpdateStatus(state) { state.updateStatus = 'idle'; state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => { state.updateStatus = 'loading'; state.error = null; })
      .addCase(updateProfile.fulfilled, (state) => { state.updateStatus = 'succeeded'; })
      .addCase(updateProfile.rejected, (state, action) => { state.updateStatus = 'failed'; state.error = action.payload; })
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

export const { clearError, clearUpdateStatus } = authSlice.actions;

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
