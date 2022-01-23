/**
 *
 * Asynchronously loads the component for TransactionLoadingModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TransactionLoadingModal = lazyLoad(
  () => import('./index'),
  module => module.TransactionLoadingModal,
);
