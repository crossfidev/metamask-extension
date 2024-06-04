import { ObservableStore } from '@metamask/obs-store';

const initialState = {
  bridgeState: {},
};

// TODO implement network calls
export default class BridgeController {
  store = new ObservableStore(initialState);

  resetState = () => {
    this.store.updateState({
      bridgeState: {
        ...initialState.bridgeState,
      },
    });
  };
}
