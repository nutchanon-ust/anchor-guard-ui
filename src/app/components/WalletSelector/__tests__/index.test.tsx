import * as React from 'react';
import { render } from '@testing-library/react';

import { WalletSelector } from '..';

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

describe('<WalletSelector  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<WalletSelector />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
