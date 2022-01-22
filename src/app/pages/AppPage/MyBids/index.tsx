import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoading, selectMyBids } from './slice/selectors';
import { useMyBidsSlice } from './slice';
import { Table } from 'antd';

const columns = [
  {
    title: 'Premium',
    dataIndex: 'premium',
    key: 'premium',
  },
  {
    title: 'Bid Remaining',
    dataIndex: 'bidRemaining',
    key: 'bidRemaining',
  },
  {
    title: 'Bid Status',
    dataIndex: 'bidStatus',
    key: 'bidStatus',
  },
  {
    title: 'Amount Filled',
    dataIndex: 'amountFilled',
    key: 'amountFilled',
  },
];

export function MyBids() {
  const { actions } = useMyBidsSlice();

  const myBids = useSelector(selectMyBids);
  const isLoading = useSelector(selectLoading);

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

  return <Table dataSource={myBids} columns={columns} />;
}
