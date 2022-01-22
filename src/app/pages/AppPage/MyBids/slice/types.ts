import { Repo } from 'types/Repo';

/* --- STATE --- */
export interface MyBidsState {
  myBids: Bid[];
  loading: boolean;
}

export interface Bid {
  id: string;
  premium: string;
  bidRemaining: string;
  bidStatus: string;
  amountFilled: string;
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your feature folder, 
  instead of the 'HomePageState' keyword.
*/
export type ContainerState = MyBidsState;
