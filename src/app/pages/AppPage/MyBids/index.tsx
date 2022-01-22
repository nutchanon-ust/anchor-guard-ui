import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoading, selectMyBids } from './slice/selectors';
import { useMyBidsSlice } from './slice';
import { Table, Button } from 'antd';

const { Column } = Table;

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
              <Action type="primary">Activate</Action>
            )}
            <Action danger>Cancel</Action>
          </>
        )}
      />
    </Table>
  );
}

const Action = styled(Button)`
  margin: 5px;
`;
