import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthModalState {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
}

const initialState: AuthModalState = {
  isOpen: false,
  initialMode: 'signin',
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    showAuthModal: (state, action: PayloadAction<'signin' | 'signup'>) => {
      state.isOpen = true;
      state.initialMode = action.payload;
    },
    hideAuthModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showAuthModal, hideAuthModal } = authModalSlice.actions;

export const selectAuthModalIsOpen = (state: { authModal: AuthModalState }) => state.authModal.isOpen;
export const selectAuthModalInitialMode = (state: { authModal: AuthModalState }) => state.authModal.initialMode;

export default authModalSlice.reducer;