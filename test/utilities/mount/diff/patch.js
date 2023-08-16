import * as types from "./types";
import * as append_child_1 from "./patch/append-child";
import * as remove_child_1 from "./patch/remove-child";
import * as remove_attribute_1 from "./patch/remove-attribute";
import * as replace_child_1 from "./patch/replace-child";
import * as set_attribute_1 from "./patch/set-attribute";
import * as set_event_1 from "./patch/set-event";
import * as set_property_1 from "./patch/set-property";
import * as text_content_1 from "./patch/text-content";
var patchers = {};
patchers[types.APPEND_CHILD] = append_child_1.default;
patchers[types.REMOVE_CHILD] = remove_child_1.default;
patchers[types.REMOVE_ATTRIBUTE] = remove_attribute_1.default;
patchers[types.REPLACE_CHILD] = replace_child_1.default;
patchers[types.SET_EVENT] = set_event_1.default;
patchers[types.SET_ATTRIBUTE] = set_attribute_1.default;
patchers[types.SET_PROPERTY] = set_property_1.default;
patchers[types.TEXT_CONTENT] = text_content_1.default;
function patch(instruction) {
  patchers[instruction.type](
    instruction.source,
    instruction.target,
    instruction.data
  );
}
function default_1(instructions) {
  instructions.forEach(patch);
}
export default default_1;
