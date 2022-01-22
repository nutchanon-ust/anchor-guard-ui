/**
 *
 * NewBidForm
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import {
  CreateTxOptions,
  Dec,
  Fee,
  LCDClient,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import {
  ConnectedWallet,
  useConnectedWallet,
  useLCDClient,
} from '@terra-money/wallet-provider';
import {
  ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
  FALLBACK_GAS_PRICE_COLUMNBUS,
} from 'app/constants';
import { useMemo } from 'react';

interface Props {}

export function NewBidForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const connectedWallet = useConnectedWallet() as ConnectedWallet;
  const network = connectedWallet?.network;
  const lcd = useMemo(() => {
    if (!network) return;
    return new LCDClient({
      chainID: network.chainID,
      URL: network.lcd,
    });
  }, [network?.chainID, network?.lcd]);

  const [form] = Form.useForm();

  const postTx = async () => {
    if (!connectedWallet || !lcd) return;
    await form.validateFields();
    console.log(form.getFieldValue('premium'));
    const msg = new MsgExecuteContract(
      connectedWallet?.walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
      {
        submit_bid: {
          premium_slot: 4,
          collateral_token: 'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp',
        },
      },
      { uusd: 10000 },
    );
    const { auth_info } = await lcd.tx.create(
      [{ address: connectedWallet?.walletAddress }],
      {
        msgs: [msg],
        feeDenoms: ['uusd'],
        gasPrices: FALLBACK_GAS_PRICE_COLUMNBUS,
      },
    );
    const estimatedFeeGas = auth_info.fee.amount
      .toArray()
      .reduce((gas, coin) => {
        console.log(coin.denom);
        //@ts-ignore
        const price = FALLBACK_GAS_PRICE_COLUMNBUS[coin.denom];
        console.log(coin.amount.toString());
        console.log(price);
        return gas.add(coin.amount.div(price));
      }, new Dec(0));
    console.log('auth_info', auth_info);
    console.log('estimatedFeeGas', estimatedFeeGas.toString());
    const tx: CreateTxOptions = {
      msgs: [msg],
      fee: new Fee(estimatedFeeGas.toNumber(), auth_info.fee.amount),
    };
    try {
      const result = await connectedWallet.post(tx);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  };

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
