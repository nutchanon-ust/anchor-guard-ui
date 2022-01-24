import { NetworkInfo } from '@terra-money/wallet-provider';

export const APP_MEMO = 'anchor-guard.xyz';

export const ANCHOR_LIQUIDATION_QUEUE_MAINNET_CONTRACT_ADDRESS =
  'terra1e25zllgag7j9xsun3me4stnye2pcg66234je3u';
export const ANCHOR_LIQUIDATION_QUEUE_TESTNET_CONTRACT_ADDRESS =
  'terra18j0wd0f62afcugw2rx5y8e6j5qjxd7d6qsc87r';

export const BLUNA_MAINNET_ADDRESS =
  'terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp';
export const BLUNA_TESTNET_ADDRESS =
  'terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x';
export const BETH_MAINNET_ADDRESS =
  'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun';
export const BETH_TESTNET_ADDRESS =
  'terra19mkj9nec6e3y5754tlnuz4vem7lzh4n0lc2s3l';

export const MAINNET_LCD_URL = 'https://lcd.terra.dev';
export const MAINNET_CHAIN_ID = 'columbus-5';

export const TESTNET_LCD_URL = 'https://bombay-lcd.terra.dev';
export const TESTNET_CHAIN_ID = 'bombay-12';

export const FALLBACK_GAS_PRICE_COLUMNBUS = {
  uluna: '0.01133',
  usdr: '0.104938',
  uusd: '0.15',
  ukrw: '169.77',
  umnt: '428.571',
  ueur: '0.125',
  ucny: '0.98',
  ujpy: '16.37',
  ugbp: '0.11',
  uinr: '10.88',
  ucad: '0.19',
  uchf: '0.14',
  uaud: '0.19',
  usgd: '0.2',
  uthb: '4.62',
  usek: '1.25',
  unok: '1.25',
  udkk: '0.9',
  uidr: '2180.0',
  uphp: '7.6',
  uhkd: '1.17',
};

export const FALLBACK_GAS_PRICE_BOMBAY = {
  ...FALLBACK_GAS_PRICE_COLUMNBUS,
  uluna: '0.15',
  usdr: '0.1018',
  uusd: '0.3',
  ukrw: '178.05',
  umnt: '431.6259',
  ueur: '0.125',
  ucny: '0.97',
  ujpy: '16',
  ugbp: '0.11',
  uinr: '11',
  ucad: '0.19',
  uchf: '0.13',
  uaud: '0.19',
  usgd: '0.2',
  uthb: '4.62',
  usek: '1.25',
  unok: '1.25',
  udkk: '0.9',
};

export function DEFAULT_FALLBACK_GAS_PRICE(network: NetworkInfo) {
  if (network?.chainID.startsWith('bombay')) {
    return FALLBACK_GAS_PRICE_BOMBAY;
  } else {
    return FALLBACK_GAS_PRICE_COLUMNBUS;
  }
}

export function BLUNA_ADDRESS(network: NetworkInfo) {
  if (network?.chainID.startsWith('bombay')) {
    return BLUNA_TESTNET_ADDRESS;
  } else {
    return BLUNA_MAINNET_ADDRESS;
  }
}

export function BETH_ADDRESS(network: NetworkInfo) {
  if (network?.chainID.startsWith('bombay')) {
    return BETH_TESTNET_ADDRESS;
  } else {
    return BETH_MAINNET_ADDRESS;
  }
}

export function ANCHOR_LIQUIDATION_QUEUE_CONTRACT_ADDRESS(
  network: NetworkInfo,
) {
  if (network?.chainID.startsWith('bombay')) {
    return ANCHOR_LIQUIDATION_QUEUE_TESTNET_CONTRACT_ADDRESS;
  } else {
    return ANCHOR_LIQUIDATION_QUEUE_MAINNET_CONTRACT_ADDRESS;
  }
}
