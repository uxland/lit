import {
  GeoLocationState,
  reducer,
  REGISTER_GEO_LOCATION_WATCHER,
  SET_LAST_POSITION_ACTION,
  UNREGISTER_GEO_LOCATION_WATCHER,
} from '../../../../src/app/geo-location';
const position: Position = {
  timestamp: Date.now(),
  coords: {
    speed: 120,
    heading: null,
    altitudeAccuracy: 2.0,
    accuracy: 2.0,
    altitude: 130,
    latitude: 45.23,
    longitude: 38.43,
  },
};

describe('app geo location reducer', () => {
  describe('When invoking reducer method', () => {
    describe('and action type is not related to geo location', () => {
      describe('and state is undefined', () => {
        it('should return default state', () => {
          const defaultState: GeoLocationState = {
            registeredWatchers: {},
            lastKnownPosition: null,
          };
          const nextState = reducer(undefined, {type: '@@ANY'});
          expect(nextState).toEqual(defaultState);
        });
      });
      describe('and state is defined', () => {
        it('should return state supplied', () => {
          const state: GeoLocationState = {
            registeredWatchers: {watcher1: 'watcher1'},
            lastKnownPosition: position,
          };
          const nextState = reducer(state, {type: '@@ANY'});
          expect(nextState).toBe(state);
        });
      });
    });
    describe('and action is set last position', () => {
      it('should return a new state with lastKnown updated', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newPosition: Position = {
          timestamp: Date.now(),
          coords: {
            longitude: 1,
            latitude: 1,
            altitude: 1,
            accuracy: 1,
            altitudeAccuracy: 1,
            heading: 1,
            speed: 1,
          },
        };
        const newState = reducer(state, {
          type: SET_LAST_POSITION_ACTION,
          payload: newPosition,
        });
        expect(newState).not.toBe(state);
        expect(newState.lastKnownPosition).toBe(newPosition);
      });
      it('should return same registered watcher', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newPosition: Position = {
          timestamp: Date.now(),
          coords: {
            longitude: 1,
            latitude: 1,
            altitude: 1,
            accuracy: 1,
            altitudeAccuracy: 1,
            heading: 1,
            speed: 1,
          },
        };
        const newState = reducer(state, {
          type: SET_LAST_POSITION_ACTION,
          payload: newPosition,
        });
        expect(newState.registeredWatchers).toBe(state.registeredWatchers);
      });
    });
    describe('and action is register watcher', () => {
      it('should return a new state with the new watcher registered', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newState = reducer(state, {
          type: REGISTER_GEO_LOCATION_WATCHER,
          payload: 'watcher2',
          meta: 'watcher2',
        });
        expect(newState).not.toBe(state);
        expect(newState.registeredWatchers).toEqual({
          watcher1: 'watcher1',
          watcher2: 'watcher2',
        });
        const newState2 = reducer(state, {
          type: REGISTER_GEO_LOCATION_WATCHER,
          payload: 'myWatcher',
          meta: 'watcher3',
        });
        expect(newState2.registeredWatchers).toEqual({
          watcher1: 'watcher1',
          watcher3: 'myWatcher',
        });
      });
      it('should return same position', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newState = reducer(state, {
          type: REGISTER_GEO_LOCATION_WATCHER,
          payload: 'watcher2',
          meta: 'watcher2',
        });
        expect(newState.lastKnownPosition).toBe(state.lastKnownPosition);
      });
      describe('and watcher already exists', () => {
        it('should replace watcher with the new one', () => {
          const state: GeoLocationState = {
            registeredWatchers: {watcher1: 'watcher1'},
            lastKnownPosition: position,
          };
          const newState = reducer(state, {
            type: REGISTER_GEO_LOCATION_WATCHER,
            payload: 'myNewWatcher',
            meta: 'watcher1',
          });
          expect(newState.registeredWatchers.watcher1).toEqual('myNewWatcher');
        });
      });
    });
    describe('and action is unregister watcher', () => {
      it('should return a new state without the watcher supplied in action meta property', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newState = reducer(state, {
          type: UNREGISTER_GEO_LOCATION_WATCHER,
          meta: 'watcher1',
        });
        expect(Object.getOwnPropertyDescriptor(newState, 'watcher1')).not.toBeDefined();
        expect(newState).not.toBe(state);
      });
      it('should return same input state if watcher does not exist', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newState = reducer(state, {
          type: UNREGISTER_GEO_LOCATION_WATCHER,
          meta: 'watcher2',
        });
        expect(newState.registeredWatchers.watcher1).toBeDefined();
        expect(newState).toBe(state);
      });
      it('should return same position', () => {
        const state: GeoLocationState = {
          registeredWatchers: {watcher1: 'watcher1'},
          lastKnownPosition: position,
        };
        const newState = reducer(state, {
          type: UNREGISTER_GEO_LOCATION_WATCHER,
          meta: 'watcher1',
        });
        expect(newState.lastKnownPosition).toBe(state.lastKnownPosition);
      });
    });
  });
});
