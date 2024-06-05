import { ObservableStore } from '@metamask/obs-store';
import { BridgeFlag } from '../../../ui/pages/bridge/types/metabridge';

export type BridgeFeatureFlags = {
  [BridgeFlag.EXTENSION_SUPPORT]: boolean;
};

const initialState = {
  bridgeState: {
    bridgeFeatureFlags: {
      [BridgeFlag.EXTENSION_SUPPORT]: false,
    },
  },
};

// TODO implement network calls
// TODO extend swaps controller, add bridge controller states to swaps controller
export default class BridgeController {
  store = new ObservableStore(initialState);

  resetState = () => {
    this.store.updateState({
      bridgeState: {
        ...initialState.bridgeState,
      },
    });
  };

  setBridgeFeatureFlags = (bridgeFeatureFlags: BridgeFeatureFlags) => {
    const { bridgeState } = this.store.getState();
    this.store.updateState({
      bridgeState: { ...bridgeState, bridgeFeatureFlags },
    });
  };
}
