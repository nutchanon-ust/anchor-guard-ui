import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { myBidsSaga } from './saga';
import { MyBidsState, Bid } from './types';

export const initialState: MyBidsState = {
  myBids: [],
  loading: false,
  walletAddress: null,
};

const slice = createSlice({
  name: 'myBids',
  initialState,
  reducers: {
    load(state) {
      state.loading = true;
      state.myBids = [];
    },
    loaded(state, action: PayloadAction<Bid[]>) {
      const myBids = action.payload;
      state.myBids = myBids;
      state.loading = false;
    },
    changeWalletAddress(state, action: PayloadAction<string | null>) {
      state.walletAddress = action.payload;
    },
  },
});

export const { actions: myBidsActions, reducer } = slice;

export const useMyBidsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: myBidsSaga });
  return { actions: slice.actions };
};
