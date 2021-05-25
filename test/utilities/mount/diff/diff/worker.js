import * as main_1 from "./main";
self.addEventListener("message", function (e) {
  var instructions = main_1.default.apply(null, e.data);
  // @ts-ignore
  self.postMessage(instructions);
});
