import { Blockchains, getBlockchainConfig } from "@<REDACTED>/core-sdk";
import { Currency } from "@<REDACTED>/utils";

export interface IConfig {
  blockchain: Blockchains;
  chainId: number;
  nativeToken: Currency;
  wrappedToken: Currency;
}

const config: IConfig[] = [
  {
    ...baseConfig(Blockchains.Binance),
  },
  {
    ...baseConfig(Blockchains.Ethereum),
  },
  {
    ...baseConfig(Blockchains.Harmony),
  },
  {
    ...baseConfig(Blockchains.Ontology),
  },
  {
    ...baseConfig(Blockchains.Polygon),
  },
  {
    ...baseConfig(Blockchains.Iotex),
  },
  {
    ...baseConfig(Blockchains.Avalanche),
  },
  {
    ...baseConfig(Blockchains.BTTC),
  },
  {
    ...baseConfig(Blockchains.FTM),
  },
  {
    ...baseConfig(Blockchains.EthereumGoerli),
  },
  {
    ...baseConfig(Blockchains.BinanceTestnet),
  },
  {
    ...baseConfig(Blockchains.OntologyTestnet),
  },
];

export const externalBlockchainsConfig = [
  {
    name: "ICON",
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmY9MQ9pL7PVkBC7PeqtZgY8mhh5w39cDWDs9pqgokUxXZ",
    externalLink: "https://icon.<REDACTED>.com/",
  },
  {
    name: "TRON",
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmNfhQcEHNL7tJJHCitHEwKFEr37dLJPVWaWZ13yXbYUZ8",
    externalLink: "https://tron.<REDACTED>.com/",
  },
];

function baseConfig(
  blockchain: Blockchains
): Pick<IConfig, "blockchain" | "chainId" | "nativeToken" | "wrappedToken"> {
  const sdkConfig = getBlockchainConfig(blockchain);

  return {
    blockchain,
    chainId: sdkConfig.chainId,
    nativeToken: sdkConfig.nativeToken,
    wrappedToken: sdkConfig.wrappedToken,
  };
}
export const defaultConfig = config[0];
export default config;
