import { Blockchains } from "./Enums";
import { toChecksumAddress } from "./utils";

function normalizedToChecksumAddress(hash: string) {
  try {
    const checksum = toChecksumAddress(hash);
    return checksum;
  } catch (err) {
    return hash;
  }
}

export const TokenLogoResolvers: Record<
  Blockchains,
  (address: string) => string
> = {
  [Blockchains.Binance]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_bsc?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.BinanceTestnet]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_bsc?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.Polygon]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_matic?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,

  [Blockchains.Ethereum]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_eth?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.EthereumRinkeby]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_eth?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.EthereumGoerli]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_eth?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.Harmony]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_one?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,

  [Blockchains.Iotex]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_iotx?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.Tron]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_trc20.php?token=${hash}&autoResolve=false`,
  [Blockchains.Avalanche]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_avax?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.BTTC]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_bttc?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.OntologyTestnet]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_bttc?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.Ontology]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_ont?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
  [Blockchains.FTM]: (hash: string) =>
    `https://icon-service.<REDACTED>.report/icon_ftm?token=${normalizedToChecksumAddress(
      hash
    )}&autoResolve=false`,
};
