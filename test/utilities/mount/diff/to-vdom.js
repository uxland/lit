import * as is_type_1 from "./util/is-type";
import * as fragment_1 from "./fragment";
import * as h_1 from "./h";
import * as node_map_1 from "./util/node-map";
import * as root_1 from "./util/root";
import * as text_1 from "./text";
import * as weak_map_1 from "./util/weak-map";
// @ts-ignore
var NodeFilter = root_1.default.NodeFilter;
var SHOW_DOCUMENT_FRAGMENT = NodeFilter.SHOW_DOCUMENT_FRAGMENT,
  SHOW_ELEMENT = NodeFilter.SHOW_ELEMENT,
  SHOW_TEXT = NodeFilter.SHOW_TEXT;
// @ts-ignore
var vNodeMap = new weak_map_1.default();
function getAttributes(node) {
  var temp = {};
  var attributes = node.attributes;
  var length = attributes.length;
  for (var a = 0; a < length; a++) {
    var _a = attributes[a],
      name_1 = _a.name,
      value = _a.value;
    temp[name_1] = value;
  }
  return temp;
}
function getFragmentFromString(str) {
  var div = document.createElement("div");
  var fra = document.createDocumentFragment();
  div.innerHTML = str;
  while (div.hasChildNodes()) {
    fra.appendChild(div.firstChild);
  }
  return fra;
}
function getVNode(node) {
  var nodeType = node.nodeType;
  if (nodeType === 3) {
    return text_1.default(node.textContent);
  }
  // @ts-ignore
  var vNode = h_1.default(node.localName);
  vNode.attributes = getAttributes(node);
  node_map_1.default[vNode.__id] = node;
  vNodeMap.set(node, vNode);
  return vNode;
}
function default_1(dom) {
  var vRoot;
  if (is_type_1.isElement(dom)) {
    vRoot = getVNode(dom);
  } else if (is_type_1.isFragment(dom)) {
    // @ts-ignore
    vRoot = fragment_1.default();
  } else if (is_type_1.isString(dom)) {
    dom = getFragmentFromString(dom);
    // @ts-ignore
    vRoot = fragment_1.default();
  }
  var walker = document.createTreeWalker(
    dom,
    SHOW_DOCUMENT_FRAGMENT | SHOW_ELEMENT | SHOW_TEXT,
    null,
    false
  );
  while (walker.nextNode()) {
    var currentNode = walker.currentNode;
    var vNode = getVNode(currentNode);
    var vNodeParent = vNodeMap.get(currentNode.parentNode);
    if (vNodeParent) {
      vNodeParent.childNodes.push(vNode);
    } else {
      vRoot.childNodes.push(vNode);
    }
  }
  return vRoot;
}
export default default_1;
