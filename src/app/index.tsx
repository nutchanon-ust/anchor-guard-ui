/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from '../styles/global-styles';

import { AppPage } from './pages/AppPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';

import {
  NetworkInfo,
  WalletProvider,
  WalletStatus,
  useChainOptions,
  WalletControllerChainOptions,
  useLCDClient,
  useWallet,
} from '@terra-money/wallet-provider';

export function App() {
  const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s"
        defaultTitle="Anchor Guard"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta
          name="description"
          content="Anchor Liquidation Queue User Interface; Open Source, Free to Use and
          No Fee"
        />
      </Helmet>

      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={AppPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
