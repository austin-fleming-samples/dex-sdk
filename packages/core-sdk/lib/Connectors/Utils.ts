import { Blockchains } from "../Types";

export const <REDACTED>BlockchainProxyUrl = (blockchain: Blockchains): string => {
  return `https://proxy.<REDACTED>.com/rpc/${blockchain}`;
};
