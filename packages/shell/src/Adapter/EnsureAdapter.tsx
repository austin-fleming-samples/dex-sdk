import { Connectors } from "@<REDACTED>/core-sdk";
import { CgSpinner } from "@<REDACTED>/uikit";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAdapter } from "./useAdapter";
import { getStorageKey } from "../Utils/ChainStorage";
import { usePrevious } from "../Hooks/usePrevious";

const ConnectingAdapter = styled.div`
  margin: 2rem;
  color: ${(p) => p.theme.primary};
`;

export const EnsureAdapter: React.FC = ({ children }) => {
  const { connect, connectOffline, activeChain, isAdapterReady, connector } =
    useAdapter();
  useEffect(() => {
    const lastConnector = getStorageKey<Connectors>(
      activeChain.blockchain,
      "CONNECTOR"
    );
    if (lastConnector) {
      connect(lastConnector);
    } else {
      connectOffline();
    }
  }, [activeChain.blockchain, connect, connectOffline]);

  const [secondsWaiting, setSecondsWaiting] = useState(0);

  useEffect(() => {
    if (isAdapterReady) {
      return;
    }
    setTimeout(() => setSecondsWaiting(secondsWaiting + 1), 1000);
  }, [secondsWaiting, isAdapterReady]);

  const prevConnector = usePrevious(connector);

  useEffect(() => {
    if (connector !== prevConnector && prevConnector?.isWallet) {
      prevConnector?.disconnect();
    }
  }, [connector, prevConnector]);

  const dots = (secondsWaiting % 3) + 1;

  if (!isAdapterReady) {
    if (secondsWaiting < 1) {
      return <></>;
    }
    return (
      <ConnectingAdapter>
        <CgSpinner size={20} /> Connecting{".".repeat(dots)}
      </ConnectingAdapter>
    );
  }
  return <>{children}</>;
};
