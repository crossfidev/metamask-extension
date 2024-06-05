// Bridge selectors

import { createSelector } from 'reselect';
import { getBridgeFeatureFlags } from '../../../shared/modules/selectors';
import { getUseExternalServices } from '../../selectors';
import { BridgeFlag } from '../../pages/bridge/types/metabridge';

// TODO revert function?
export const getIsBridgeEnabled = () =>
  createSelector(
    getBridgeFeatureFlags,
    getUseExternalServices,
    (bridgeFeatureFlags, shouldUseExternalServices) => {
      console.log('====', bridgeFeatureFlags);
      return (
        (shouldUseExternalServices &&
          bridgeFeatureFlags?.[BridgeFlag.EXTENSION_SUPPORT]) ??
        false
      );
    },
  );
