import { BridgeFeatureFlags } from '../../../app/scripts/controllers/bridge';
import { BRIDGE_API_BASE_URL } from '../../../shared/constants/bridge';
import { SWAPS_CLIENT_ID } from '../../../shared/constants/swaps';
import fetchWithCache from '../../../shared/lib/fetch-with-cache';

const CLIENT_ID_HEADER = { 'X-Client-Id': SWAPS_CLIENT_ID };

// TODO validate responses
// TODO write tests

export async function fetchBridgeFeatureFlags(): Promise<BridgeFeatureFlags> {
  return await fetchWithCache({
    url: `${BRIDGE_API_BASE_URL}/getAllFeatureFlags`,
    fetchOptions: { method: 'GET', headers: CLIENT_ID_HEADER },
    // TODO 600000
    cacheOptions: { cacheRefreshTime: 1000 },
    functionName: 'fetchBridgeFeatureFlags',
  });
}
