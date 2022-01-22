import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.walletConnection || initialState;

export const selectWalletConnection = createSelector(
  [selectSlice],
  state => state,
);
