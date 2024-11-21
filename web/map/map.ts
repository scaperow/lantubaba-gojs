enum MapMenuName {
  CREATE,
  DELETE,
}
enum MAPOBJECT {
  NODE,
  LINE,
}
interface MapMenu {
  label: string;
  name: string;
  handler: () => {};
}
interface Node {}
interface Line {}
abstract class BaseMap {
  rawObject: any;
  onUpdate: () => void;
  constructor(rawObject: any, { onUpdate }: { onUpdate: () => void }) {
    this.rawObject = rawObject;
    this.onUpdate = onUpdate;
  }

  abstract getCode: () => string;
  abstract getMenu: () => MapMenu[];
}
