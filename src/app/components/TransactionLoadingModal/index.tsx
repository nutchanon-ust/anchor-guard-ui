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
import { selectLoading } from './slice/selectors';
import { useTransactionLoadingModalSlice } from './slice';

interface Props {}

export function TransactionLoadingModal(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const { actions } = useTransactionLoadingModalSlice();

  const handleCancel = () => {
    dispatch(actions.stopLoading());
  };
  return (
    <Modal visible={loading} footer={<></>} onCancel={handleCancel}>
      <p>Waiting for confirmation...</p>
    </Modal>
  );
}

const Div = styled.div``;
