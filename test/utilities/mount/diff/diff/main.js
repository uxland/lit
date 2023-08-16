import * as types from "../types";
import * as node_1 from "../compare/node";
function diffNode(source, target) {
  var nodeInstructions = node_1.default(source, target);
  // If there are instructions (even an empty array) it means the node can be
  // diffed and doesn't have to be replaced. If the instructions are falsy
  // it means that the nodes are not similar (cannot be changed) and must be
  // replaced instead.
  if (nodeInstructions) {
    return nodeInstructions.concat(diff(source, target));
  }
  return [
    {
      target: target,
      source: source,
      type: types.REPLACE_CHILD,
    },
  ];
}
function diff(src, tar) {
  var instructions = [];
  var srcChs = src.childNodes;
  var tarChs = tar.childNodes;
  var srcChsLen = srcChs ? srcChs.length : 0;
  var tarChsLen = tarChs ? tarChs.length : 0;
  for (var a = 0; a < tarChsLen; a++) {
    var curSrc = srcChs[a];
    var curtar = tarChs[a];
    // If there is no matching target node it means we need to remove the
    // current source node from the source.
    if (!curSrc) {
      instructions.push({
        target: tarChs[a],
        source: src,
        type: types.APPEND_CHILD,
      });
      continue;
    }
    instructions = instructions.concat(diffNode(curSrc, curtar));
  }
  if (tarChsLen < srcChsLen) {
    for (var a = tarChsLen; a < srcChsLen; a++) {
      instructions.push({
        target: srcChs[a],
        source: src,
        type: types.REMOVE_CHILD,
      });
    }
  }
  return instructions;
}
export default diff;
