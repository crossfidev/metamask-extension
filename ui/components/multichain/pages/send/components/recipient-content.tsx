import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BannerAlert,
  BannerAlertSeverity,
  Box,
} from '../../../../component-library';
import { getSendHexDataFeatureFlagState } from '../../../../../ducks/metamask/metamask';
import {
  Asset,
  acknowledgeRecipientWarning,
  getBestQuote,
  getCurrentDraftTransaction,
  getSendAsset,
} from '../../../../../ducks/send';
import { AssetType } from '../../../../../../shared/constants/transaction';
import { CONTRACT_ADDRESS_LINK } from '../../../../../helpers/constants/common';
import { Display } from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { AssetPickerAmount } from '../../..';
import { decimalToHex } from '../../../../../../shared/modules/conversion.utils';
import {
  getIsSwapsChain,
  getUseExternalServices,
} from '../../../../../selectors';
import { SendHexData, SendPageRow, QuoteCard } from '.';

export const SendPageRecipientContent = ({
  requireContractAddressAcknowledgement,
  onAssetChange,
}: {
  requireContractAddressAcknowledgement: boolean;
  onAssetChange: (newAsset: Asset, isReceived: boolean) => void;
}) => {
  const t = useI18nContext();

  const {
    receiveAsset,
    sendAsset,
    amount: sendAmount,
    isSwapQuoteLoading,
  } = useSelector(getCurrentDraftTransaction);

  const isBasicFunctionality = useSelector(getUseExternalServices);
  const isSwapsChain = useSelector(getIsSwapsChain);
  const isSwapAllowed =
    isSwapsChain &&
    [AssetType.token, AssetType.native].includes(sendAsset.type) &&
    isBasicFunctionality;

  const bestQuote = useSelector(getBestQuote);

  const isLoadingInitialQuotes = !bestQuote && isSwapQuoteLoading;

  const isBasicSend =
    receiveAsset.details?.address === sendAsset.details?.address;

  const amount = isBasicSend
    ? sendAmount
    : { value: decimalToHex(bestQuote?.destinationAmount || '0') };

  // Hex data
  const showHexDataFlag = useSelector(getSendHexDataFeatureFlagState);
  const asset = useSelector(getSendAsset);
  const showHexData =
    isBasicSend &&
    showHexDataFlag &&
    asset &&
    asset.type !== AssetType.token &&
    asset.type !== AssetType.NFT;

  const scrollRef = useRef<HTMLDivElement>(null);

  // Gas data
  const dispatch = useDispatch();

  // FIXME: these should all be resolved before marking the PR as ready
  // TODO: SWAP+SEND impl steps (all but step 3 correlate to a PR in the merge train):
  // TODO: 1. begin design review + revisions
  //          - handle repopulations
  //          - resolve all TODOs
  //          - handle approval gas
  //          - Preserve dest token when returning to send page from tx page
  //          - Ensure max button works with swaps (update on refresh? buffer?)
  //          - Update best quotes logic
  //          - Changes `quotes` in redux to array
  // TODO: 2. add analytics + e2e tests + unit tests (check comments)
  //       - use transaction lifecycle events once
  // TODO: 3. final design and technical review + revisions
  return (
    <Box>
      {requireContractAddressAcknowledgement ? (
        <SendPageRow>
          <BannerAlert
            severity={BannerAlertSeverity.Danger}
            data-testid="send-warning"
            actionButtonLabel={t('tooltipApproveButton')}
            actionButtonOnClick={() => {
              dispatch(acknowledgeRecipientWarning());
            }}
            actionButtonProps={{ display: Display.Block, marginTop: 4 }}
          >
            {t('sendingToTokenContractWarning', [
              <a
                key="contractWarningSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="send__warning-container__link"
                href={CONTRACT_ADDRESS_LINK}
              >
                {t('learnMoreUpperCase')}
              </a>,
            ])}
          </BannerAlert>
        </SendPageRow>
      ) : null}
      <SendPageRow>
        <AssetPickerAmount
          asset={isSwapAllowed ? receiveAsset : sendAsset}
          sendingAsset={isSwapAllowed ? sendAsset : undefined}
          onAssetChange={useCallback(
            (newAsset) => onAssetChange(newAsset, isSwapAllowed),
            [onAssetChange, isSwapAllowed],
          )}
          isAmountLoading={isLoadingInitialQuotes}
          amount={amount}
        />
      </SendPageRow>
      <QuoteCard scrollRef={scrollRef} />
      {showHexData ? <SendHexData /> : null}
      {/* SCROLL REF ANCHOR */}
      <div ref={scrollRef} />
    </Box>
  );
};
