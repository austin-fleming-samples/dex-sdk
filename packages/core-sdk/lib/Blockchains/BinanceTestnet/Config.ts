import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { MathWalletConnector } from "../../Connectors/Wallets/MathWalletConnector";
import { blockchainConfigFactory } from "../Utils";
import { BinanceChainWalletConnector } from "../Binance/Wallets/BinanceChainWalletConnector";
import { TrustWalletConnector } from "../../Connectors/Wallets/TrustWalletConnector";
import { MetamaskCompatibleConnector } from "../../Connectors/Wallets/MetamaskCompatibleConnector";
import { BNBUpToken, BNBWrappedToken, BNBNativeToken } from "./Tokens";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const BinanceTestnetConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.BinanceTestnet,
    chainId: EthChainIds.BscTestnet,
    publicRpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    nativeToken: BNBNativeToken,
    wrappedToken: BNBWrappedToken,
    upToken: BNBUpToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmU2EACvQ1YT7LTzHQdQEVMwDYVeeX3AHBHT9q5HQ4e5oK",
    multicall: {
      supported: true,
      address: "0xae11c5b5f29a6a25e955f0cb8ddcc416f522af5c",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://testnet.bscscan.com",
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
    BinanceChainWalletConnector,
    TrustWalletConnector,
    MathWalletConnector,
    TokenPocketConnector,
    MetamaskCompatibleConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.BscDataseed,
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    ),
  ]
);
