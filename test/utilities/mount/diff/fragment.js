var nodeType = 11;
function default_1(childNodes) {
  childNodes = childNodes || [];
  childNodes = Array.isArray(childNodes) ? childNodes : [childNodes];
  return { childNodes: childNodes, nodeType: nodeType };
}
export default default_1;
