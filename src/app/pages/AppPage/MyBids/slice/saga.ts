import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { myBidsActions as actions } from '.';
import { LCDClient } from '@terra-money/terra.js';
import { formatUnits } from 'ethers/lib/utils';
import { ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS } from 'app/constants';

export function* getMyBids() {
  console.log('terra');
  const terra = new LCDClient({
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5',
  });

  const result = yield terra.wasm.contractQuery(
    ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
    {
      bids_by_user: {
        collateral_token: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
        bidder: 'terra1f0qcsymjggykf9dqgte2dgeyjn8p4slvjleweg',
      },
    }, // query msg
  );
  if (result) {
    console.log(result);
    yield put(
      actions.loaded(
        result.bids.map(each => ({
          id: each.idx,
          premium: `${each.premium_slot}%`,
          bidRemaining: formatUnits(each.amount, 6),
          bidStatus: each.wait_end === null ? 'Active' : 'Pending',
          amountFilled: formatUnits(each.pending_liquidated_collateral, 6),
        })),
      ),
    );
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
