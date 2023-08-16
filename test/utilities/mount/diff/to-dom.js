import * as event_map_1 from "./util/event-map";
import * as node_map_1 from "./util/node-map";
import * as root_1 from "./util/root";
// @ts-ignore
var Node = root_1.default.Node;
function createElement(node) {
  var attributes = node.attributes,
    childNodes = node.childNodes,
    events = node.events,
    properties = node.properties;
  var realNode = document.createElement(node.localName);
  var eventHandlers = event_map_1.default(realNode);
  if (attributes) {
    for (var name_1 in attributes) {
      realNode.setAttribute(name_1, attributes[name_1]);
    }
  }
  if (childNodes) {
    childNodes.forEach(function (ch) {
      return realNode.appendChild(render(ch));
    });
  }
  if (events) {
    for (var name_2 in events) {
      realNode.addEventListener(
        name_2,
        (eventHandlers[name_2] = events[name_2])
      );
    }
  }
  if (properties) {
    for (var name_3 in properties) {
      realNode[name_3] = properties[name_3];
    }
  }
  return realNode;
}
function createText(el) {
  return document.createTextNode(el.textContent);
}
function render(node) {
  if (node instanceof Node) {
    return node;
  }
  if (Array.isArray(node)) {
    var frag_1 = document.createDocumentFragment();
    node.forEach(function (item) {
      return frag_1.appendChild(render(item));
    });
    return frag_1;
  }
  var realNode = node.localName ? createElement(node) : createText(node);
  node_map_1.default[node.__id] = realNode;
  return realNode;
}
export default render;
