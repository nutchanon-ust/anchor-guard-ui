/**
 *
 * Asynchronously loads the component for Analytics
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Analytics = lazyLoad(
  () => import('./index'),
  module => module.Analytics,
);
