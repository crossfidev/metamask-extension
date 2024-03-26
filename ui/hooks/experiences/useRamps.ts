import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { Hex } from '@metamask/utils';
import { ChainId } from '../../../shared/constants/network';
import { getCurrentChainId, getMetaMetricsId } from '../../selectors';

type IUseRamps = {
  openBuyCryptoInPdapp: VoidFunction;
  getBuyURI: (chainId: ChainId) => string;
};

const portfolioUrl = process.env.PORTFOLIO_URL;

const useRamps = (): IUseRamps => {
  const chainId = useSelector(getCurrentChainId);
  const metaMetricsId = useSelector(getMetaMetricsId);

  const getBuyURI = useCallback(
    (_chainId: Hex) => {
      const params = new URLSearchParams();
      params.set('metamaskEntry', 'ext_buy_sell_button');
      params.set('chainId', _chainId);
      if (metaMetricsId) {
        params.set('metametricsId', metaMetricsId);
      }
      return `${portfolioUrl}/buy?${params.toString()}`;
    },
    [metaMetricsId],
  );

  const openBuyCryptoInPdapp = useCallback(() => {
    const buyUrl = getBuyURI(chainId);
    global.platform.openTab({
      url: buyUrl,
    });
  }, [chainId]);

  return { openBuyCryptoInPdapp, getBuyURI };
};

export default useRamps;
