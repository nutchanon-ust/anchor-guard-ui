/**
 *
 * Asynchronously loads the component for NewBidForm
 *
 */

import { lazyLoad } from 'utils/loadable';

export const NewBidForm = lazyLoad(
  () => import('./index'),
  module => module.NewBidForm,
);
