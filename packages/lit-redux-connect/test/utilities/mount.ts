'use strict';
const diff_1 = require('./diff');
// @ts-ignore
const Node = window.Node,
  Promise = window.Promise;
// @ts-ignore
const customElements = window.customElements,
  HTMLElement = window.HTMLElement;
const body = document.body;
const attachShadow = HTMLElement.prototype.attachShadow;
// Ensure we can force sync operations in the polyfill.
if (customElements) {
  Object.defineProperty(customElements, 'enableFlush', {
    value: true,
  });
}
// Create and add a fixture to append nodes to.
const fixture = document.createElement('div');
document.body.appendChild(fixture);
// Override to force mode "open" so we can query against all shadow roots.
HTMLElement.prototype.attachShadow = function () {
  return attachShadow.call(this, {mode: 'open'});
};
// Ensures polyfill operations are run sync.
function flush() {
  // @ts-ignore - it is defined when the polyfill is included.
  if (customElements.flush) {
    // @ts-ignore - it is defined when the polyfill is included.
    customElements.flush();
  }
}
// Abstraction for:
//
// 1. Native
// 2. Non-compliant browers
// 3. JSDOM or environments that only implement querySelector
function matches(node, query) {
  return (node.matches =
    node.matchesSelector ||
    node.mozMatchesSelector ||
    node.msMatchesSelector ||
    node.oMatchesSelector ||
    node.webkitMatchesSelector ||
    function (s) {
      const matches = (this.document || this.ownerDocument).querySelectorAll(s);
      const i = matches.length;
      // while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    }).call(node, query);
}
function getInstantiatedNodeWithinFixture(node, isRootNode) {
  const isStringNode = typeof node === 'string';
  // If the fixture has been removed from the document, re-insert it.
  if (!body.contains(fixture)) {
    body.appendChild(fixture);
  }
  if (isRootNode) {
    setFixtureContent(node, isStringNode);
  }
  return isStringNode ? fixture.children[0] : node;
}
function setFixtureContent(node, shouldSetChildrenViaString) {
  // If this is a new node, clean up the fixture.
  fixture.innerHTML = '';
  // Add the node to the fixture so it runs the connectedCallback().
  shouldSetChildrenViaString ? (fixture.innerHTML = node) : fixture.appendChild(node);
}
const Wrapper = /** @class */ (function () {
  function Wrapper(node, opts?) {
    if (opts === void 0) {
      opts = {};
    }
    this.opts = {};
    const isRootNode = !node.parentNode;
    this.opts = opts;
    this.node = getInstantiatedNodeWithinFixture(node, isRootNode);
    if (customElements && isRootNode) {
      const customElementDefinition = customElements.get(this.node.localName);
      customElementDefinition && flush();
    }
  }
  Object.defineProperty(Wrapper.prototype, 'shadowRoot', {
    get: function () {
      const node = this.node;
      return node.shadowRoot || node;
    },
    enumerable: true,
    configurable: true,
  });
  Wrapper.prototype.all = function (query) {
    const _this = this;
    const shadowRoot = this.shadowRoot;
    const type = typeof query;
    const temp = [];
    if (query.nodeType === Node.ELEMENT_NODE) {
      walkTree(shadowRoot, function (node) {
        if (node.nodeType === query.nodeType && diff_1.diff(node, query).length === 0) {
          temp.push(node);
        }
      });
    } else if (query.prototype instanceof HTMLElement) {
      walkTree(shadowRoot, function (node) {
        return node instanceof query && temp.push(node);
      });
    } else if (type === 'function') {
      walkTree(shadowRoot, function (node) {
        return query(node) && temp.push(node);
      });
    } else if (type === 'object') {
      const keys_1 = Object.keys(query);
      if (keys_1.length === 0) {
        return temp;
      }
      walkTree(shadowRoot, function (node) {
        return (
          keys_1.every(function (key) {
            return node[key] === query[key];
          }) && temp.push(node)
        );
      });
    } else if (type === 'string') {
      walkTree(shadowRoot, function (node) {
        if (matches(node, query)) {
          temp.push(node);
        }
      });
    }
    return temp.map(function (n) {
      return new Wrapper(n, _this.opts);
    });
  };
  Wrapper.prototype.has = function (query) {
    return !!this.one(query);
  };
  Wrapper.prototype.one = function (query) {
    return this.all(query)[0];
  };
  Wrapper.prototype.wait = function (func) {
    if (func === void 0) {
      func = function () {};
    }
    return this.waitFor(function (wrap) {
      return !!wrap.node.shadowRoot;
    }).then(func);
  };
  Wrapper.prototype.waitFor = function (func, _a) {
    const _this = this;
    if (func === void 0) {
      func = function () {};
    }
    const delay = (_a === void 0 ? {delay: 1} : _a).delay;
    return new Promise(function (resolve, reject) {
      const check = function () {
        const ret = (function () {
          try {
            return func(_this);
          } catch (e) {
            reject(e);
          }
        })();
        if (ret) {
          resolve(_this);
        } else {
          setTimeout(check, delay);
        }
      };
      setTimeout(check, delay);
    }).catch(function (e) {
      throw e;
    });
  };
  return Wrapper;
})();
function walkTree(_a, call) {
  const childNodes = _a.childNodes;
  for (let _i = 0, childNodes_1 = childNodes; _i < childNodes_1.length; _i++) {
    const node = childNodes_1[_i];
    call(node);
    if (walkTree(node, call) === false) {
      return false;
    }
  }
}
export function mount(elem) {
  return new Wrapper(elem);
}
export function wait(ms) {
  if (ms === void 0) {
    ms = 0;
  }
  return new Promise(function (res) {
    setTimeout(res, ms);
  });
}
