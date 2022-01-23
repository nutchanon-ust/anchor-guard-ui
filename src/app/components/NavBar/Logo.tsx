import * as React from 'react';
import styled from 'styled-components/macro';

export function Logo() {
  return (
    <Wrapper>
      <div className="logo">
        <img
          style={{ width: '2em', marginRight: '5px' }}
          src="https://astroport.fi/anchor.png"
          alt="logo"
        />
      </div>
      <Title>Anchor Guard</Title>
      <Description>Anchor Liquidation Queue UI</Description>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 1.25rem;
  color: ${p => p.theme.text};
  font-weight: bold;
  margin-right: 1rem;
`;

const Description = styled.div`
  font-size: 0.875rem;
  color: ${p => p.theme.textSecondary};
  font-weight: normal;
`;
