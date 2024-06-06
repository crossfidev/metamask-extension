import { TransactionMeta } from '@metamask/transaction-controller';
import { useSelector } from 'react-redux';
import {
  currentConfirmationSelector,
  selectTransactionMetadata,
} from '../../../../../selectors';
import { useMemo } from 'react';
import { Severity } from '../../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../../hooks/useI18nContext';
import { Alert } from '../../../../../ducks/confirm-alerts/confirm-alerts';
import { RowAlertKey } from '../../../../../components/app/confirm/info/row/constants';

export function useGasEstimateFailedAlerts(): Alert[] {
  const t = useI18nContext();
  const currentConfirmation = useSelector(currentConfirmationSelector);
  const transaction = (currentConfirmation ?? {}) as TransactionMeta;
  const { id: transactionId } = transaction;

  const transactionMetadata = useSelector((state) =>
    selectTransactionMetadata(state, transactionId),
  );

  const estimationFailed = Boolean(transactionMetadata?.simulationFails);

  return useMemo(() => {
    if (!estimationFailed) {
      return [];
    }

    return [
      {
        field: RowAlertKey.EstimatedFee,
        key: 'gasEstimateFailed',
        message: t('simulationErrorMessageV2'),
        reason: 'Gas Estimation Failed',
        severity: Severity.Danger,
      },
    ];
  }, [estimationFailed]);
}
