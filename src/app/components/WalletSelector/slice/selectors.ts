import { createSelector } from '@reduxjs/toolkit';
import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/wallet-provider';

import { RootState } from 'types';
import { initialState } from '.';

const selectSlice = (state: RootState) =>
  state.walletConnection || initialState;

export const selectWalletConnection = createSelector(
  [selectSlice],
  state => state,
);

export const selectNetwork = createSelector(
  [selectSlice],
  state => JSON.parse(state.network) as NetworkInfo,
);

export const selectLCDClient = createSelector(
  [selectSlice],
  state =>
    new LCDClient({
      URL: state.lcdUrl,
      chainID: state.lcdChainId,
    }) as LCDClient,
);
