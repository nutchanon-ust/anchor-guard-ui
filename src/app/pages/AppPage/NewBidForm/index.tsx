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

interface Props {}

export function NewBidForm(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      initialValues={{ remember: true }}
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
          defaultValue={1}
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
          defaultValue={0}
          min={0}
          style={{ width: '100%' }}
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const Div = styled.div``;
