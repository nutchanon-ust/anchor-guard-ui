import * as React from 'react';
import styled from 'styled-components/macro';
import { Logo } from './Logo';
import { StyleConstants } from 'styles/StyleConstants';
import { Nav } from './Nav';
import { PageWrapper } from '../PageWrapper';
import { WalletSelector } from '../WalletSelector';
import { Row, Col } from 'antd';

export function NavBar() {
  return (
    <Wrapper>
      <Row>
        <Col span={12}>
          <Logo />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <WalletSelector />
        </Col>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-shadow: 0 1px 0 0 ${p => p.theme.borderLight};
  height: ${StyleConstants.NAV_BAR_HEIGHT};
  display: block;
  position: fixed;
  padding: 15px;
  top: 0;
  width: 100%;
  z-index: 2;

  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
    background-color: ${p =>
      p.theme.background.replace(
        /rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/,
        'rgba$1,0.75)',
      )};
  }
`;
