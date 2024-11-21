import { shapeMaps } from "./shapes";

export interface MapNode {
  id: number;
  linkStyle?: string;
  linkNumber?: number;
  links?: [];
  group?: string;
  url?: string;
  text: string;
  link?: MapLink;
  next?: string[];
  style?: string;
  editable?: boolean;
  edgeType?: keyof typeof shapeMaps;
}

export interface MapLink {
  style: string;
  text?: string;
}

export interface MapObject {
  nodes: MapNode[];
  styles: string[];

  type: string;//
  // type: {
  //   type: String,
  //   default: "graph TD",
  // },
}

export interface FlowchartMap extends MapObject {}
