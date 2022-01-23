import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { transactionLoadingModalSaga } from './saga';
import { TransactionLoadingModalState } from './types';

export const initialState: TransactionLoadingModalState = {
  loading: false,
  loaded: false,
  isError: false,
  errorMessage: '',
};

const slice = createSlice({
  name: 'transactionLoadingModal',
  initialState,
  reducers: {
    startLoading(state, action: PayloadAction) {
      state.loading = true;
      state.loaded = false;
      state.isError = false;
    },
    stopLoading(state, action: PayloadAction) {
      state.loading = false;
      state.loaded = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.isError = true;
      state.errorMessage = action.payload;
    },
    closeModal(state, action: PayloadAction) {
      state.loading = false;
      state.loaded = false;
      state.isError = false;
      state.errorMessage = '';
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
