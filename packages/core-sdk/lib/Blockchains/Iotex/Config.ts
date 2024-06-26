import {
  IOTXNativeToken,
  IOTXUnfiToken,
  IOTXUpToken,
  IOTXWrappedToken,
} from "./Tokens";
import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { blockchainConfigFactory } from "../Utils";
import { MetamaskCompatibleConnector } from "../../Connectors/Wallets/MetamaskCompatibleConnector";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const IotexConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.Iotex,
    chainId: EthChainIds.Iotex,
    publicRpc: "https://babel-api.mainnet.iotex.io",
    nativeToken: IOTXNativeToken,
    wrappedToken: IOTXWrappedToken,
    upToken: IOTXUpToken,
    unfiToken: IOTXUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmX4WzftcjqPpw1GUgVGDDLTk1aUwtFZtSzBtv6Zt1RTBZ",
    multicall: {
      supported: true,
      address: "0xacce294bf7d25fe8c5c64ae45197d3878f68403b",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://iotexscout.io",
      address: function (address: string) {
        return `${this.baseUrl}/address/${address}`;
      },
      token: function (address: string) {
        return `${this.baseUrl}/token/${address}`;
      },
      tx: function (address: string) {
        return `${this.baseUrl}/tx/${address}`;
      },
    },
  },
  [
    MetamaskConnector,
    TokenPocketConnector,
    MetamaskCompatibleConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.Iotex,
      "https://babel-api.mainnet.iotex.io"
    ),
  ]
);
