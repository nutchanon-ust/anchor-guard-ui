/* --- STATE --- */
export interface AnalyticsState {
  bidPools: BidPool[];
}

export interface BidPool {
  premium: number;
  totalBidAmount: number;
}
