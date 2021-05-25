import * as types from "../types";
function default_1(src, tar) {
  if (src.textContent === tar.textContent) {
    return [];
  }
  return [
    {
      target: tar,
      source: src,
      type: types.TEXT_CONTENT,
    },
  ];
}
export default default_1;
