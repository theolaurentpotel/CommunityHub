import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import skillsReducer from '../features/skills/skillsSlice';
import contactsReducer from '../features/contacts/contactsSlice';
import messagesReducer from '../features/messages/messagesSlice';
import eventsReducer from '../features/events/eventsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    payments: paymentsReducer,
    skills: skillsReducer,
    contacts: contactsReducer,
    messages: messagesReducer,
    events: eventsReducer,
  },
});
