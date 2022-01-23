import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { myBidsActions as actions } from '.';
import { LCDClient } from '@terra-money/terra.js';
import { formatUnits } from 'ethers/lib/utils';
import {
  ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
  ANCHOR_LIQUIDATION_QUEUE_TESTNET_CONTRACT_ADDRESS,
  BLUNA_TESTNET_ADDRESS,
  TESTNET_CHAIN_ID,
  TESTNET_LCD_URL,
} from 'app/constants';
import { selectWalletAddress } from './selectors';

export function* getMyBids() {
  console.log('terra');
  const terra = new LCDClient({
    URL: TESTNET_LCD_URL,
    chainID: TESTNET_CHAIN_ID,
  });

  const walletAddress: string = yield select(selectWalletAddress);
  if (walletAddress) {
    const result = yield terra.wasm.contractQuery(
      ANCHOR_LIQUIDATION_QUEUE_TESTNET_CONTRACT_ADDRESS,
      {
        bids_by_user: {
          collateral_token: BLUNA_TESTNET_ADDRESS,
          bidder: walletAddress,
        },
      }, // query msg
    );
    if (result) {
      console.log(result);
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
