/**
 *
 * NewBidForm
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Form, Button, InputNumber } from 'antd';
import { CreateTxOptions, Fee, LCDClient } from '@terra-money/terra.js';
import {
  ConnectedWallet,
  useConnectedWallet,
  useLCDClient,
} from '@terra-money/wallet-provider';
import { BLUNA_ADDRESS, BLUNA_TESTNET_ADDRESS } from 'app/constants';
import { useCallback, useEffect, useMemo } from 'react';
import { estimateGasFee, fabricateNewBid } from 'utils/tx-helper';
import { parseUnits } from 'ethers/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useNewBidSlice } from './slice';
import { selectUserUstBalance } from './slice/selectors';

interface Props {}

export function NewBidForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const connectedWallet = useConnectedWallet() as ConnectedWallet;
  const walletAddress = connectedWallet?.walletAddress;
  const network = connectedWallet?.network;
  const lcd = useLCDClient();

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { actions } = useNewBidSlice();
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

  const postTx = async () => {
    if (!connectedWallet || !lcd) return;
    await form.validateFields();
    const premium = Number(form.getFieldValue('premium'));
    const ustAmount = parseUnits(
      String(form.getFieldValue('bidAmount')),
      6,
    ).toNumber();
    const msgs = fabricateNewBid(
      walletAddress,
      premium,
      BLUNA_TESTNET_ADDRESS,
      ustAmount,
    );
    const { estimatedFeeGas, coinAmount } = await estimateGasFee(
      connectedWallet.network,
      walletAddress,
      msgs,
      lcd,
    );
    console.log('estimatedFeeGas, coinAmount', estimatedFeeGas, coinAmount);
    const tx: CreateTxOptions = {
      msgs,
      fee: new Fee(estimatedFeeGas.toNumber(), coinAmount),
    };
    try {
      const result = await connectedWallet.post(tx);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  };

  const userUstBalance = useSelector(selectUserUstBalance);
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 4 }}
      initialValues={{ premium: 1, bidAmount: 0 }}
      autoComplete="off"
    >
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
          min={0}
          max={userUstBalance}
          style={{ width: '100%' }}
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={postTx}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const Div = styled.div``;
