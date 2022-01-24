/**
 *
 * Analytics
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { Column } from '@ant-design/plots';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAnalyticsSlice } from './slice';
import { selectCollateralToken } from '../NewBidForm/slice/selectors';
import {
  selectBidPools,
  selectLiquidationProfile,
  selectLunaPrice,
} from './slice/selectors';
import { Col, InputNumber, Row, Statistic, Typography } from 'antd';
import { BLUNA_ADDRESS } from 'app/constants';
import { selectNetwork } from 'app/components/WalletSelector/slice/selectors';
import { BidPool } from './slice/types';

const { Title } = Typography;

interface Props {}

export function Analytics(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useAnalyticsSlice();
  const network = useSelector(selectNetwork);
  const collateralToken = useSelector(selectCollateralToken);
  const liquidationProfile = useSelector(selectLiquidationProfile);
  const lunaPrice = useSelector(selectLunaPrice);
  const bidPools = useSelector(selectBidPools);
  let data: BidPool[] = [];
  let config: any;
  let expectedLiquidatedLoanValue = 0;

  if (liquidationProfile?.length > 0) {
    expectedLiquidatedLoanValue = liquidationProfile
      .filter(liq => {
        return liq.Luna_Liquidation_Price > lunaPrice;
      })
      .reduce((sum, liq) => {
        return sum + liq.Loan_Value;
      }, 0);
    let liquidatedLoanValueRemaining = expectedLiquidatedLoanValue;
    bidPools.forEach(pool => {
      const left = liquidatedLoanValueRemaining - pool.totalBidAmount;
      data.push({
        premium: pool.premium,
        totalBidAmount:
          left > 0 ? pool.totalBidAmount : liquidatedLoanValueRemaining,
        type: 'Filled Bid',
      });
      data.push({
        premium: pool.premium,
        totalBidAmount:
          left > 0 ? 0 : pool.totalBidAmount - liquidatedLoanValueRemaining,
        type: 'Remaining Bid',
      });

      liquidatedLoanValueRemaining = left > 0 ? left : 0;
    });

    config = {
      data,
      isStack: true,
      height: 400,
      xField: 'premium',
      yField: 'totalBidAmount',
      seriesField: 'type',
      color: ['#a61d24', '#19CDD7'],
      tooltip: {
        title: oldTitle => {
          return `${oldTitle}%`;
        },
        customItems: original => {
          const newTitleItems = original.slice();
          newTitleItems[0].value = Number(
            newTitleItems[0].value,
          ).toLocaleString();
          return newTitleItems;
        },
      },
    };
  } else {
    data = bidPools;
    config = {
      data,
      isStack: true,
      height: 400,
      xField: 'premium',
      yField: 'totalBidAmount',
      tooltip: {
        title: oldTitle => {
          return `${oldTitle}%`;
        },
        customItems: original => {
          const newTitleItems = original.slice();
          newTitleItems[0].value = Number(
            newTitleItems[0].value,
          ).toLocaleString();
          return newTitleItems;
        },
      },
    };
  }

  const handlePriceChange = (value: number) => {
    dispatch(actions.setLunaPrice(value));
  };

  useEffect(() => {
    dispatch(actions.getBidPool());
  }, [collateralToken]);

  useEffect(() => {
    if (collateralToken === BLUNA_ADDRESS(network)) {
      dispatch(actions.getLiquidationProfile());
      dispatch(actions.getLunaPrice());
    }
  }, [collateralToken]);

  const collateralTokenName =
    collateralToken === BLUNA_ADDRESS(network) ? 'bLUNA' : 'bETH';

  return (
    <Div>
      <Title level={3}>Bid Pools - {collateralTokenName}</Title>
      {collateralToken === BLUNA_ADDRESS(network) && (
        <Row>
          <Col offset={12} span={12} style={{ textAlign: 'right' }}>
            <p>
              Change the LUNA price to simulate how much Bids will be filled.{' '}
            </p>
          </Col>
          <SimulatorCol offset={12} span={12}>
            <div>
              <InputNumber
                addonBefore="LUNA Price"
                addonAfter={'$'}
                value={lunaPrice}
                onChange={handlePriceChange}
              />
            </div>
            <div>
              <a
                href="#"
                onClick={() => {
                  dispatch(actions.getLunaPrice());
                }}
              >
                Reset
              </a>
            </div>
          </SimulatorCol>
          <SimulatorCol offset={12} span={12}>
            <Statistic
              title="Estimated Liquidated Loan Value (UST)"
              value={expectedLiquidatedLoanValue.toFixed(2)}
            />
          </SimulatorCol>
          <Col
            offset={12}
            span={12}
            style={{ textAlign: 'right', color: 'rgba(255, 255, 255, 0.45)' }}
          >
            The liquidation profiles data which make the simulation possible are
            powered by{' '}
            <a
              href="https://app.alphadefi.fund/liq-profile"
              target="_blank"
              rel="noreferrer"
            >
              AlphaDefi
            </a>
            .
          </Col>
        </Row>
      )}
      <Column {...config} />
    </Div>
  );
}

const Div = styled.div``;

const SimulatorCol = styled(Col)`
  text-align: right;
  margin-bottom: 15px;
`;
