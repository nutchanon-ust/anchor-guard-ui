import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { Row, Col } from 'antd';
import { MyBids } from './MyBids';
import { NewBidForm } from './NewBidForm';

export function AppPage() {
  return (
    <>
      <Helmet>
        <title>App Page</title>
        <meta
          name="description"
          content="A React Boilerplate application homepage"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <NewBidForm />
        <MyBids />
      </PageWrapper>
    </>
  );
}
