import configureStore from 'redux-mock-store';
import {
  REGISTER_GEO_LOCATION_WATCHER,
  UNREGISTER_GEO_LOCATION_WATCHER,
} from '../../../../src/app/geo-location';
import * as geoLocationWatcherRegistry from '../../../../src/app/geo-location/geo-location-watcher-registry';
import * as store from '../../../../src/store';

const mockStore = configureStore([]);

describe('geo location watcher registry', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  describe('When invoking registerGeoLocationWatcher with a watcherId', () => {
    it('should dispatch an action to the store', () => {
      const st: any = mockStore({});
      //jest.spyOn(store, 'store', 'get').mockReturnValue(st);
      (<any>store).store = st;
      geoLocationWatcherRegistry.registerGeoLocationWatcher('my-watcher-id');
      expect(st.getActions()).toEqual([
        {
          type: REGISTER_GEO_LOCATION_WATCHER,
          payload: 'my-watcher-id',
          meta: 'my-watcher-id',
        },
      ]);
      geoLocationWatcherRegistry.registerGeoLocationWatcher('other-watcher');
      expect(st.getActions()[1]).toEqual({
        type: REGISTER_GEO_LOCATION_WATCHER,
        payload: 'other-watcher',
        meta: 'other-watcher',
      });
    });
    describe('and no watchId is defined', () => {
      it('should subscribe to geo location watch event and set watch id', () => {
        const geoLocation = {
          watchPosition: jest.fn().mockReturnValue(123456),
        };
        (<any>navigator).geolocation = geoLocation;
        geoLocationWatcherRegistry.registerGeoLocationWatcher('my-watcher');
        expect(geoLocation.watchPosition).toBeCalledTimes(1);
        expect(geoLocationWatcherRegistry.watchId).toEqual(123456);
      });
    });
    describe('and watchId is defined', () => {
      it('should not subscribe to geoLocation watch event neither set event', () => {
        (<any>geoLocationWatcherRegistry).watchId = 1111;
        const geoLocation = {
          watchPosition: jest.fn().mockReturnValue(123456),
        };
        (<any>navigator).geolocation = geoLocation;
        geoLocationWatcherRegistry.registerGeoLocationWatcher('my-watcher');
        expect(geoLocation.watchPosition).not.toBeCalled();
      });
    });
  });
  describe('When invoking unregisterGeoLocationWatcher with a watcherId', () => {
    it('should dispatch an action to the store', () => {
      const st: any = mockStore({});
      (<any>store).store = st;
      geoLocationWatcherRegistry.unregisterGeoLocationWatcher('my-watcher-id');
      expect(st.getActions()).toEqual([
        {type: UNREGISTER_GEO_LOCATION_WATCHER, meta: 'my-watcher-id'},
      ]);
      geoLocationWatcherRegistry.unregisterGeoLocationWatcher('other-watcher');
      expect(st.getActions()[1]).toEqual({
        type: UNREGISTER_GEO_LOCATION_WATCHER,
        meta: 'other-watcher',
      });
    });
  });
});
