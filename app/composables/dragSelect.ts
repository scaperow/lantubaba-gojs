import DragSelect from "dragselect";

export function dragSelect<T>(settings: Partial<Settings>) {
  const ds = new DragSelect({ ...settings });
  const updateSettings = (setting: Settings) => {
    ds.setSettings(setting);
  };
  return {
    updateSettings,
    ds,
  };
}
