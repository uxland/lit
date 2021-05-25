import * as element_1 from "./element";
import * as text_1 from "./text";
var NODE_ELEMENT = 1;
var NODE_TEXT = 3;
function default_1(src, tar) {
  var tarType = tar.nodeType;
  var srcType = src.nodeType;
  if (tarType !== srcType) {
    return [];
  } else if (tarType === NODE_ELEMENT) {
    return element_1.default(src, tar);
  } else if (tarType === NODE_TEXT) {
    return text_1.default(src, tar);
  }
  return [];
}
export default default_1;
