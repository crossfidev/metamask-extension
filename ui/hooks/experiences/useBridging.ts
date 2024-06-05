import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBridgeFeatureFlags } from '../../pages/bridge/bridge.util';
import { setBridgeFeatureFlags } from '../../store/actions';

// For background processes
const useBridging = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO make sure this is not running too frequently
    fetchBridgeFeatureFlags().then((bridgeFeatureFlags) => {
      dispatch(setBridgeFeatureFlags(bridgeFeatureFlags));
    });
  }, [dispatch, setBridgeFeatureFlags]);
};
export default useBridging;
