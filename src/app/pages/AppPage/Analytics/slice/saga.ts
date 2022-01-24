import { LCDClient } from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/wallet-provider';
import {
  selectLCDClient,
  selectNetwork,
} from 'app/components/WalletSelector/slice/selectors';
import {
  ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
  BLUNA_MAINNET_ADDRESS,
} from 'app/constants';
import { formatUnits } from 'ethers/lib/utils';
import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'utils/request';
import { analyticsActions as actions } from '.';
import { selectWalletAddress } from '../../MyBids/slice/selectors';
import { selectCollateralToken } from '../../NewBidForm/slice/selectors';
import { LiquidationProfile } from './types';

// function* doSomething() {}
export function* getLiquidationProfile() {
  try {
    const liq: LiquidationProfile[] = yield call(
      request,
      'https://api.alphadefi.fund/historical/kujira/profile',
    );
    yield put(actions.liquidationProfileLoaded(liq));
  } catch (e) {
    yield put(actions.liquidationProfileLoaded([]));
  }
}

export function* getBidPool() {
  const lcd: LCDClient = yield select(selectLCDClient);
  const collateralToken: string =
    (yield select(selectCollateralToken)) || BLUNA_MAINNET_ADDRESS;
  const network: NetworkInfo = yield select(selectNetwork);
  if (collateralToken) {
    const result = yield Promise.all(
      Array.from(Array(31).keys()).map(slot => {
        return lcd.wasm.contractQuery(
          ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),
          {
            bid_pool: {
              collateral_token: collateralToken,
              bid_slot: slot,
            },
          },
        );
      }),
    );
    yield put(
      actions.loaded(
        result.map((each, index) => {
          return {
            premium: index,
            totalBidAmount: each.total_bid_amount / 1e6,
          };
        }),
      ),
    );
  }
}

export function* analyticsSaga() {
  yield takeLatest(actions.getBidPool.type, getBidPool);
  yield takeLatest(actions.getLiquidationProfile.type, getLiquidationProfile);
}
