"use strict";
// Because weak map polyfills either are too big or don't use native if
// available properly.
Object.defineProperty(exports, "__esModule", { value: true });
var index = 0;
var prefix = "__WEAK_MAP_POLYFILL_";
export default (function () {
  if (typeof WeakMap !== "undefined") {
    return WeakMap;
  }
  function Polyfill() {
    this.key = prefix + index;
    ++index;
  }
  Polyfill.prototype = {
    get: function (obj) {
      return obj[this.key];
    },
    set: function (obj, val) {
      obj[this.key] = val;
    },
  };
  return Polyfill;
})();
