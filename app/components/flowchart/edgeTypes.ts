import { EdgeType, LinkType } from "./interface";

// export const edgeTypes: EdgeType[] = [
//   { type: "node", open: "[", close: "]", label: "节点" },
//   { type: "circle", open: "((", close: "))", label: "节点" },
//   { type: "double-circle", open: "(((", close: ")))", label: "双圆节点" },
//   { type: "cylindrical", open: "[(", close: ")]", label: "数据库" },
//   { type: "trapezoid", open: `[/`, close: `\]`, label: "操作" },
//   { type: "trapezoid-alt", open: `[\\`, close: `/]`, label: "操作" },
//   { type: "rhombus", open: `{`, close: `}`, label: "条件/分支" },
//   { type: "rounded", open: `(`, close: `/)`, label: "流程" },
//   { type: "stadium", open: `([`, close: `])`, label: "开始/结束" },
//   { type: "subroutine", open: `[[`, close: `]]`, label: "预定义" },
//   { type: "asymmetric", open: `>`, close: `]`, label: "节点" },
//   { type: "hexagon", open: `{{`, close: `}}`, label: "处理" },
//   { type: "parallelogram", open: `[/`, close: `/]`, label: "节点" },
//   { type: "parallelogram-alt", open: `[\\`, close: `\]`, label: "节点" },
// ];

export const edgeTypes: EdgeType = {
  node: { type: "node", open: "[", close: "]", label: "节点" },
  circle: { type: "circle", open: "((", close: "))", label: "节点" },
  "double-circle": { type: "double-circle", open: "(((", close: ")))", label: "双圆节点" },
  cylindrical: { type: "cylindrical", open: "[(", close: ")]", label: "数据库" },
  trapezoid: { type: "trapezoid", open: `[/`, close: `\\]`, label: "操作" },
  "trapezoid-alt": { type: "trapezoid-alt", open: `[\\\\`, close: `/]`, label: "操作" },
  rhombus: { type: "rhombus", open: `{`, close: `}`, label: "条件/分支" },
  rounded: { type: "rounded", open: `(`, close: `/)`, label: "流程" },
  stadium: { type: "stadium", open: `([`, close: `])`, label: "开始/结束" },
  subroutine: { type: "subroutine", open: `[[`, close: `]]`, label: "预定义" },
  asymmetric: { type: "asymmetric", open: `>`, close: `]`, label: "节点" },
  hexagon: { type: "hexagon", open: `{{`, close: `}}`, label: "处理" },
  parallelogram: { type: "parallelogram", open: `[/`, close: `/]`, label: "节点" },
  "parallelogram-alt": { type: "parallelogram-alt", open: `[\\`, close: `\]`, label: "节点" },
};

export const linkTypes: LinkType = {
  arrow: { code: "-->", codeWithText: "" },
  open: {code: " ", codeWithText: ""}
};
