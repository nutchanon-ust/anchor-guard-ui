/**
 *
 * Asynchronously loads the component for WalletSelector
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WalletSelector = lazyLoad(
  () => import('./index'),
  module => module.WalletSelector,
);
