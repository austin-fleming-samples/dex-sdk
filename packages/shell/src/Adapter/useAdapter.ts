import {
  blockchainConfigMap,
  Connectors,
  getBlockchainConnectorByName,
  getBlockchainOfflineConnector,
  IConnector,
  InvalidNetworkError,
} from "@<REDACTED>/core-sdk";
import { useCallback, useContext, useEffect } from "react";

import { IConfig } from "../Config";
import { ShellEventBus } from "../EventBus";
import { AddressChanged } from "../EventBus/Events/AdapterEvents";
import { Wipe } from "../EventBus/Events/BalancesEvents";
import { ShowNotification } from "../EventBus/Events/NotificationEvents";
import { ShellNotifications } from "../Notifications";
import { AdapterActionKind } from "./State/AdapterActions";
import { ShellContext } from "../State/ShellContext";
import { timedReject } from "../Utils";
import { setChainOnStorage } from "../Utils/ChainStorage";
import { ChangeNetwork } from "../EventBus/Events/BlockchainEvents";

export const useAdapter = () => {
  const { state, dispatch } = useContext(ShellContext);

  const { connector, activeChain, adapter, multicallAdapter, walletError } =
    state.adapter;

  const handleWalletConnectionError = useCallback(
    async (error: any) => {
      if (error instanceof InvalidNetworkError) {
        ShellEventBus.emit(
          new ShowNotification(
            new ShellNotifications.Blockchain.WrongNetworkNotification(
              activeChain.blockchain
            )
          )
        );
      }
      throw error;
    },
    [activeChain.blockchain]
  );

  const changeNetwork = useCallback(
    (chainId: number) => {
      if (chainId === activeChain.chainId) return;
      const config = Object.values(blockchainConfigMap).find(
        (cfg) => cfg.chainId === chainId
      );
      if (!config) {
        dispatch({
          type: AdapterActionKind.CONNECTION_ERROR,
          payload: new InvalidNetworkError(activeChain.blockchain),
        });
      } else {
        ShellEventBus.emit(new ChangeNetwork(config));
      }
    },
    [activeChain, dispatch]
  );

  const connect = useCallback(
    async (connectorName: Connectors) => {
      const walletConnector = getBlockchainConnectorByName(
        activeChain.blockchain,
        connectorName
      );
      const offlineConnector = getBlockchainOfflineConnector(
        activeChain.blockchain
      );
      const successConnection = (payload: IConnector) => {
        dispatch({ type: AdapterActionKind.CONNECT, payload });
      };
      try {
        await Promise.race([
          timedReject(60_000),
          walletConnector
            .connect()
            .then(() => successConnection(walletConnector))
            .catch(handleWalletConnectionError),
        ]);
      } catch (err) {
        dispatch({
          type: AdapterActionKind.CONNECTION_ERROR,
          payload: err as Error,
        });
        offlineConnector
          .connect()
          .then(() => successConnection(offlineConnector));
      }
    },
    [activeChain, dispatch, handleWalletConnectionError]
  );

  const connectOffline = useCallback(() => {
    const offlineConnector = getBlockchainOfflineConnector(
      activeChain.blockchain
    );
    offlineConnector
      .connect()
      .then(() =>
        dispatch({ type: AdapterActionKind.CONNECT, payload: offlineConnector })
      );
  }, [activeChain, dispatch]);

  const updateChain = useCallback(
    (cfg: IConfig) => {
      setChainOnStorage(cfg.blockchain);
      connectOffline();
      dispatch({
        type: AdapterActionKind.SWITCH_CHAIN,
        payload: cfg,
      });
    },
    [dispatch, connectOffline]
  );

  const disconnect = useCallback(async () => {
    if (!connector) {
      return;
    }
    dispatch({ type: AdapterActionKind.DISCONNECT, payload: undefined });
    ShellEventBus.emit(new Wipe());
    connectOffline();
  }, [connectOffline, connector, dispatch]);

  useEffect(() => {
    const onAddressChanged = (address: string) => {
      ShellEventBus.emit(new AddressChanged(address));
    };

    connector?.on("AddressChanged", onAddressChanged);
    connector?.on("Disconnect", disconnect);
    connector?.on("NetworkChanged", changeNetwork);

    return () => {
      connector?.off("AddressChanged", onAddressChanged);
      connector?.off("Disconnect", disconnect);
      connector?.off("NetworkChanged", changeNetwork);
    };
  }, [connector, disconnect, changeNetwork]);

  const isAdapterReady = !!(adapter && multicallAdapter);

  return {
    isAdapterReady,
    adapter,
    multicallAdapter,
    connector,
    activeChain,
    walletError,
    connect,
    connectOffline,
    disconnect,
    updateChain,
  };
};
