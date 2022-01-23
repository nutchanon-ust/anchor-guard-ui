import * as React from 'react';
import { render } from '@testing-library/react';

import { TransactionLoadingModal } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe('<TransactionLoadingModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<TransactionLoadingModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
