import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoading,
  selectMyBids,
  selectWalletAddress,
} from './slice/selectors';
import { useMyBidsSlice } from './slice';
import { Table, Button, Row, Col, Typography } from 'antd';
import {
  ConnectType,
  useConnectedWallet,
  useLCDClient,
} from '@terra-money/wallet-provider';
import {
  estimateGasFee,
  fabricateActivateBid,
  fabricateCancelBid,
  fabricateClaimBid,
  validateBroadcastResult,
} from 'utils/tx-helper';
import { CreateTxOptions, Fee, LCDClient } from '@terra-money/terra.js';
import { Bid } from './slice/types';
import { selectCollateralToken } from '../NewBidForm/slice/selectors';
import { useTransactionLoadingModalSlice } from 'app/components/TransactionLoadingModal/slice';
import { APP_MEMO } from 'app/constants';

const { Title } = Typography;
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
      memo: APP_MEMO,
    };
    handleBroadcastTx(connectedWallet, tx);
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
      memo: APP_MEMO,
    };
    handleBroadcastTx(connectedWallet, tx);
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
      memo: APP_MEMO,
    };
    handleBroadcastTx(connectedWallet, tx);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(actions.updateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const handleActivateAll = async () => {
    if (!walletAddress || !connectedWallet || !collateralToken || !network)
      return;
    const activatableBidIds = myBids
      .filter(each => each.waitEnd !== null && each.timeLeft === 0)
      .map(each => each.id);
    if (activatableBidIds.length === 0) return;
    const msgs = fabricateActivateBid(
      network,
      walletAddress,
      activatableBidIds,
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
      memo: APP_MEMO,
    };
    handleBroadcastTx(connectedWallet, tx);
  };

  const handleClaimAll = async () => {
    if (!walletAddress || !connectedWallet || !collateralToken || !network)
      return;
    const msgs = fabricateClaimBid(
      network,
      walletAddress,
      null,
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
      memo: APP_MEMO,
    };
    handleBroadcastTx(connectedWallet, tx);
  };

  const handleBroadcastTx = async (connectedWallet, tx) => {
    try {
      if (connectedWallet.connectType === ConnectType.EXTENSION) {
        const signResult = await connectedWallet.sign(tx);
        dispatch(transactionLoadingModalActions.startLoading());
        const { isError, errorMessage } = validateBroadcastResult(
          await lcd.tx.broadcast(signResult.result),
        );
        if (isError) {
          dispatch(transactionLoadingModalActions.setError(errorMessage));
        } else {
          dispatch(actions.load());
        }
        dispatch(transactionLoadingModalActions.stopLoading());
      } else if (connectedWallet.connectType === ConnectType.WALLETCONNECT) {
        const result = await connectedWallet.post(tx);
        console.log(result);
        if (result.success) {
          dispatch(transactionLoadingModalActions.stopLoading());
        }
      }
    } catch (e) {
      console.error(e);
      dispatch(transactionLoadingModalActions.setError(JSON.stringify(e)));
      dispatch(transactionLoadingModalActions.stopLoading());
    }
  };

  return (
    <>
      <Title level={2}>My Bids</Title>
      <div style={{ textAlign: 'right' }}>
        <Button
          style={{ margin: '5px' }}
          onClick={handleActivateAll}
          type="primary"
        >
          Activate All
        </Button>
        <Button style={{ margin: '5px' }} onClick={handleClaimAll}>
          Claim All
        </Button>
      </div>
      <Table dataSource={myBids} rowKey={bid => bid.id} scroll={{ x: 1300 }}>
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
          fixed="right"
          width={200}
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
