import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectMyBids,
  selectWalletAddress,
} from './slice/selectors';
import { useMyBidsSlice } from './slice';
import { Table, Button } from 'antd';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import {
  estimateGasFee,
  fabricateActivateBid,
  fabricateCancelBid,
} from 'utils/tx-helper';
import { CreateTxOptions, Fee, LCDClient } from '@terra-money/terra.js';
import { BLUNA_TESTNET_ADDRESS } from 'app/constants';

const { Column } = Table;

export function MyBids() {
  const { actions } = useMyBidsSlice();
  const connectedWallet = useConnectedWallet();
  const network = connectedWallet?.network;
  const lcd = useLCDClient();

  const myBids = useSelector(selectMyBids);
  const isLoading = useSelector(selectLoading);
  const walletAddress = useSelector(selectWalletAddress);

  const dispatch = useDispatch();

  const useEffectOnMount = (effect: React.EffectCallback) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, []);
  };

  useEffectOnMount(() => {
    // When initial state username is not null, submit the form to load repos
    if (myBids?.length === 0) {
      dispatch(actions.load());
    }
  });

  useEffect(() => {
    if (connectedWallet && connectedWallet.walletAddress !== walletAddress) {
      dispatch(actions.changeWalletAddress(connectedWallet.walletAddress));
      dispatch(actions.load());
    } else if (!connectedWallet && walletAddress !== null) {
      dispatch(actions.changeWalletAddress(null));
      dispatch(actions.load());
    }
  });

  const handleActivateBid = async bidIdx => {
    if (!walletAddress || !connectedWallet) return;
    const msgs = fabricateActivateBid(
      walletAddress,
      [bidIdx],
      BLUNA_TESTNET_ADDRESS,
    );
    const { estimatedFeeGas, coinAmount } = await estimateGasFee(
      connectedWallet.network,
      walletAddress,
      msgs,
      lcd,
    );
    const tx: CreateTxOptions = {
      msgs,
      fee: new Fee(estimatedFeeGas.toNumber(), coinAmount),
    };
    try {
      const result = await connectedWallet.post(tx);
      console.log(result);
      dispatch(actions.load());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelBid = async bidIdx => {
    if (!walletAddress || !connectedWallet) return;
    const msgs = fabricateCancelBid(walletAddress, bidIdx);
    const { estimatedFeeGas, coinAmount } = await estimateGasFee(
      connectedWallet.network,
      walletAddress,
      msgs,
      lcd,
    );
    const tx: CreateTxOptions = {
      msgs,
      fee: new Fee(estimatedFeeGas.toNumber(), coinAmount),
    };
    try {
      const result = await connectedWallet.post(tx);
      console.log(result);
      dispatch(actions.load());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Table dataSource={myBids} rowKey={bid => bid.id}>
      <Column title="Premium" dataIndex="premium" key="premium" />
      <Column
        title="Bid Remaining"
        dataIndex="bidRemaining"
        key="bidRemaining"
      />
      <Column title="Bid Status" dataIndex="bidStatus" key="bidStatus" />
      <Column
        title="Amount Filled"
        dataIndex="amountFilled"
        key="amountFilled"
      />
      <Column
        title="Action"
        key="action"
        render={(text, record: any) => (
          <>
            {record.bidStatus !== 'Active' && (
              <Action
                type="primary"
                onClick={() => handleActivateBid(record.id)}
              >
                Activate
              </Action>
            )}
            <Action danger onClick={() => handleCancelBid(record.id)}>
              Cancel
            </Action>
          </>
        )}
      />
    </Table>
  );
}

const Action = styled(Button)`
  margin: 5px;
`;
function useMemo(arg0: () => any, arg1: any[]) {
  throw new Error('Function not implemented.');
}
