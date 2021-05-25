import * as weak_map_1 from "./weak-map";
// @ts-ignore
var map = new weak_map_1.default();
function default_1(elem) {
  var events = map.get(elem);
  events || map.set(elem, (events = {}));
  return events;
}
export default default_1;
