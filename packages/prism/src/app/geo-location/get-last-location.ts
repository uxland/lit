import {store} from '../../store';
import {lastKnownPositionSelector} from './selectors';

export const getLastLocation: (
  maxAge: number,
  timeout?: number,
  highAccuracy?: boolean
) => Promise<Position> = (maxAge, timeout, highAccuracy) => {
  const lastKnown = lastKnownPositionSelector(store.getState());
  if (lastKnown) return Promise.resolve(lastKnown);
  return new Promise<Position>(resolve =>
    navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
      enableHighAccuracy: highAccuracy,
      timeout: timeout,
      maximumAge: maxAge,
    })
  );
};
