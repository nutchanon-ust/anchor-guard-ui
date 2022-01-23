import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { myBidsActions as actions } from '.';
import { LCDClient } from '@terra-money/terra.js';
import { formatUnits } from 'ethers/lib/utils';
import { ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS } from 'app/constants';
import { selectWalletAddress } from './selectors';
import { selectCollateralToken } from '../../NewBidForm/slice/selectors';
import { NetworkInfo } from '@terra-money/wallet-provider';
import {
  selectLCDClient,
  selectNetwork,
} from 'app/components/WalletSelector/slice/selectors';

export function* getMyBids() {
  const lcd: LCDClient = yield select(selectLCDClient);
  const walletAddress: string = yield select(selectWalletAddress);
  const collateralToken: string = yield select(selectCollateralToken);
  const network: NetworkInfo = yield select(selectNetwork);
  if (walletAddress) {
    const result = yield lcd.wasm.contractQuery(
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),
      {
        bids_by_user: {
          collateral_token: collateralToken,
          bidder: walletAddress,
        },
      }, // query msg
    );
    if (result) {
      yield put(
        actions.loaded(
          result.bids.map(each => ({
            id: each.idx,
            premium: each.premium_slot,
            bidRemaining: Number(formatUnits(each.amount, 6)),
            bidStatus: each.wait_end === null ? 'Active' : 'Pending',
            amountFilled: Number(
              formatUnits(each.pending_liquidated_collateral, 6),
            ),
            waitEnd: each.wait_end,
          })),
        ),
      );
    } else {
      yield put(actions.loaded([]));
    }
  } else {
    yield put(actions.loaded([]));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* myBidsSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.load.type, getMyBids);
}
