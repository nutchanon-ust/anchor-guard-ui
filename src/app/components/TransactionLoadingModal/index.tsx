/**
 *
 * TransactionLoadingModal
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectErrorMessage,
  selectIsError,
  selectLoaded,
  selectLoading,
} from './slice/selectors';
import { useTransactionLoadingModalSlice } from './slice';
import { Result, Button, Typography } from 'antd';

const { Paragraph, Text } = Typography;

interface Props {}

export function TransactionLoadingModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const loading = useSelector(selectLoading);
  const loaded = useSelector(selectLoaded);
  const dispatch = useDispatch();
  const { actions } = useTransactionLoadingModalSlice();

  const isError = useSelector(selectIsError);
  const errorMessage = useSelector(selectErrorMessage);

  const handleCancel = () => {
    dispatch(actions.closeModal());
  };
  return (
    <Modal visible={loading || loaded} footer={<></>} onCancel={handleCancel}>
      {!isError && loading && <p>Waiting for confirmation...</p>}
      {!isError && !loading && (
        <Result status="success" title="Transaction Confirmed!" />
      )}
      {isError && (
        <Result status="error" title="Transaction Failed">
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                Transaction failed with the following error:
              </Text>
            </Paragraph>
            <Paragraph>{errorMessage}</Paragraph>
          </div>
        </Result>
      )}
    </Modal>
  );
}

const Div = styled.div``;
