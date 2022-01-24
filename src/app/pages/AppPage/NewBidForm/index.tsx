/**
 *
 * NewBidForm
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Form, Button, InputNumber, Select, Typography } from 'antd';
import {
  BlockTxBroadcastResult,
  Coins,
  CreateTxOptions,
  Dec,
  Fee,
} from '@terra-money/terra.js';
import {
  ConnectedWallet,
  ConnectType,
  useConnectedWallet,
  useLCDClient,
} from '@terra-money/wallet-provider';
import { APP_MEMO, BETH_ADDRESS, BLUNA_ADDRESS } from 'app/constants';
import { useCallback, useEffect } from 'react';
import {
  estimateGasFee,
  fabricateNewBid,
  validateBroadcastResult,
} from 'utils/tx-helper';
import { parseUnits } from 'ethers/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useNewBidSlice } from './slice';
import { selectCollateralToken, selectUserUstBalance } from './slice/selectors';
import { useMyBidsSlice } from '../MyBids/slice';
import { useTransactionLoadingModalSlice } from 'app/components/TransactionLoadingModal/slice';

const { Title } = Typography;

interface Props {}

export function NewBidForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const connectedWallet = useConnectedWallet() as ConnectedWallet;
  const walletAddress = connectedWallet?.walletAddress;
  const network = connectedWallet?.network;
  const lcd = useLCDClient();
  const collateralToken = useSelector(selectCollateralToken);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useNewBidSlice();
  const { actions: myBidsActions } = useMyBidsSlice();
  const { actions: transactionLoadingModalActions } =
    useTransactionLoadingModalSlice();

  const fetchBalance = useCallback(async () => {
    if (!lcd) return;
    const [coins, pagination] = await lcd.bank.balance(
      connectedWallet?.walletAddress,
    );
    if (coins) {
      const ustCoin = coins.toArray().find(each => each.denom === 'uusd');
      dispatch(actions.setUserUstBalance(ustCoin?.amount.toNumber() || 0));
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    if (network) dispatch(actions.setCollateralToken(BLUNA_ADDRESS(network)));
  }, [network]);

  const postTx = async () => {
    if (!connectedWallet || !lcd || !collateralToken) return;
    await form.validateFields();
    const premium = Number(form.getFieldValue('premium'));
    const ustAmount = parseUnits(
      String(form.getFieldValue('bidAmount')),
      6,
    ).toNumber();
    const msgs = fabricateNewBid(
      network,
      walletAddress,
      premium,
      collateralToken,
      ustAmount,
    );
    let estimatedFeeGas: Dec, coinAmount: Coins;
    try {
      ({ estimatedFeeGas, coinAmount } = await estimateGasFee(
        connectedWallet.network,
        walletAddress,
        msgs,
        lcd,
      ));
    } catch (e) {
      dispatch(
        transactionLoadingModalActions.setError(
          //@ts-ignore
          JSON.stringify(e.response.data),
        ),
      );
      dispatch(transactionLoadingModalActions.stopLoading());
      return;
    }
    const tx: CreateTxOptions = {
      msgs,
      fee: new Fee(estimatedFeeGas.toNumber(), coinAmount),
      memo: APP_MEMO,
    };
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
          dispatch(myBidsActions.load());
        }
        dispatch(transactionLoadingModalActions.stopLoading());
      } else if (connectedWallet.connectType === ConnectType.WALLETCONNECT) {
        const result = await connectedWallet.post(tx);
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

  const handleValuesChange = ({ collateralToken }) => {
    if (collateralToken) {
      dispatch(actions.setCollateralToken(collateralToken));
    }
  };

  const userUstBalance = useSelector(selectUserUstBalance);
  return (
    <>
      <Title level={3}>New Bid</Title>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        initialValues={{
          premium: 1,
          bidAmount: 0,
          collateralToken: BLUNA_ADDRESS(network),
        }}
        autoComplete="off"
        onValuesChange={handleValuesChange}
      >
        <Form.Item label="Collateral Asset" name="collateralToken">
          <Select>
            <Select.Option value={BLUNA_ADDRESS(network)}>bLUNA</Select.Option>
            <Select.Option value={BETH_ADDRESS(network)}>bETH</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Premium"
          name="premium"
          rules={[
            { required: true, message: 'Please specify Premium for your bid.' },
          ]}
        >
          <InputNumber
            addonAfter="%"
            min={0}
            max={30}
            autoComplete="off"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Bid Amount"
          name="bidAmount"
          rules={[{ required: true, message: 'Please input your Bid Amount.' }]}
        >
          <InputNumber
            addonAfter="UST"
            min={0.000001}
            max={userUstBalance}
            style={{ width: '100%' }}
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={postTx}>
            Place New Bid
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

const Div = styled.div``;
