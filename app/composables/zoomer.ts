import { IMapSetting } from "./../components/flowchart/interface";
import SvgPanZoom, { zoomIn } from "svg-pan-zoom";
import $ from "cash-dom";
const useZoomer = (elementID: string, setting: IMapSetting) => {
  const options = reactive({
    viewportSelector: ".svg-pan-zoom_viewport",
    panEnabled: false,
    controlIconsEnabled: false,
    zoomEnabled: true,
    dblClickZoomEnabled: false,
    mouseWheelZoomEnabled: true,
    preventMouseEventsDefault: false,
    zoomScaleSensitivity: 0.2,
    minZoom: 0.5,
    maxZoom: 10,
    fit: true,
    contain: false,
    center: true,
    beforeZoom: function () {},
    onZoom: () => {
      zoomValue.value = zoomInstance.value!.getZoom();
      zoomListeners.forEach((listener: Function) => listener(zoomInstance.value?.getZoom(), zoomInstance));
    },
    beforePan: function () {
      beforePanListeners.forEach((listener: Function) => listener(zoomInstance.value?.isPanEnabled(), zoomInstance));
    },
    onPan: function () {
      panListeners.forEach((listener: Function) => listener(zoomInstance.value?.getPan(), zoomInstance));
    },
    onUpdatedCTM: function () {},
  });
  let zoomInstance = ref<SvgPanZoom.Instance>();
  let loaded = false;
  const zoomValue = ref<number>(0);
  const zoomListeners = new Set<Function>();
  const panListeners = new Set<Function>();
  const beforePanListeners = new Set<Function>();

  const isMaxZoom = ref(false);
  const isMinZoom = ref(false);

  const addOnZoomListener = (listener: Function) => {
    zoomListeners.add(listener);
  };

  const removeOnZoomListener = (listener: Function) => {
    zoomListeners.delete(listener);
  };

  const addOnPanListener = (listener: Function) => {
    panListeners.add(listener);
  };

  const removeOnPanListener = (listener: Function) => {
    panListeners.delete(listener);
  };

  const addOnBeforePanListener = (listener: Function) => {
    beforePanListeners.add(listener);
  };

  const update = () => {
    const newZoomed = SvgPanZoom(elementID, options);
    if (newZoomed) {
      zoomInstance.value = newZoomed;

      if (setting.pan) {
        newZoomed.pan(setting.pan);
      }

      if (setting.zoom) {
        newZoomed.zoom(setting.zoom || 0);
      }
    }
  };

  const scrollTop = () => {
    return $(elementID).parent().get(0)?.offsetTop;
  };

  const setZoom = (zoomValue: any) => {
    zoomInstance.value?.zoom(zoomValue);
  };

  const setPan = (panValue: any) => {
    zoomInstance.value?.pan(panValue);
  };

  watch([zoomValue, options], () => {
    isMaxZoom.value = options.maxZoom <= zoomValue.value;
    isMinZoom.value = options.minZoom >= zoomValue.value;
  });
  return {
    zoomInstance,
    zoomValue,
    isMaxZoom,
    scrollTop,
    isMinZoom,
    addOnBeforePanListener,
    addOnZoomListener,
    removeOnZoomListener,
    addOnPanListener,
    removeOnPanListener,
    update,
    setZoom,
    setPan,
  };
};

export { useZoomer };
