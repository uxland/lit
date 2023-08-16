import * as types_1 from "../types";
var empty = function (v) {
  return v == null;
};
function default_1(src, tar) {
  var srcValues = src.attributes;
  var tarValues = tar.attributes;
  var instructions = [];
  for (var name_1 in srcValues) {
    if (empty(tarValues[name_1])) {
      instructions.push({
        data: { name: name_1 },
        target: tar,
        source: src,
        type: types_1.REMOVE_ATTRIBUTE,
      });
    }
  }
  for (var name_2 in tarValues) {
    var srcValue = srcValues[name_2];
    var tarValue = tarValues[name_2];
    // Only add attributes that have changed.
    if (srcValue !== tarValue && !empty(tarValues[name_2])) {
      instructions.push({
        data: { name: name_2 },
        target: tar,
        source: src,
        type: types_1.SET_ATTRIBUTE,
      });
    }
  }
  return instructions;
}

export default default_1;
