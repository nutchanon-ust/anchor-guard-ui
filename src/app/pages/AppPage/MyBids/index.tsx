import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectMyBids,
  selectWalletAddress,
} from './slice/selectors';
import { useMyBidsSlice } from './slice';
import { Table, Button, Row, Col } from 'antd';
import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';
import {
  estimateGasFee,
  fabricateActivateBid,
  fabricateCancelBid,
  fabricateClaimBid,
} from 'utils/tx-helper';
import { CreateTxOptions, Fee, LCDClient } from '@terra-money/terra.js';
import { Bid } from './slice/types';
import { selectCollateralToken } from '../NewBidForm/slice/selectors';
import { useTransactionLoadingModalSlice } from 'app/components/TransactionLoadingModal/slice';

const { Column } = Table;

export function MyBids() {
  const { actions } = useMyBidsSlice();
  const { actions: transactionLoadingModalActions } =
    useTransactionLoadingModalSlice();
  const connectedWallet = useConnectedWallet();
  const network = connectedWallet?.network;
  const lcd = useLCDClient();

  const myBids = useSelector(selectMyBids);
  const isLoading = useSelector(selectLoading);
  const walletAddress = useSelector(selectWalletAddress);
  const collateralToken = useSelector(selectCollateralToken);

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

  useEffect(() => {
    dispatch(actions.load());
  }, [collateralToken]);

  const handleActivateBid = async bidIdx => {
    if (!walletAddress || !connectedWallet || !collateralToken || !network)
      return;
    const msgs = fabricateActivateBid(
      network,
      walletAddress,
      [bidIdx],
      collateralToken,
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
      const signResult = await connectedWallet.sign(tx);
      dispatch(transactionLoadingModalActions.startLoading());
      await lcd.tx.broadcast(signResult.result);
      dispatch(transactionLoadingModalActions.stopLoading());
      dispatch(actions.load());
    } catch (e) {
      console.error(e);
      dispatch(transactionLoadingModalActions.stopLoading());
    }
  };

  const handleCancelBid = async bidIdx => {
    if (!walletAddress || !connectedWallet || !network) return;
    const msgs = fabricateCancelBid(network, walletAddress, bidIdx);
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
      const signResult = await connectedWallet.sign(tx);
      dispatch(transactionLoadingModalActions.startLoading());
      await lcd.tx.broadcast(signResult.result);
      dispatch(transactionLoadingModalActions.stopLoading());
      dispatch(actions.load());
    } catch (e) {
      console.error(e);
      dispatch(transactionLoadingModalActions.stopLoading());
    }
  };

  const handleClaimBid = async bidIdx => {
    if (!walletAddress || !connectedWallet || !collateralToken || !network)
      return;
    const msgs = fabricateClaimBid(
      network,
      walletAddress,
      [bidIdx],
      collateralToken,
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
      const signResult = await connectedWallet.sign(tx);
      dispatch(transactionLoadingModalActions.startLoading());
      await lcd.tx.broadcast(signResult.result);
      dispatch(transactionLoadingModalActions.stopLoading());
      dispatch(actions.load());
    } catch (e) {
      console.error(e);
      dispatch(transactionLoadingModalActions.stopLoading());
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(actions.updateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <>
      <h1>My Bids</h1>
      <Table dataSource={myBids} rowKey={bid => bid.id}>
        <Column
          title="Premium"
          dataIndex="premium"
          key="premium"
          render={text => `${text}%`}
          sortDirections={['ascend', 'descend']}
          sorter={(a: Bid, b: Bid) => {
            return a.premium - b.premium;
          }}
          defaultSortOrder={'ascend'}
        />
        <Column
          title="Bid Remaining"
          dataIndex="bidRemaining"
          key="bidRemaining"
          sortDirections={['ascend', 'descend']}
          sorter={(a: Bid, b: Bid) => {
            return a.bidRemaining - b.bidRemaining;
          }}
        />
        <Column
          title="Bid Status"
          dataIndex="bidStatus"
          key="bidStatus"
          sorter={(a: Bid, b: Bid) => {
            return a.bidStatus > b.bidStatus ? 1 : -1;
          }}
        />
        <Column
          title="Amount Filled"
          dataIndex="amountFilled"
          key="amountFilled"
          sorter={(a: Bid, b: Bid) => {
            return a.amountFilled - b.amountFilled;
          }}
        />
        <Column
          title="Action"
          key="action"
          width={50}
          render={(text, record: any) => (
            <Row>
              {record.bidStatus !== 'Active' && (
                <Col span={24}>
                  <Action
                    type="primary"
                    loading={record.timeLeft > 0}
                    onClick={() => handleActivateBid(record.id)}
                  >
                    {record.timeLeft > 0
                      ? `Activate in ${record.timeLeft}s`
                      : `Activate`}
                  </Action>
                </Col>
              )}
              {record.amountFilled > 0 && (
                <Col span={24}>
                  <Action onClick={() => handleClaimBid(record.id)}>
                    Claim
                  </Action>
                </Col>
              )}
              {record.amountFilled == 0 && (
                <Col span={24}>
                  <Action danger onClick={() => handleCancelBid(record.id)}>
                    Cancel
                  </Action>
                </Col>
              )}
            </Row>
          )}
        />
      </Table>
    </>
  );
}

const Action = styled(Button)`
  margin: 5px;
  width: 100%;
`;
function useMemo(arg0: () => any, arg1: any[]) {
  throw new Error('Function not implemented.');
}
