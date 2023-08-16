import * as node_map_1 from "../util/node-map";
function default_1(src, tar) {
  var realtar = node_map_1.default[tar.__id];
  var realSrc = node_map_1.default[src.__id];
  // We don't do parentNode.removeChild because parentNode may report
  // incorrectly in some prollyfills since it's impossible (?) to spoof.
  if (realSrc) {
    realSrc.removeChild(realtar);
  } else {
    var childNodes = realSrc.childNodes;
    var index = childNodes.indexOf(realtar);
    if (index > -1) {
      childNodes.splice(index, 1);
    }
  }
}
export default default_1;
