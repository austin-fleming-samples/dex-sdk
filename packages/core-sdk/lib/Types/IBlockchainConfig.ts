import { Currency } from "@<REDACTED>/utils";
import {
  Blockchains,
  EthChainIds,
  IConnector,
  IConnectorMetadata,
  IBlockchainExplorer,
} from "../Types";

export type OfflineConnectorFactoryFn<T = any> = (
  config: IBlockchainConfig,
  metadata: IConnectorMetadata,
  params: T
) => IConnector;
export interface IBlockchainConfig {
  blockchain: Blockchains;
  publicRpc: string;
  nativeToken: Currency;
  wrappedToken: Currency;
  upToken?: Currency;
  unfiToken?: Currency;
  logoURI: string;
  chainId: EthChainIds;
  wallets: IConnector[];
  offlineConnectors: IConnector[];
  multicall: {
    supported: boolean;
    address?: string;
    tryAggregate?: boolean;
  };
  explorer: IBlockchainExplorer;
  connectorFactory?: OfflineConnectorFactoryFn;
}

export interface IConnectorFactoryParams<T = any> {
  metadata: IConnectorMetadata;
  params: T;
}
