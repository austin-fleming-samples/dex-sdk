import {
  ONGNativeToken,
  ONGUnfiToken,
  ONGUpToken,
  ONGWrappedToken,
} from "./Tokens";
import { Blockchains, EthChainIds, OfflineConnectors } from "../../Types";
import { MetamaskConnector } from "../../Connectors/Wallets/MetamaskConnector";
import { blockchainConfigFactory } from "../Utils";
import { MetamaskCompatibleConnector } from "../../Connectors/Wallets/MetamaskCompatibleConnector";
import {
  createWeb3OfflineConnectorHelper,
  web3ConnectorFactory,
} from "../../Connectors/Factory";
import { <REDACTED>BlockchainProxyUrl } from "../../Connectors/Utils";
import { OntoWalletConnector } from "../../Connectors/Wallets/OntoWallet";
import { WalletConnectConnector } from "../../Connectors/Wallets/WalletConnectConnector";
import { CoinbaseWalletConnector } from "../../Connectors/Wallets/CoinbaseConnector";
import { TokenPocketConnector } from "../../Connectors/Wallets/TokenPocketConnector";

export const OntologyConfig = blockchainConfigFactory(
  {
    blockchain: Blockchains.Ontology,
    chainId: EthChainIds.Ontology,
    publicRpc: <REDACTED>BlockchainProxyUrl(Blockchains.Ontology),
    nativeToken: ONGNativeToken,
    wrappedToken: ONGWrappedToken,
    upToken: ONGUpToken,
    unfiToken: ONGUnfiToken,
    logoURI:
      "https://proxy.<REDACTED>.com/ipfs/QmabRMMq64jyBxhRkALfDM7ucJZc83xNZf8XVVr2S4GETq",
    multicall: {
      supported: true,
      address: "0xF0FccF333d45B383A9086739Ab8176BeDDd5a519",
      tryAggregate: false,
    },
    connectorFactory: web3ConnectorFactory,
    explorer: {
      baseUrl: `https://explorer.ont.io`,
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
    OntoWalletConnector,
    CoinbaseWalletConnector,
    WalletConnectConnector,
  ],
  [
    createWeb3OfflineConnectorHelper(
      OfflineConnectors.<REDACTED>Proxy,
      <REDACTED>BlockchainProxyUrl(Blockchains.Ontology)
    ),
  ]
);
