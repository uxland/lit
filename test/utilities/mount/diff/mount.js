import * as to_dom_1 from "./to-dom";
function find(selector) {
  var found = document.querySelector(selector);
  if (!found) {
    throw new Error("No mount node found for selector: " + selector + ".");
  }
  return found;
}
function default_1(tree, elem) {
  if (elem === void 0) {
    elem = document.createElement("div");
  }
  if (!elem) {
    throw new Error("No mount node provided.");
  }
  if (typeof elem === "string") {
    elem = find(elem);
  }
  elem.innerHTML = "";
  elem.appendChild(to_dom_1.default(tree));
  return elem;
}
export default default_1;
