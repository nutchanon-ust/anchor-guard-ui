import { PayloadAction } from '@reduxjs/toolkit';
import { NetworkInfo } from '@terra-money/wallet-provider';
import { MAINNET_CHAIN_ID, MAINNET_LCD_URL } from 'app/constants';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { walletConnectionSaga } from './saga';
import { WalletConnectionState } from './types';

const mainnet: NetworkInfo = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
};

export const initialState: WalletConnectionState = {
  network: JSON.stringify(mainnet),
  lcdUrl: MAINNET_LCD_URL,
  lcdChainId: MAINNET_CHAIN_ID,
};

const slice = createSlice({
  name: 'walletConnection',
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<string>) {
      state.network = action.payload;
    },
    setLCDUrl(state, action: PayloadAction<string>) {
      state.lcdUrl = action.payload;
    },
    setLCDChainID(state, action: PayloadAction<string>) {
      state.lcdChainId = action.payload;
    },
  },
});

export const { actions: walletConnectionActions } = slice;

export const useWalletConnectionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: walletConnectionSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useWalletConnectionSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
