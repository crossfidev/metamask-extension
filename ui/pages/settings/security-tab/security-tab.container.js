import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  setIncomingTransactionsPreferences,
  setIpfsGateway,
  setIsIpfsGatewayEnabled,
  setParticipateInMetaMetrics,
  setDataCollectionForMarketing,
  setUseCurrencyRateCheck,
  setUseMultiAccountBalanceChecker,
  setUsePhishDetect,
  setUseTokenDetection,
  toggleExternalServices,
  setUseAddressBarEnsResolution,
  setOpenSeaEnabled,
  setUseNftDetection,
  setUse4ByteResolution,
  setUseSafeChainsListValidation,
  setUseExternalNameSources,
  setUseTransactionSimulations,
  updateDataDeletionTaskStatus,
  ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
  setSecurityAlertsEnabled,
  ///: END:ONLY_INCLUDE_IF
} from '../../../store/actions';
import {
  getAllNetworks,
  ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
  getIsSecurityAlertsEnabled,
  getMetaMetricsDataDeletionDate,
  getMetaMetricsDataDeletionStatus,
  ///: END:ONLY_INCLUDE_IF
  getPetnamesEnabled,
  getShowDeleteMetaMetricsDataModal,
  isMetaMetricsDataDeletionMarked,
  hasRecordedMetricsSinceDeletion,
  getShowDataDeletionErrorModal,
} from '../../../selectors';
import {
  continueRecordingMetaMetricsData,
  openBasicFunctionalityModal,
  openDeleteMetaMetricsDataModal,
  unMarkingMetaMetricsDataDeletion,
} from '../../../ducks/app/app';
import SecurityTab from './security-tab.component';

const mapStateToProps = (state) => {
  const {
    appState: { warning },
    metamask,
  } = state;

  const petnamesEnabled = getPetnamesEnabled(state);

  const {
    incomingTransactionsPreferences,
    participateInMetaMetrics,
    dataCollectionForMarketing,
    usePhishDetect,
    useTokenDetection,
    ipfsGateway,
    useMultiAccountBalanceChecker,
    useSafeChainsListValidation,
    useCurrencyRateCheck,
    useAddressBarEnsResolution,
    openSeaEnabled,
    useNftDetection,
    use4ByteResolution,
    useExternalServices,
    useExternalNameSources,
  } = metamask;

  const allNetworks = getAllNetworks(state);

  return {
    warning,
    incomingTransactionsPreferences,
    allNetworks,
    participateInMetaMetrics,
    dataCollectionForMarketing,
    usePhishDetect,
    useTokenDetection,
    ipfsGateway,
    useMultiAccountBalanceChecker,
    useSafeChainsListValidation,
    useCurrencyRateCheck,
    useAddressBarEnsResolution,
    openSeaEnabled,
    useNftDetection,
    use4ByteResolution,
    useExternalNameSources,
    useExternalServices,
    petnamesEnabled,
    ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
    securityAlertsEnabled: getIsSecurityAlertsEnabled(state),
    ///: END:ONLY_INCLUDE_IF
    useTransactionSimulations: metamask.useTransactionSimulations,
    showDeleteMetaMetricsDataModal: getShowDeleteMetaMetricsDataModal(state),
    showDataDeletionErrorModal: getShowDataDeletionErrorModal(state),
    metaMetricsDataDeletionStatus: getMetaMetricsDataDeletionStatus(state),
    metaMetricsDataDeletionDate: getMetaMetricsDataDeletionDate(state),
    metaMetricsDataDeletionMarked: isMetaMetricsDataDeletionMarked(state),
    hasRecordedMetricsSinceDeletion: hasRecordedMetricsSinceDeletion(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setIncomingTransactionsPreferences: (chainId, value) =>
      dispatch(setIncomingTransactionsPreferences(chainId, value)),
    setParticipateInMetaMetrics: (val) =>
      dispatch(setParticipateInMetaMetrics(val)),
    setDataCollectionForMarketing: (val) =>
      dispatch(setDataCollectionForMarketing(val)),
    setUsePhishDetect: (val) => dispatch(setUsePhishDetect(val)),
    setUseCurrencyRateCheck: (val) => dispatch(setUseCurrencyRateCheck(val)),
    setUseTokenDetection: (val) => dispatch(setUseTokenDetection(val)),
    setIpfsGateway: (val) => dispatch(setIpfsGateway(val)),
    setIsIpfsGatewayEnabled: (val) => dispatch(setIsIpfsGatewayEnabled(val)),
    setUseMultiAccountBalanceChecker: (val) =>
      dispatch(setUseMultiAccountBalanceChecker(val)),
    setUseAddressBarEnsResolution: (val) =>
      dispatch(setUseAddressBarEnsResolution(val)),
    setUseSafeChainsListValidation: (val) =>
      dispatch(setUseSafeChainsListValidation(val)),
    setBasicFunctionalityModalOpen: () =>
      dispatch(openBasicFunctionalityModal()),
    setOpenSeaEnabled: (val) => dispatch(setOpenSeaEnabled(val)),
    setUseNftDetection: (val) => dispatch(setUseNftDetection(val)),
    setUse4ByteResolution: (value) => {
      return dispatch(setUse4ByteResolution(value));
    },
    setUseExternalNameSources: (value) => {
      return dispatch(setUseExternalNameSources(value));
    },
    toggleExternalServices: (value) => {
      return dispatch(toggleExternalServices(value));
    },
    setUseTransactionSimulations: (value) => {
      return dispatch(setUseTransactionSimulations(value));
    },
    setDeleteMetaMetricsDataModalOpen: () => {
      return dispatch(openDeleteMetaMetricsDataModal());
    },
    updateDataDeletionTaskStatus: () => {
      return dispatch(updateDataDeletionTaskStatus());
    },
    unMarkingMetaMetricsDataDeletion: () => {
      return dispatch(unMarkingMetaMetricsDataDeletion());
    },
    continueRecordingMetaMetricsData: () => {
      return dispatch(continueRecordingMetaMetricsData());
    },
    ///: BEGIN:ONLY_INCLUDE_IF(blockaid)
    setSecurityAlertsEnabled: (value) => setSecurityAlertsEnabled(value),
    ///: END:ONLY_INCLUDE_IF
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(SecurityTab);
