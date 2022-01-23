import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { Row, Col, Typography, Layout, Alert } from 'antd';
import { MyBids } from './MyBids';
import { NewBidForm } from './NewBidForm';
import { TransactionLoadingModal } from 'app/components/TransactionLoadingModal';
import styled from 'styled-components';

const { Title } = Typography;
const { Footer } = Layout;

export function AppPage() {
  return (
    <>
      <Alert
        message="Anchor Guard or any website will never ask for your seed phrase/mnemonic keys. Do not ever give them to any one."
        type="warning"
        showIcon
        closable
      />

      <Helmet>
        <title>Anchor Guard</title>
        <meta
          name="description"
          content="Anchor Liquidation Queue User Interface; Open Source, Free to Use and
          No Fee"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Title level={5}>
          Anchor Liquidation Queue User Interface; Open Source, Free to Use and
          No Fee
        </Title>
        <NewBidForm />
        <MyBids />
        <TransactionLoadingModal />
        <Footer style={{ textAlign: 'center' }}>
          Created by nutchanon.ust |{' '}
          <a
            href="https://finder.terra.money/mainnet/address/terra18w0466472xxwkwe4dvketx345h4c7eg5ypcmza"
            target={'_blank'}
            rel="noreferrer"
          >
            Donate
          </a>{' '}
          |{' '}
          <a
            href="https://github.com/nutchanon-ust/anchor-guard-ui"
            target={'_blank'}
            rel="noreferrer"
          >
            GitHub
          </a>
          | Logo taken from{' '}
          <a href="https://astroport.fi/" target={'_blank'} rel="noreferrer">
            Astroport
          </a>
        </Footer>
      </PageWrapper>
    </>
  );
}

const Description = styled.div`
  font-weight: normal;
`;
