import {
  Coins,
  Dec,
  LCDClient,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import {
  ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
  FALLBACK_GAS_PRICE_COLUMNBUS,
} from 'app/constants';

export interface GasEstimation {
  estimatedFeeGas: Dec;
  coinAmount: Coins;
}

export async function estimateGasFee(
  walletAddress: string,
  msgs: MsgExecuteContract[],
  lcd: LCDClient,
): Promise<GasEstimation> {
  const { auth_info } = await lcd.tx.create([{ address: walletAddress }], {
    msgs,
    feeDenoms: ['uusd'],
    gasPrices: FALLBACK_GAS_PRICE_COLUMNBUS,
  });
  const estimatedFeeGas = auth_info.fee.amount.toArray().reduce((gas, coin) => {
    //@ts-ignore
    const price = FALLBACK_GAS_PRICE_COLUMNBUS[coin.denom];
    return gas.add(coin.amount.div(price));
  }, new Dec(0));
  return { estimatedFeeGas, coinAmount: auth_info.fee.amount };
}

export function fabricateNewBid(
  walletAddress: string,
  premium: number,
  collateralToken: string,
  ustAmount: number,
): MsgExecuteContract[] {
  return [
    new MsgExecuteContract(
      walletAddress,
      ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS,
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
