import { IMap } from "~~/stores/works";
import { edgeTypes, linkTypes } from "./edgeTypes";
export enum MapCategoryEnum {
  liuchengtu = 1,
  siweidaotu = 2,
  shititu = 3,
}

export interface IMapNode {
  id: number;
  text: string;
  // linkNumber?: number;
  group?: string;
  url?: string;
  next?: Array<number | IMapNextion>;
  editable?: boolean;
  edgeType?: keyof typeof edgeTypes;
}

export interface IMapNextion {
  link?: string;
  text?: string;
  id: number;
  index?: number;
}

export interface IMapNextionWithNode extends IMapNextion {
  node: IMapNode;
}

export interface IMapNextionEvent {
  tag: HTMLElement;
  nextion: IMapNextionWithNode;
}

export interface MapLinked {
  text: string;
  linkType: keyof typeof linkTypes;
}

export interface IMapSetting {
  pan: {
    x: number;
    y: number;
  };
  zoom: number;
}

export interface IMapObject extends IMap {
  styles: string[];
  type: string;
  raw: IMapNode[];
  setting: IMapSetting;
  category: MapCategoryEnum;
  id: number;
  folderId: number;
}

export interface MapConfig {
  theme: string;
  startOnLoad: boolean;
  securityLevel: string;
  flowchart: {
    useMaxWidth: boolean;
  };
}

export interface EdgeType {
  [key: string]: {
    type: string;
    open: string;
    close: string;
    label: string;
  };
}

export interface LinkType {
  [key: string]: {
    code: string;
    codeWithText: string;
  };
}

export interface FlowchartMap extends IMapObject {}
