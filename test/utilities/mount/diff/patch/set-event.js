import * as event_map_1 from "../util/event-map";
import * as node_map_1 from "../util/node-map";
function default_1(src, tar, data) {
  var realSrc = node_map_1.default[src.__id];
  var eventHandlers = event_map_1.default(realSrc);
  var name = data.name;
  var prevHandler = eventHandlers[name];
  var nextHandler = data.value;
  if (typeof prevHandler === "function") {
    delete eventHandlers[name];
    realSrc.removeEventListener(name, prevHandler);
  }
  if (typeof nextHandler === "function") {
    eventHandlers[name] = nextHandler;
    realSrc.addEventListener(name, nextHandler);
  }
}
export default default_1;
