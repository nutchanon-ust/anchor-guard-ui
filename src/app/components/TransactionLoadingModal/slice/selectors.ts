import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.transactionLoadingModal || initialState;

export const selectTransactionLoadingModal = createSelector(
  [selectSlice],
  state => state,
);

export const selectLoading = createSelector(
  [selectSlice],
  state => state.loading,
);

export const selectIsError = createSelector(
  [selectSlice],
  state => state.isError,
);

export const selectErrorMessage = createSelector(
  [selectSlice],
  state => state.errorMessage,
);

export const selectLoaded = createSelector(
  [selectSlice],
  state => state.loaded,
);
