import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { transactionLoadingModalSaga } from './saga';
import { TransactionLoadingModalState } from './types';

export const initialState: TransactionLoadingModalState = {
  loading: false,
};

const slice = createSlice({
  name: 'transactionLoadingModal',
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction) {
      state.loading = true;
    },
    stopLoading(state, action: PayloadAction) {
      state.loading = false;
    },
  },
});

export const { actions: transactionLoadingModalActions } = slice;

export const useTransactionLoadingModalSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: transactionLoadingModalSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useTransactionLoadingModalSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
