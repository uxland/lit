import * as diff_1 from "./diff";
import * as patch_1 from "./patch";
// @ts-ignore
function default_1(src, tar, _a) {
  var done = (_a === void 0 ? {} : _a).done;
  if (done) {
    // @ts-ignore
    return diff_1.default(src, tar, {
      done: function (instructions) {
        patch_1.default(instructions);
        done(instructions);
      },
    });
  }
  var instructions = diff_1.default(src, tar);
  patch_1.default(instructions);
  return instructions;
}
export default default_1;
