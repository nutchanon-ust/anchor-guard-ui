import {
  Coins,
  Dec,
  LCDClient,
  MsgExecuteContract,
  Tx,
} from '@terra-money/terra.js';
import { NetworkInfo } from '@terra-money/wallet-provider';
import {
  ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
  DEFAULT_FALLBACK_GAS_PRICE,
} from 'app/constants';

export interface GasEstimation {
  estimatedFeeGas: Dec;
  coinAmount: Coins;
}

export async function estimateGasFee(
  network: NetworkInfo,
  walletAddress: string,
  msgs: MsgExecuteContract[],
  lcd: LCDClient,
): Promise<GasEstimation> {
  const tx = await lcd.tx.create([{ address: walletAddress }], {
    msgs,
    feeDenoms: ['uusd'],
    gasPrices: DEFAULT_FALLBACK_GAS_PRICE(network),
  });
  const estimatedFeeGas = tx.auth_info.fee.amount
    .toArray()
    .reduce((gas, coin) => {
      //@ts-ignore
      const price = DEFAULT_FALLBACK_GAS_PRICE(network)[coin.denom];
      return gas.add(coin.amount.div(price));
    }, new Dec(0));
  return { estimatedFeeGas, coinAmount: tx.auth_info.fee.amount };
}

export function fabricateNewBid(
  network: NetworkInfo,
  walletAddress: string,
  premium: number,
  collateralToken: string,
  ustAmount: number,
): MsgExecuteContract[] {
  return [
    new MsgExecuteContract(
      walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),
      {
        submit_bid: {
          premium_slot: premium,
          collateral_token: collateralToken,
        },
      },
      { uusd: ustAmount },
    ),
  ];
}

export function fabricateCancelBid(
  network: NetworkInfo,
  walletAddress: string,
  bidIdx: string,
): MsgExecuteContract[] {
  return [
    new MsgExecuteContract(
      walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),
      {
        retract_bid: {
          bid_idx: bidIdx,
        },
      },
    ),
  ];
}

export function fabricateClaimBid(
  network: NetworkInfo,
  walletAddress: string,
  bidIdxs: string[] | null,
  collateralToken: string,
): MsgExecuteContract[] {
  return [
    new MsgExecuteContract(
      walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),
      {
        claim_liquidations: {
          bids_idx: bidIdxs,
          collateral_token: collateralToken,
        },
      },
    ),
  ];
}

export function fabricateActivateBid(
  network: NetworkInfo,
  walletAddress: string,
  bidIdxs: string[] | null,
  collateralToken: string,
): MsgExecuteContract[] {
  return [
    new MsgExecuteContract(
      walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(network),

      {
        activate_bids: {
          bids_idx: bidIdxs,
          collateral_token: collateralToken,
        },
      },
    ),
  ];
}

export interface BroadcastResult {
  isError: boolean;
  errorMessage: string;
}

export function validateBroadcastResult(result: any) {
  return {
    isError: result.code !== 0,
    errorMessage: result.raw_log,
  };
}
