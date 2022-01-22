import { PayloadAction } from '@reduxjs/toolkit';
import { formatUnits } from 'ethers/lib/utils';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { newBidSaga } from './saga';
import { NewBidState } from './types';

export const initialState: NewBidState = {
  userUstBalance: 0,
};

const slice = createSlice({
  name: 'newBid',
  initialState,
  reducers: {
    setUserUstBalance(state, action: PayloadAction<number>) {
      state.userUstBalance = Number(formatUnits(action.payload, 6));
    },
  },
});

export const { actions: newBidActions } = slice;

export const useNewBidSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: newBidSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useNewBidSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
