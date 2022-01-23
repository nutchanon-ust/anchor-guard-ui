import { Repo } from 'types/Repo';

/* --- STATE --- */
export interface MyBidsState {
  myBids: Bid[];
  loading: boolean;
  walletAddress: string | null;
}

export interface Bid {
  id: string;
  premium: string;
  bidRemaining: string;
  bidStatus: string;
  amountFilled: string;
  waitEnd: number;
  timeLeft: number;
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your feature folder, 
  instead of the 'HomePageState' keyword.
*/
export type ContainerState = MyBidsState;
