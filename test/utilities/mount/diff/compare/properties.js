import * as types_1 from "../types";
function default_1(src, tar) {
  var srcValues = src.properties;
  var tarValues = tar.properties;
  var instructions = [];
  for (var name_1 in srcValues) {
    var srcValue = srcValues[name_1];
    var tarValue = tarValues[name_1];
    if (srcValue !== tarValue) {
      instructions.push({
        data: { name: name_1 },
        target: tar,
        source: src,
        type: types_1.SET_PROPERTY,
      });
    }
  }
  for (var name_2 in tarValues) {
    var srcValue = srcValues[name_2];
    var tarValue = tarValues[name_2];
    if (srcValue !== tarValue) {
      instructions.push({
        data: { name: name_2 },
        target: tar,
        source: src,
        type: types_1.SET_PROPERTY,
      });
    }
  }
  return instructions;
}

export default default_1;
