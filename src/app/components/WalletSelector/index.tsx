/**
 *
 * WalletSelector
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Button, Modal } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import { useState } from 'react';

interface Props {}

export function WalletSelector(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const {
    status,
    connect,
    disconnect,
    connection,
    wallets,
    network,
    availableConnectTypes,
    availableConnections,
    availableInstallations,
    supportFeatures,
  } = useWallet();

  const [isConnectWalletModalVisible, setIsConnectWalletModalVisible] =
    useState(false);

  const showConnectWalletModal = () => {
    setIsConnectWalletModalVisible(true);
  };

  const handleCancel = () => {
    setIsConnectWalletModalVisible(false);
  };

  const [isWalletInfoModalVisible, setIsWalletInfoModalVisible] =
    useState(false);

  const showWalletInfoModal = () => {
    setIsWalletInfoModalVisible(true);
  };

  const handleCancelWalletInfo = () => {
    setIsWalletInfoModalVisible(false);
  };

  console.log('availableConnections', availableConnections);
  switch (status) {
    case WalletStatus.INITIALIZING:
      return <div>Initializing</div>;
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
        <div>
          <Button
            type="primary"
            onClick={showConnectWalletModal}
            shape="round"
            icon={<WalletOutlined />}
          >
            Connect Wallet
          </Button>
          <Modal
            title="Connect Wallet"
            visible={isConnectWalletModalVisible}
            onCancel={handleCancel}
          >
            {availableConnections
              .filter(({ type }) => type !== ConnectType.READONLY)
              .map(({ type, icon, name, identifier }) => (
                <Button
                  onClick={() => {
                    connect(type, identifier);
                  }}
                  block
                  shape="round"
                  style={{ margin: '5px' }}
                  icon={
                    <img
                      alt={name}
                      style={{
                        width: '1em',
                        height: '1em',
                        marginRight: '5px',
                      }}
                      src={icon}
                    ></img>
                  }
                >
                  {name}
                </Button>
              ))}
          </Modal>
        </div>
      );
    case WalletStatus.WALLET_CONNECTED:
      return (
        <>
          <Button
            onClick={showWalletInfoModal}
            type="primary"
            shape="round"
            icon={<WalletOutlined />}
          >
            {truncate(wallets[0].terraAddress)}
          </Button>
          <Modal
            title="Wallet"
            visible={isWalletInfoModalVisible}
            onCancel={handleCancelWalletInfo}
            footer={[<Button onClick={disconnect}>Disconnect</Button>]}
          >
            <div>{wallets[0].terraAddress}</div>
          </Modal>
        </>
      );
  }
}

function truncate(
  text: string = '',
  [h, t]: [number, number] = [6, 6],
): string {
  const head = text.slice(0, h);
  const tail = text.slice(-1 * t, text.length);
  return text.length > h + t ? [head, tail].join('...') : text;
}
