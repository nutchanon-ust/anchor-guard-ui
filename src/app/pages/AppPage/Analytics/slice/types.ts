/* --- STATE --- */
export interface AnalyticsState {
  bidPools: BidPool[];
  liquidationProfile: LiquidationProfile[];
  lunaPrice: number;
}

export interface BidPool {
  premium: number;
  totalBidAmount: number;
  type?: string;
}

export interface LiquidationProfile {
  Date: string;
  Luna_Liquidation_Price: number;
  Loan_Value: number;
}
