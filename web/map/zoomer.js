import SvgPanZoom from "svg-pan-zoom";
const options = {
  viewportSelector: ".svg-pan-zoom_viewport",
  panEnabled: true,
  controlIconsEnabled: false,
  zoomEnabled: true,
  dblClickZoomEnabled: true,
  mouseWheelZoomEnabled: true,
  preventMouseEventsDefault: true,
  zoomScaleSensitivity: 0.2,
  minZoom: 0.5,
  maxZoom: 10,
  fit: true,
  contain: false,
  center: true,
  beforeZoom: function () {},
  onZoom: () => {
    this.zoomValue = this.zoomInstance.value.getZoom();
    // zoomListeners.forEach((listener) => listener(zoomInstance));
  },
  beforePan: function () {},
  onPan: function () {
    // panListeners.forEach((listener) => listener(zoomInstance));
  },
  onUpdatedCTM: function () {},
};
export default {
  data() {
    return {
      zoomInstance: null,
      zoomValue: 0,
      isMaxZoom: false,
      isMinZoom: false,
    };
  },
  computed: {
    zoomDatas() {
      return {
        zoomValue: this.zoomValue,
        options: this.options,
      };
    },
  },
  methods: {
    initZoomer(elementID) {
      const newZoomed = SvgPanZoom(elementID, options);

      if (this.zoomInstance) {
        newZoomed.pan(this.zoomInstance.getPan());
        newZoomed.zoom(this.zoomInstance.getZoom());
      }

      this.zoomValue = newZoomed.getZoom();
      this.zoomInstance = newZoomed;
    },
  },
  mounted() {
    this.$watch(() => {});
  },
  watch: {
    zoomDatas() {
      this.isMaxZoom.value = options.maxZoom <= this.zoomValue;
      this.isMinZoom = options.minZoom >= this.zoomValue;
    },
  },

  // const addOnZoomListener = (listener) => {
  //   zoomListeners.add(listener);
  // };

  // const removeOnZoomListener = (listener) => {
  //   zoomListeners.delete(listener);
  // };

  // const addOnPanListener = (listener) => {
  //   panListeners.add(listener);
  // };

  // const removeOnPanListener = (listener) => {
  //   panListeners.delete(listener);
  // };

  // const update = () => {
  //   const newZoomed = SvgPanZoom(elementID, options);

  //   if (zoomInstance.value) {
  //     newZoomed.pan(zoomInstance.value.getPan());
  //     newZoomed.zoom(zoomInstance.value.getZoom());
  //   }

  //   zoomValue.value = newZoomed.getZoom();
  //   zoomInstance.value = newZoomed;
  // };

  // watch([zoomValue, options], () => {
  //   isMaxZoom.value = options.maxZoom <= zoomValue.value;
  //   isMinZoom.value = options.minZoom >= zoomValue.value;
  // });

  // return {
  //   zoomInstance,
  //   zoomValue,
  //   isMaxZoom,
  //   isMinZoom,
  //   addOnZoomListener,
  //   removeOnZoomListener,
  //   addOnPanListener,
  //   removeOnPanListener,
  //   update,
  // };
};
