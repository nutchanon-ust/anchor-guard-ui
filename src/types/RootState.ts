import { MyBidsState } from 'app/pages/AppPage/MyBids/slice/types';
import { ThemeState } from 'styles/theme/slice/types';
import { NewBidState } from 'app/pages/AppPage/NewBidForm/slice/types';
import { WalletConnectionState } from 'app/components/WalletSelector/slice/types';
import { TransactionLoadingModalState } from 'app/components/TransactionLoadingModal/slice/types';
import { AnalyticsState } from 'app/pages/AppPage/Analytics/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  myBids?: MyBidsState;
  newBid?: NewBidState;
  walletConnection?: WalletConnectionState;
  transactionLoadingModal?: TransactionLoadingModalState;
  analytics?: AnalyticsState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
