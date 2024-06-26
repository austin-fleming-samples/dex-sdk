import { ETHNativeToken, ETHUpToken, ETHWrappedToken } from "./Tokens";
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
import { ETHUnfiToken } from "./Tokens";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const EthereumConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.Ethereum,
    chainId: EthChainIds.Eth,
    publicRpc: "https://cloudflare-eth.com/",
    nativeToken: ETHNativeToken,
    wrappedToken: ETHWrappedToken,
    upToken: ETHUpToken,
    unfiToken: ETHUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmXaeURdHVszjDuGCwM7DauTjaASfm8qBZYzETM5ehq7MD",
    multicall: {
      supported: true,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: "https://etherscan.io",
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
    TokenPocketConnector,
    MetamaskCompatibleConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.Cloudflare,
      "https://cloudflare-eth.com/"
    ),
  ]
);
