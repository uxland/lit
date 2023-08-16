import * as fragment_1 from "./fragment";
import * as merge_1 from "./merge";
import * as to_vdom_1 from "./to-vdom";
import * as weak_map_1 from "./util/weak-map";
// @ts-ignore
var targetMap = new weak_map_1.default();
function default_1(render) {
  return function (node, done) {
    var src = targetMap.get(node) || to_vdom_1.default(node);
    var tar = fragment_1.default(render(node));
    merge_1.default(src, tar, { done: done });
    targetMap.set(node, tar);
  };
}
export default default_1;
