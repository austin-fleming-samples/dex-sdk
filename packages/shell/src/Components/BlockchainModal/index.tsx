import React, { useEffect, useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalClose,
  useModal,
} from "@<REDACTED>/uikit";
import config, { IConfig, externalBlockchainsConfig } from "../../Config";
import {
  ItemLogo,
  ItemName,
  SelectionList,
  SelectionListItem,
} from "../ConnectionModal/Styles";
import { Trans, useTranslation } from "react-i18next";
import { useAdapter } from "../../Adapter/useAdapter";
import { getVernacularBlockchain } from "@<REDACTED>/utils";
import { getBlockchainConfig } from "@<REDACTED>/core-sdk";

type ChooseBlockchainModalProps = {
  onNetworkChange: (network: IConfig) => void;
  onClose: () => void;
};

const BlockchainModalComponent: React.FC<ChooseBlockchainModalProps> = ({
  onClose,
  onNetworkChange,
}) => {
  const { activeChain } = useAdapter();
  const { t } = useTranslation();

  const internalBlockchains = useMemo(
    () =>
      config.map((network) => {
        const cfg = getBlockchainConfig(network.blockchain);
        return {
          value: network,
          display: (
            <>
              <ItemLogo
                alt={getVernacularBlockchain(network.blockchain)}
                src={cfg.logoURI}
              />
              <ItemName>{getVernacularBlockchain(network.blockchain)}</ItemName>
            </>
          ),
        };
      }),
    []
  );

  const externalBlockchains = useMemo(
    () =>
      externalBlockchainsConfig.map(({ name, logoURI, externalLink }) => ({
        externalLink,
        display: (
          <>
            <ItemLogo alt={name} src={logoURI} />
            <ItemName>{name}</ItemName>
          </>
        ),
      })),
    []
  );

  return (
    <Modal>
      <ModalHeader>
        {t("choose_network_modal.select_network")}
        <ModalClose onClick={() => onClose()} />
      </ModalHeader>
      <ModalBody>
        <Trans
          i18nKey="choose_network_modal.currently_browsing" // optional -> fallbacks to defaults if not provided
          values={{ networkName: activeChain.blockchain }}
          components={{ b: <b /> }}
        />
        <SelectionList>
          {internalBlockchains.map(({ value, display }, idx) => {
            return (
              <SelectionListItem
                key={idx}
                onClick={() => onNetworkChange(value)}
              >
                {display}
              </SelectionListItem>
            );
          })}
          {externalBlockchains.map(({ display, externalLink }, idx) => (
            <SelectionListItem
              key={idx + internalBlockchains.length}
              onClick={() => window.location.replace(externalLink)}
            >
              {display}
            </SelectionListItem>
          ))}
        </SelectionList>
      </ModalBody>
    </Modal>
  );
};

export const BlockchainModal: React.FC<
  ChooseBlockchainModalProps & { isOpen: boolean }
> = ({ onClose, isOpen, onNetworkChange }) => {
  const props = useMemo(
    () => ({ onNetworkChange, onClose }),
    [onNetworkChange, onClose]
  );
  const [open, close] = useModal({
    component: BlockchainModalComponent,
    props,
    options: { disableBackdropClick: true, onClose },
  });

  useEffect(() => {
    if (isOpen) {
      open();
    } else {
      close();
    }
  }, [isOpen, close, open]);

  return <></>;
};
