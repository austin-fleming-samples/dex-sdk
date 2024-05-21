import { GoerliNativeToken, GoerliWrappedToken } from "./Tokens";
import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { MathWalletConnector } from "../../Connectors/Wallets/MathWalletConnector";
import { blockchainConfigFactory } from "../Utils";
import { TrustWalletConnector } from "../../Connectors/Wallets/TrustWalletConnector";
import { MetamaskCompatibleConnector } from "../../Connectors/Wallets/MetamaskCompatibleConnector";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { GoerliUnfiToken, GoerliUpToken } from ".";
import { <REDACTED>BlockchainProxyUrl } from "../../Connectors/Utils";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const EthereumGoerliConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.EthereumGoerli,
    chainId: EthChainIds.EthGoerli,
    publicRpc: <REDACTED>BlockchainProxyUrl(Blockchains.EthereumGoerli),
    nativeToken: GoerliNativeToken,
    wrappedToken: GoerliWrappedToken,
    upToken: GoerliUpToken,
    unfiToken: GoerliUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmXaeURdHVszjDuGCwM7DauTjaASfm8qBZYzETM5ehq7MD",
    multicall: {
      supported: true,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://goerli.etherscan.io",
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
    TrustWalletConnector,
    MathWalletConnector,
    MetamaskCompatibleConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.<REDACTED>Proxy,
      <REDACTED>BlockchainProxyUrl(Blockchains.EthereumGoerli)
    ),
  ]
);
