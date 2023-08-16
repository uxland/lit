import {configureStore} from '../../../../../../test/utilities/redux-mock-store';
import {setLastPosition, SET_LAST_POSITION_ACTION} from '../../../../app/geo-location';
import * as store from '../../../../store';
const mockStore = configureStore([]);
describe('set last position', () => {
  const position: Position = {
    coords: {
      longitude: 2,
      latitude: 43,
      altitude: 180,
      accuracy: 1.0,
      altitudeAccuracy: 0.98,
      heading: 1,
      speed: 120,
    },
    timestamp: performance.now(),
  };
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  describe('When invoking set last position', () => {
    describe('with a position', () => {
      it('should dispatch an action to the the store', () => {
        const st: any = mockStore({});
        (<any>store).store = st;
        setLastPosition(position);
        expect(st.getActions()).toEqual([{type: SET_LAST_POSITION_ACTION, payload: position}]);
      });
    });
  });
});
