import { ONGNativeToken, ONGUpToken, ONGWrappedToken } from "./Tokens";
import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { blockchainConfigFactory } from "../Utils";
import { MetamaskCompatibleConnector } from "../../Connectors/Wallets/MetamaskCompatibleConnector";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { <REDACTED>BlockchainProxyUrl } from "../../Connectors/Utils";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const OntologyTestnetConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.OntologyTestnet,
    chainId: EthChainIds.OntologyTestnet,
    publicRpc: <REDACTED>BlockchainProxyUrl(Blockchains.OntologyTestnet),
    nativeToken: ONGNativeToken,
    wrappedToken: ONGWrappedToken,
    upToken: ONGUpToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmXRH7VxcrLM9mP3si1f4A82UPcgyqEiSWJtNzHKkVeUW2",
    multicall: {
      supported: true,
      address: "0x814D299c9081085C6b99208f1387738EeD3D638F",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: `https://explorer.ont.io/testnet`,
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
      OfflineConnectors.OntologyTestnet,
      <REDACTED>BlockchainProxyUrl(Blockchains.OntologyTestnet)
    ),
  ]
);
