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
import { selectBidPools, selectLiquidationProfile } from './slice/selectors';
import { Col, Row, Typography } from 'antd';
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
  const bidPools = useSelector(selectBidPools);
  let data: BidPool[] = [];
  let config: any;

  if (liquidationProfile?.length > 0) {
    const lunaPrice = 57;
    const liquidatedLoanValue = liquidationProfile
      .filter(liq => {
        return liq.Luna_Liquidation_Price > lunaPrice;
      })
      .reduce((sum, liq) => {
        return sum + liq.Loan_Value;
      }, 0);
    console.log('liquidatedLoanValue', liquidatedLoanValue);
    let liquidatedLoanValueRemaining = liquidatedLoanValue;
    bidPools.forEach(pool => {
      const left = liquidatedLoanValueRemaining - pool.totalBidAmount;
      console.log(`${pool.premium} ${left}`);
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
    console.log('data', data);

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

  useEffect(() => {
    dispatch(actions.getBidPool());
  }, [collateralToken]);

  useEffect(() => {
    if (collateralToken === BLUNA_ADDRESS(network)) {
      dispatch(actions.getLiquidationProfile());
    }
  }, [collateralToken]);

  return (
    <Div>
      <Title level={3}>Bid Pools</Title>
      <Row style={{ marginTop: '15px', marginBottom: '15px' }}>
        <Col offset={12} span={12}>
          LUNA Price: $60.50
        </Col>
      </Row>
      <Column {...config} />
    </Div>
  );
}

const Div = styled.div``;
