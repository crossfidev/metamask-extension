import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CHAIN_IDS } from '../../../shared/constants/network';
import bridgeSlice from './bridge';
import { createBridgeMockStore } from '../../../test/jest/mock-store';
import { setToChain } from './actions';

const middleware = [thunk];

describe('Ducks - Bridge', () => {
  const store = configureMockStore<any>(middleware)(createBridgeMockStore());

  afterEach(() => {
    nock.cleanAll();
  });

  describe('setToChain', () => {
    it('calls the "bridge/setToChain" action', () => {
      const state = store.getState().bridge;
      const actionPayload = CHAIN_IDS.BSC;
      store.dispatch(setToChain(actionPayload));
      const actions = store.getActions();
      expect(actions[0].type).toBe('bridge/setToChain');
      const newState = bridgeSlice(state, actions[0]);
      expect(newState.toChain).toBe(actionPayload);
    });
  });
});
