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
import { selectBidPools } from './slice/selectors';
import { Typography } from 'antd';

const { Title } = Typography;

interface Props {}

export function Analytics(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const data = useSelector(selectBidPools);
  const config = {
    data,
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

  const dispatch = useDispatch();
  const { actions } = useAnalyticsSlice();
  const collateralToken = useSelector(selectCollateralToken);

  useEffect(() => {
    dispatch(actions.getBidPool());
  }, [collateralToken]);

  return (
    <Div>
      <Title level={3}>Bid Pools</Title>
      <Column {...config} />
    </Div>
  );
}

const Div = styled.div``;
