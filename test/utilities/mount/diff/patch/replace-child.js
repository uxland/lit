import * as to_dom_1 from "../to-dom";
import * as node_map_1 from "../util/node-map";
function default_1(src, tar) {
  var realSrc = node_map_1.default[src.__id];
  if (realSrc) {
    realSrc.parentNode &&
      realSrc.parentNode.replaceChild(to_dom_1.default(tar), realSrc);
  } else {
    src.__id = tar.__id;
    src.nodeType = tar.nodeType;
    src.localName = tar.localName;
    src.attributes = tar.attributes;
    src.events = tar.events;
    src.childNodes = tar.childNodes;
  }
}
export default default_1;
