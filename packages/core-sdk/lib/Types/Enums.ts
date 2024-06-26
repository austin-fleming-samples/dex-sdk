export { Blockchains } from "@<REDACTED>/utils";

export enum EthChainIds {
  Eth = 1,
  EthRinkeby = 4,
  EthGoerli = 5,
  Bsc = 56,
  BscTestnet = 97,
  Iotex = 4689,
  Harmony = 1666600000,
  Polygon = 137,
  Avalanche = 43114,
  BTTC = 199,
  FTM = 250,
  OntologyTestnet = 5851,
  Ontology = 58,
  /**
   * Non real chain ids
   * Format: 1337XXXX where XXXX is an autoincrement
   * We need this for the nature of the bridge, using chainid as configuration
   * Check existing ones here: https://chainlist.org/
   */
  Tron = 13370001,
}

export enum OfflineConnectors {
  <REDACTED>Proxy = "<REDACTED>proxy",
  Cloudflare = "cloudflare",
  EtherScan = "etherscan",
  BscDataseed = "bscdataseed",
  TronGrid = "trongrid",
  Alchemy = "alchemy",
  Harmony = "harmony",
  Polygon = "polygon",
  Iotex = "iotex",
  Avalanche = "avalanche",
  BTTC = "bttc",
  OntologyTestnet = "ontologytestnet",
  FTM = "ftm",
  Goerli = "Goerli",
}

export enum WalletConnectors {
  Binance = "binance",
  Metamask = "metamask",
  OntoWallet = "ontowallet",
  MathWallet = "mathwallet",
  TokenPocketWallet = "tokenPocket",
  TronLink = "tronlink",
  TrustWallet = "trustwallet",
  MetamaskCompatible = "metamaskCompatible",
  CoinbaseWallet = "coinbaseWallet",
  WalletConnect = "walletConnect",
}

export type Connectors = WalletConnectors | OfflineConnectors;

export type ConnectorEvent = "AddressChanged" | "NetworkChanged" | "Disconnect";
