import { createSlice } from '@reduxjs/toolkit';

export interface SignOutState {
  isModalOpen: boolean;
}

const initialState: SignOutState = {
  isModalOpen: false,
};

const signOutSlice = createSlice({
  name: 'signOut',
  initialState,
  reducers: {
    openSignOutModal: (state) => {
      state.isModalOpen = true;
    },
    closeSignOutModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { openSignOutModal, closeSignOutModal } = signOutSlice.actions;

export const selectSignOutModalOpen = (state: { signOut: SignOutState }) => state.signOut.isModalOpen;

export default signOutSlice.reducer; 