import { strict as assert } from 'assert';
import sinon from 'sinon';

import { createTestProviderTools } from '../../../test/stub/provider';
import BridgeController from './bridge';

const EMPTY_INIT_STATE = {
  bridgeState: {
    bridgeFeatureFlags: {
      'extension-support': false,
    },
  },
};

const sandbox = sinon.createSandbox();

describe('BridgeController', function () {
  let provider;
  let bridgeController;

  const getBridgeController = (_provider = provider) => {
    return new BridgeController();
  };

  before(function () {
    const providerResultStub = {
      // 1 gwei
      eth_gasPrice: '0x0de0b6b3a7640000',
      // by default, all accounts are external accounts (not contracts)
      eth_getCode: '0x',
    };
    provider = createTestProviderTools({
      scaffold: providerResultStub,
      networkId: 1,
      chainId: 1,
    }).provider;

    bridgeController = getBridgeController();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('constructor should setup correctly', function () {
    assert.deepStrictEqual(bridgeController.store.getState(), EMPTY_INIT_STATE);
  });

  it('setBridgeFeatureFlags should set the bridge feature flags', function () {
    const featureFlagsResponse = { 'extension-support': true };
    bridgeController.setBridgeFeatureFlags(featureFlagsResponse);
    assert.deepStrictEqual(
      bridgeController.store.getState().bridgeState.bridgeFeatureFlags,
      featureFlagsResponse,
    );
  });
});
