import * as node_map_1 from "../util/node-map";
function default_1(src, tar, data) {
  var name = data.name;
  node_map_1.default[src.__id].removeAttribute(name);
}
export default default_1;
