import { strict as assert } from 'assert';
import sinon from 'sinon';

import { createTestProviderTools } from '../../../test/stub/provider';
import BridgeController from './bridge';

const EMPTY_INIT_STATE = {
  bridgeState: {},
};

const sandbox = sinon.createSandbox();

describe('BridgeController', function () {
  let provider;

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
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('constructor', function () {
    it('should setup correctly', function () {
      const bridgeController = getBridgeController();
      assert.deepStrictEqual(
        bridgeController.store.getState(),
        EMPTY_INIT_STATE,
      );
    });
  });
});
