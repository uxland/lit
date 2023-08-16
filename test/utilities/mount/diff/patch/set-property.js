import * as node_map_1 from "../util/node-map";
var propToAttrMap = {
  className: "class",
};
function default_1(src, tar, data) {
  var name = data.name;
  var node = node_map_1.default[src.__id];
  var prop = tar.properties[name];
  var mapped = propToAttrMap[name];
  if (mapped) {
    if (prop == null) {
      node.removeAttribute(mapped);
    } else {
      node.className = prop;
    }
  } else if (name === "style") {
    var style = node.style;
    // Clear so we don't have to diff.
    style.cssText = "";
    // Handle both strings and objects.
    if (typeof prop === "string") {
      style.cssText = prop;
    } else {
      for (var name_1 in prop) {
        if (prop.hasOwnProperty(name_1)) {
          style[name_1] = prop[name_1];
        }
      }
    }
  } else {
    node[name] = prop;
  }
}
export default default_1;
