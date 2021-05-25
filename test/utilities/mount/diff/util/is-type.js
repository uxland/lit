import * as root_1 from "./root";
// @ts-ignore
var Node = root_1.default.Node;
var ELEMENT_NODE = Node.ELEMENT_NODE,
  DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE,
  TEXT_NODE = Node.TEXT_NODE;
exports.isNode = function (e, t) {
  return e.nodeType === t;
};
exports.isElement = function (e) {
  return exports.isNode(e, ELEMENT_NODE);
};
exports.isFragment = function (e) {
  return exports.isNode(e, DOCUMENT_FRAGMENT_NODE);
};
exports.isText = function (e) {
  return exports.isNode(e, TEXT_NODE);
};
exports.isType = function (v, t) {
  return typeof v === t;
};
exports.isString = function (v) {
  return exports.isType(v, "string");
};
