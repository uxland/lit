import * as attributes_1 from "./attributes";
import * as events_1 from "./events";
import * as properties_1 from "./properties";
function default_1(src, tar) {
  if (src.localName === tar.localName) {
    return attributes_1
      .default(src, tar)
      .concat(events_1.default(src, tar))
      .concat(properties_1.default(src, tar));
  }
}
export default default_1;
