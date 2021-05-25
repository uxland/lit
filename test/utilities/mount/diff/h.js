import * as text_1 from "./text";
import * as root_1 from "./util/root";
import * as weak_map_1 from "./util/weak-map";
// @ts-ignore
var HTMLElement = root_1.default.HTMLElement;
// @ts-ignore
var localNameMap = new weak_map_1.default();
function ensureNodes(arr) {
  var out = [];
  if (!Array.isArray(arr)) {
    arr = [arr];
  }
  arr.filter(Boolean).forEach(function (item) {
    if (Array.isArray(item)) {
      out = out.concat(ensureNodes(item));
    } else if (typeof item === "object") {
      out.push(translateFromReact(item));
    } else {
      out.push(text_1.default(item));
    }
  });
  return out;
}
function ensureObject(val) {
  return val && typeof val === "object" ? val : {};
}
function isNode(arg) {
  return (
    arg &&
    (typeof arg === "string" ||
      Array.isArray(arg) ||
      typeof arg.nodeType === "number" ||
      isReactNode(arg))
  );
}
function isReactNode(item) {
  return item && item.type && item.props;
}
function translateFromReact(item) {
  if (isReactNode(item)) {
    var props = item.props;
    var chren = ensureNodes(props.children);
    delete props.children;
    return {
      attributes: props,
      childNodes: chren,
      localName: item.type,
      nodeType: 1,
    };
  }
  return item;
}
var count = 0;
function default_1(localName, props) {
  var chren = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    chren[_i - 2] = arguments[_i];
  }
  var isPropsNode = isNode(props);
  if (isPropsNode) {
    chren = ensureNodes([props].concat(chren));
    props = {
      attributes: {},
      events: {},
      properties: {},
    };
  } else {
    props = ensureObject(props);
    chren = ensureNodes(chren);
  }
  // If it's a function that isn't an HTMLElement constructor. We test for a
  // common property since this may be used in a worker / non browser
  // environment.
  if (localName.prototype instanceof HTMLElement) {
    var cache = localNameMap.get(localName);
    if (cache) {
      return cache;
    }
    // eslint-disable-next-line new-cap
    var tempLocalName = new localName().localName;
    localNameMap.set(localName, tempLocalName);
    localName = tempLocalName;
  } else if (typeof localName === "function") {
    return localName(props, chren);
  }
  var node = {
    __id: ++count,
    childNodes: chren,
    localName: localName,
    nodeType: 1,
  };
  // Special props
  //
  // - aria: object that sets aria-* attributes
  // - attributes: object of attributes to set
  // - data: object that sets data-* attributes
  // - events: object of event listeners to set
  var aria = props.aria,
    attributes = props.attributes,
    data = props.data,
    events = props.events;
  // @ts-ignore
  node.attributes = ensureObject(attributes);
  // @ts-ignore
  node.events = ensureObject(events);
  // @ts-ignore
  node.properties = ensureObject(props);
  // @ts-ignore
  var nodeAttributes = node.attributes;
  // Aria attributes
  if (typeof aria === "object") {
    for (var name_1 in aria) {
      nodeAttributes["aria-" + name_1] = aria[name_1];
    }
  }
  // Data attributes
  if (typeof data === "object") {
    for (var name_2 in data) {
      nodeAttributes["data-" + name_2] = data[name_2];
    }
  }
  // Clean up special props.
  delete props.aria;
  delete props.attributes;
  delete props.data;
  delete props.events;
  return node;
}
export default default_1;
