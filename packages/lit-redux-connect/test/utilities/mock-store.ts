import * as _lodash2 from 'lodash';
import * as _redux from '../../../../node_modules/redux/es/redux';

const isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    let arr2;
    for (let i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

export function configureStore() {
  const middlewares = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return function mockStore() {
    const _getState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function mockStoreWithoutMiddleware() {
      let actions = [];
      const listeners = [];

      const self = {
        getState: function getState() {
          return isFunction(_getState) ? _getState(actions) : _getState;
        },
        getActions: function getActions() {
          return actions;
        },
        dispatch: function dispatch(action) {
          if (!(0, _lodash2.default)(action)) {
            throw new Error(
              'Actions must be plain objects. ' + 'Use custom middleware for async actions.'
            );
          }

          if (typeof action.type === 'undefined') {
            throw new Error(
              'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant? ' +
                'Action: ' +
                JSON.stringify(action)
            );
          }

          actions.push(action);

          for (let i = 0; i < listeners.length; i++) {
            listeners[i]();
          }

          return action;
        },
        clearActions: function clearActions() {
          actions = [];
        },
        subscribe: function subscribe(cb) {
          if (isFunction(cb)) {
            listeners.push(cb);
          }

          return function () {
            const index = listeners.indexOf(cb);

            if (index < 0) {
              return;
            }
            listeners.splice(index, 1);
          };
        },
        replaceReducer: function replaceReducer(nextReducer) {
          if (!isFunction(nextReducer)) {
            throw new Error('Expected the nextReducer to be a function.');
          }
        },
      };

      return self;
    }

    const mockStoreWithMiddleware = _redux.applyMiddleware.apply(
      undefined,
      _toConsumableArray(middlewares)
    )(mockStoreWithoutMiddleware);

    return mockStoreWithMiddleware();
  };
}
