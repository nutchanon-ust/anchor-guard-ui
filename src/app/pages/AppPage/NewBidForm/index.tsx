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
import { CreateTxOptions, MsgExecuteContract } from '@terra-money/terra.js';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS } from 'app/constants';
import { useCallback } from 'react';

interface Props {}

export function NewBidForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const connectedWallet = useConnectedWallet() as ConnectedWallet;
  console.log('connectedWallet', connectedWallet);

  const [form] = Form.useForm();
  console.log('form', form);

  const postTx = async () => {
    console.log('postTx');
    console.log('connectedWallet', connectedWallet);
    if (!connectedWallet) return;
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
    const tx: CreateTxOptions = {
      msgs: [msg],
    };
    const result = await connectedWallet.post(tx);
    console.log(result);
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
