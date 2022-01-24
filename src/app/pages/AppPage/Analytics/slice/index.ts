import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { analyticsSaga } from './saga';
import { AnalyticsState, BidPool, LiquidationProfile } from './types';

export const initialState: AnalyticsState = {
  bidPools: [],
  liquidationProfile: [],
};

const slice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    getBidPool(state, action: PayloadAction) {
      state.bidPools = [];
    },
    getLiquidationProfile(state, action: PayloadAction) {
      state.liquidationProfile = [];
    },
    loaded(state, action: PayloadAction<BidPool[]>) {
      state.bidPools = action.payload;
    },
    liquidationProfileLoaded(
      state,
      action: PayloadAction<LiquidationProfile[]>,
    ) {
      state.liquidationProfile = action.payload;
    },
  },
});

export const { actions: analyticsActions } = slice;

export const useAnalyticsSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: analyticsSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useAnalyticsSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
