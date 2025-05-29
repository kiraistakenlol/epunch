import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  visible: boolean;
  content: string | null;
}

const initialState: AlertState = {
  visible: false,
  content: null,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.content = action.payload;
    },
    
    hideAlert: (state) => {
      state.visible = false;
      state.content = null;
    },
  }
});

export const {
  showAlert,
  hideAlert
} = alertSlice.actions;

export const selectAlert = (state: { alert: AlertState }) => state.alert;

export default alertSlice.reducer; 