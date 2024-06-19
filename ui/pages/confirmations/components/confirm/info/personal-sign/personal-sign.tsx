import React from 'react';
import { useSelector } from 'react-redux';

import {
  ConfirmInfoRow,
  ConfirmInfoRowAddress,
  ConfirmInfoRowText,
  ConfirmInfoRowUrl,
} from '../../../../../../components/app/confirm/info/row';
import { useI18nContext } from '../../../../../../hooks/useI18nContext';
import { currentConfirmationSelector } from '../../../../../../selectors';
import {
  hexToText,
  sanitizeString,
} from '../../../../../../helpers/utils/util';
import { SignatureRequestType } from '../../../../types/confirm';
import { isSIWESignatureRequest } from '../../../../utils';
import { ConfirmInfoAlertRow } from '../../../../../../components/app/confirm/info/row/alert-row/alert-row';
import { ConfirmInfoSection } from '../../../../../../components/app/confirm/info/row/section';

const PersonalSignInfo: React.FC = () => {
  const t = useI18nContext();
  const currentConfirmation = useSelector(
    currentConfirmationSelector,
  ) as SignatureRequestType;

  if (!currentConfirmation?.msgParams) {
    return null;
  }

  const { from } = currentConfirmation.msgParams;
  const isSiweSigReq = isSIWESignatureRequest(currentConfirmation);

  return (
    <>
      {isSiweSigReq && (
        <ConfirmInfoSection>
          <ConfirmInfoRow
            label={t('simulationDetailsTitle')}
            tooltip={t('simulationDetailsTitleTooltip')}
          >
            <ConfirmInfoRowText text={t('siweSignatureSimulationDetailInfo')} />
          </ConfirmInfoRow>
        </ConfirmInfoSection>
      )}
      <ConfirmInfoSection>
        <ConfirmInfoAlertRow
          alertKey="requestFrom"
          ownerId={currentConfirmation.id}
          label={t('requestFrom')}
          tooltip={t('requestFromInfo')}
        >
          <ConfirmInfoRowUrl url={currentConfirmation.msgParams.origin} />
        </ConfirmInfoAlertRow>
        {isSiweSigReq && (
          <ConfirmInfoRow label={t('signingInWith')}>
            <ConfirmInfoRowAddress address={from} />
          </ConfirmInfoRow>
        )}
      </ConfirmInfoSection>
      <ConfirmInfoSection>
        <ConfirmInfoAlertRow
          alertKey="message"
          ownerId={currentConfirmation.id}
          label={t('message')}
        >
          <ConfirmInfoRowText
            text={sanitizeString(
              hexToText(currentConfirmation.msgParams?.data),
            )}
          />
        </ConfirmInfoAlertRow>
      </ConfirmInfoSection>
    </>
  );
};

export default PersonalSignInfo;
