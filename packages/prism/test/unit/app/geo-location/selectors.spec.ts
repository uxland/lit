import {GeoLocationState} from '../../../../src/app/geo-location';
import * as selectors from '../../../../src/app/geo-location/selectors';
import * as appSelector from '../../../../src/app/selector';

describe('app geo location selectors', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  describe('geo location selector', () => {
    describe('When invoking geoLocationSelector', () => {
      describe('and state is undefined', () => {
        it('should return undefined', () => {
          jest.spyOn(appSelector, 'appSelector').mockImplementation(() => undefined);
          const geoLocation = selectors.geoLocationSelector(undefined);
          expect(geoLocation).toBeUndefined();
        });
      });
      describe('and state is null', () => {
        it('should return undefined', () => {
          jest.spyOn(appSelector, 'appSelector').mockImplementation(() => undefined);
          const geoLocation = selectors.geoLocationSelector(null);
          expect(geoLocation).toBeUndefined();
        });
      });
      describe('and state app is undefined', () => {
        it('should return undefined', () => {
          const geoLocation = selectors.geoLocationSelector(<any>{
            app: undefined,
          });
          expect(geoLocation).toBeUndefined();
        });
      });
      describe('and state app is null', () => {
        it('should return undefined', () => {
          const geoLocation = selectors.geoLocationSelector(<any>{app: null});
          expect(geoLocation).toBeUndefined();
        });
      });
      describe('and state geo location is null', () => {
        it('should return null', () => {
          expect(selectors.geoLocationSelector(<any>{app: {geoLocation: null}})).toBeNull();
        });
      });
      describe('and state geo location is undefined', () => {
        it('should return null', () => {
          expect(
            selectors.geoLocationSelector(<any>{
              app: {geoLocation: undefined},
            })
          ).toBeUndefined();
        });
      });
      describe('and geo location is set', () => {
        it('should return state app geo location', () => {
          const geoLocationState: GeoLocationState = {
            registeredWatchers: {watcher1: 'myWatcher'},
            lastKnownPosition: <any>{},
          };
          const state = {app: {geoLocation: geoLocationState}};
          expect(selectors.geoLocationSelector(<any>state)).toBe(geoLocationState);
          const geoLocationState2: GeoLocationState = {
            registeredWatchers: {watcher: 'otherWatcher'},
            lastKnownPosition: <any>{},
          };
          expect(
            selectors.geoLocationSelector(<any>{
              app: {geoLocation: geoLocationState2},
            })
          ).toBe(geoLocationState2);
        });
      });
    });
  });
  describe('last known position selector', () => {
    describe('When invoking lastKnownPositionSelector', () => {
      describe('and state is undefined', () => {
        it('should return undefined', () => {
          jest.spyOn(selectors, 'geoLocationSelector').mockReturnValue(undefined);
          expect(selectors.lastKnownPositionSelector(undefined)).toBe(undefined);
        });
      });
      describe('and state is null', () => {
        it('should return undefined', () => {
          jest.spyOn(selectors, 'geoLocationSelector').mockReturnValue(null);
          expect(selectors.lastKnownPositionSelector(null)).toBeUndefined();
        });
      });
      describe('and state app is undefined', () => {
        it('should return undefined', () => {
          expect(selectors.lastKnownPositionSelector(<any>{app: undefined})).toBeUndefined();
        });
      });
      describe('and state app is null', () => {
        it('should return undefined', () => {
          expect(selectors.lastKnownPositionSelector(<any>{app: null})).toBeUndefined();
        });
      });
      describe('and state geo location is null', () => {
        it('should return undefined', () => {
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: null},
            })
          ).toBeUndefined();
        });
      });
      describe('and state geo location is undefined', () => {
        it('should return null', () => {
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: undefined},
            })
          ).toBeUndefined();
        });
      });
      describe('and state last known position is null', () => {
        it('should return null', () => {
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: {lastKnownPosition: null}},
            })
          ).toBeNull();
        });
      });
      describe('and state last known position is undefined', () => {
        it('should return undefined', () => {
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: {lastKnownPosition: undefined}},
            })
          ).toBeUndefined();
        });
      });
      describe('and state last known position is set', () => {
        it('should return state last known position', () => {
          const position: Position = {
            timestamp: Date.now(),
            coords: {
              speed: 120,
              heading: 1,
              altitudeAccuracy: 2.0,
              accuracy: 1.0,
              altitude: 150,
              latitude: 2,
              longitude: 42,
            },
          };
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: {lastKnownPosition: position}},
            })
          ).toBe(position);
          const otherPosition: Position = {
            timestamp: Date.now(),
            coords: {
              speed: 80,
              heading: 2,
              altitudeAccuracy: 0.5,
              accuracy: 2,
              altitude: 0,
              latitude: 50,
              longitude: 30,
            },
          };
          expect(
            selectors.lastKnownPositionSelector(<any>{
              app: {geoLocation: {lastKnownPosition: otherPosition}},
            })
          ).toBe(otherPosition);
        });
      });
    });
  });
  describe('registered watchers selectors', () => {
    describe('When invoking registeredWatchersSelector', () => {
      describe('and state is undefined', () => {
        it('should return undefined', () => {
          jest.spyOn(selectors, 'geoLocationSelector').mockReturnValue(undefined);
          expect(selectors.registeredWatchersSelector(undefined)).toBeUndefined();
        });
      });
      describe('and state is null', () => {
        it('should return undefined', () => {
          jest.spyOn(selectors, 'geoLocationSelector').mockReturnValue(null);
          expect(selectors.registeredWatchersSelector(null)).toBeUndefined();
        });
      });
      describe('and state app is undefined', () => {
        it('should return undefined', () => {
          expect(selectors.registeredWatchersSelector(<any>{app: undefined})).toBeUndefined();
        });
      });
      describe('and state app is null', () => {
        it('should return undefined', () => {
          expect(selectors.registeredWatchersSelector(<any>{app: null})).toBeUndefined();
        });
      });
      describe('and state geo location is null', () => {
        it('should return undefined', () => {
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: null},
            })
          ).toBeUndefined();
        });
      });
      describe('and state geo location is undefined', () => {
        it('should return null', () => {
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: undefined},
            })
          ).toBeUndefined();
        });
      });
      describe('and state registered watchers is null', () => {
        it('should return null', () => {
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: {registeredWatchers: null}},
            })
          ).toBeNull();
        });
      });
      describe('and state registered watcher is undefined', () => {
        it('should return undefined', () => {
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: {registeredWatchers: undefined}},
            })
          ).toBeUndefined();
        });
      });
      describe('and state registered watchers is set', () => {
        it('should return state last known position', () => {
          const watchers = {watcher1: 'watcher1'};
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: {registeredWatchers: watchers}},
            })
          ).toBe(watchers);
          const otherWatchers = {
            watcher2: 'my-watcher',
            watcher3: 'another watcher',
          };
          expect(
            selectors.registeredWatchersSelector(<any>{
              app: {geoLocation: {registeredWatchers: otherWatchers}},
            })
          ).toBe(otherWatchers);
        });
      });
    });
  });
});
