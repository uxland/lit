import * as node_map_1 from "../util/node-map";
import * as to_dom_1 from "../to-dom";
function default_1(src, tar) {
  node_map_1.default[src.__id].appendChild(to_dom_1.default(tar));
}
export default default_1;
