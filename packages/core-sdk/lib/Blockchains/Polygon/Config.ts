import {
  MATICNativeToken,
  MATICUnfiToken,
  MATICUpToken,
  MATICWrappedToken,
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

export const PolygonConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.Polygon,
    chainId: EthChainIds.Polygon,
    publicRpc: "https://polygon-rpc.com",
    nativeToken: MATICNativeToken,
    wrappedToken: MATICWrappedToken,
    upToken: MATICUpToken,
    unfiToken: MATICUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmSwnuGtuLGyP7kGuW8oQhn8oHEFKuaAcYA7HBRNQtWvtm",
    multicall: {
      supported: true,
      address: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://polygonscan.com",
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
      OfflineConnectors.Polygon,
      "https://polygon-rpc.com"
    ),
  ]
);
