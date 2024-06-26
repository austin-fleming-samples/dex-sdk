import {
  ONENativeToken,
  ONEUnfiToken,
  ONEUpToken,
  ONEWrappedToken,
} from "./Tokens";
import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { blockchainConfigFactory } from "../Utils";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const HarmonyConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.Harmony,
    chainId: EthChainIds.Harmony,
    publicRpc: "https://api.harmony.one",
    nativeToken: ONENativeToken,
    wrappedToken: ONEWrappedToken,
    upToken: ONEUpToken,
    unfiToken: ONEUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmYm9c8Lx6mSWDvK3qhgnwJmbFEy1on4NXCVbEXHYNMSdt",
    multicall: {
      supported: true,
      address: "0xFE4980f62D708c2A84D3929859Ea226340759320",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://explorer.harmony.one/#",
      address: function (address: string) {
        return `${this.baseUrl}/address/${address}`;
      },
      token: function (address: string) {
        return `${this.baseUrl}/tokens/${address}`;
      },
      tx: function (address: string) {
        return `${this.baseUrl}/tx/${address}`;
      },
    },
  },
  [
    MetamaskConnector,
    TokenPocketConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.Harmony,
      "https://api.harmony.one"
    ),
  ]
);
