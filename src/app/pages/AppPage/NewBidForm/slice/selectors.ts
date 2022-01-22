import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) => state.newBid || initialState;

export const selectNewBid = createSelector([selectSlice], state => state);