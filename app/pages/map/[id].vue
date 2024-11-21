<template>
  <v-app>
    <v-main>
      <v-snackbar v-bind="snackbarProps" location="top">
        <div>{{ snackbarProps.text }}</div>
      </v-snackbar>
      <v-snackbar variant="tonal" timeout="-1" :model-value="menuStep === Steps.LINK" location="top">
        <div class="d-flex flex-row align-center">
          <!-- <v-progress-circular indeterminate color="white" class="mr-2" > </v-progress-circular> -->
          <div>请点击要连接到的节点</div>
        </div>
        <template v-slot:actions> <v-btn variant="tonal" append-icon="mdi-close" @click="closePopover()">取消</v-btn> </template>
      </v-snackbar>
      <v-container fluid class="pa-0">
        <div v-if="isLoading" style="width: 100vw; height: 100vh" class="d-flex justify-center align-center">
          <v-progress-circular indeterminate color="blue-grey" size="58"></v-progress-circular>
        </div>
        <div v-else>
          <div :class="menuStep === Steps.LINK ? 'linking' : ''" v-if="mapObject && !isEmpty(mapObject.raw)">
            <drawer ref="drawer" :type="type.name" :map="mapObject" @clickDrawer="onCilckDrawer" @onPan="onPan" @onZoom="onZoom" @mousedown="onMouseDown" @mouseup="onMouseUp" @selectNode="onClickNode" @clickLink="onClickLink" @clickLinkText="onClickLinkText"></drawer>
          </div>
          <div v-if="mapObject && isEmpty(mapObject.raw)" style="width: 100vw; height: 100vh" class="d-flex justify-center align-center rounded-lg" @click="onCilckDrawer">
            <label ref="placeholder" class="text-h6 text-grey">点击空白处开始</label>
            <v-icon color="secondary" class="animate__animated animate__delay-1s animate__pulse animate__repeat-3" size="48">mdi-cursor-default-click-outline</v-icon>
          </div>
        </div>
        <section class="absolute top-10 left-10 flex m-toolbars space-x-0 m-toolbar-x"></section>
        <section v-if="menuStep !== Steps.LINK" style="position: absolute; left: 16px; top: 16px; z-index: 6" class="shadowed-small rounded-lg">
          <v-btn variant="tonal" class="rounded-s-lg" rounded="0">返回</v-btn>
          <v-btn variant="tonal" @click="undo" rounded="0" :disabled="!canUndo">撤销</v-btn>
          <v-btn variant="tonal" class="rounded-e-lg" rounded="0" @click="redo" :disabled="!canRedo">重做</v-btn>
        </section>
        <section v-if="menuStep !== Steps.LINK && drawer?.zoomContext?.zoomInstance" style="position: absolute; right: 16px; bottom: 16px; z-index: 6" class="d-flex flex-column shadowed-small rounded-lg">
          <v-btn :color="canPaning ? 'primary' : ''" :variant="canPaning ? 'flat' : 'tonal'" @click="canPaning = !canPaning" icon="mdi-hand-back-right-outline" class="rounded-t-lg" rounded="0"></v-btn>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-plus" class="rounded-t-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomIn()" :disabled="drawer.zoomContext.isMaxZoom.value"> </v-btn>
          <v-btn icon="mdi-fit-to-screen" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.resetZoom()"> </v-btn>
          <v-btn icon="mdi-minus" class="rounded-b-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomOut()" :disabled="drawer.zoomContext.isMinZoom.value"> </v-btn>
        </section>
        <section style="position: absolute; right: 16px; top: 16px; z-index: 6" class="d-flex shadowed-small rounded-lg" v-if="drawer?.zoomContext?.zoomInstance">
          <v-btn class="rounded-s-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomIn()" :disabled="drawer.zoomContext.isMaxZoom.value">导出 </v-btn>
          <v-btn rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.resetZoom()">分享 </v-btn>
          <v-btn class="rounded-e-lg" rounded="0" variant="tonal"  :disabled="drawer.zoomContext.isMinZoom.value"> 设置</v-btn>
        </section>
        <div ref="popoverRef">
          <v-dialog-transition>
            <v-card class="pa-0 shadowed" elevation="0" v-if="popoverShow">
              <v-card-title>
                <div class="d-flex justify-space-between align-center mb-2">
                  <label class="text-blue-grey font-weight-thin text-subtitle-2">菜单</label>
                  <v-slide-x-transition group mode="in-out" :hide-on-leave="true" :leave-absolute="true" tag="div">
                    <v-btn key="1" size="small" title="锁定改步骤" icon="mdi-lock-open-variant-outline" variant="plain" color="grey" v-if="menuStep != Steps.NONE" @click="menuStep = Steps.NONE"></v-btn>
                    <v-btn key="2" size="small" title="返回" icon="mdi-arrow-left" variant="plain" color="grey" v-if="menuStep != Steps.NONE" @click="menuStep = Steps.NONE"> </v-btn>
                    <v-btn key="3" size="small" title="关闭" icon="mdi-close-circle" variant="plain" color="red" v-if="menuStep === Steps.NONE" @click="closePopover()"></v-btn>
                  </v-slide-x-transition>
                </div>
              </v-card-title>
              <v-card-text>
                <v-slide-x-transition group :hide-on-leave="true">
                  <div class="d-flex justify-center" v-if="menuStep === Steps.NONE">
                    <v-btn variant="flat" @click="addNode">
                      <template v-slot:prepend><v-icon color="secondary">mdi-plus-circle </v-icon></template>
                      添加节点
                    </v-btn>
                    <v-btn variant="flat" @click="addOther">
                      <template v-slot:prepend><v-icon color="secondary">mdi-plus-minus-box</v-icon></template>
                      添加其他
                    </v-btn>
                    <v-btn variant="flat" @click="link">
                      <template v-slot:prepend><v-icon color="secondary">mdi-vector-link</v-icon></template>
                      连接节点
                    </v-btn>
                  </div>
                  <v-list-item v-if="[Steps.NONE, Steps.EDIT_TEXT].includes(menuStep)" key="1" color="blue-grey">
                    <div class="py-2">
                      <v-textarea prepend-inner-icon="mdi-text-box-edit-outline" :hide-details="menuStep !== Steps.EDIT_TEXT" variant="underlined" label="输入文本" :rows="menuStep === Steps.EDIT_TEXT ? textRows : 1" :autofocus="false" @keydown.ctrl.enter="saveText()" @focus="menuStep = Steps.EDIT_TEXT" v-model="editingText" type="text">
                        <template v-slot:details>
                          <div class="text-grey text-caption">保存快捷键：<label class="shortcut">Ctrl</label> + <label class="shortcut">Enter</label></div>
                        </template>
                        <template v-slot:append>
                          <div v-show="menuStep === Steps.EDIT_TEXT">
                            <v-btn variant="tonal" @click="saveText()">保存</v-btn>
                          </div>
                        </template>
                      </v-textarea>
                    </div>
                  </v-list-item>
                  <v-list-item key="2" @click="replace" color="blue-grey-darken-2" v-if="menuStep === Steps.NONE" prepend-icon="mdi-file-replace-outline"><v-list-item-subtitle>更换节点</v-list-item-subtitle> </v-list-item>
                  <v-list-item key="3" @click="deleteNode" color="blue-grey-darken-2" v-if="menuStep === Steps.NONE" prepend-icon="mdi-close-box-outline"><v-list-item-subtitle>删除节点</v-list-item-subtitle></v-list-item>
                  <v-list-item key="3" @click="setIcon" color="blue-grey-darken-2" v-if="menuStep === Steps.NONE" prepend-icon="mdi-file-replace-outline"><v-list-item-subtitle>设置图标</v-list-item-subtitle> </v-list-item
                  ><v-list-item key="4" v-if="[Steps.NEW_OTHER_NODE, Steps.REPLACE].includes(menuStep)">
                    <div class="shapes" style="width: 480px">
                      <Shapes @select="onSelectShape"></Shapes>
                    </div>
                  </v-list-item>
                  <v-list-item key="5" v-if="[Steps.SET_ICON].includes(menuStep)">
                    <div class="icons" style="width: 480px">
                      <Shapes @select="onSelectShape"></Shapes>
                    </div>
                  </v-list-item>
                </v-slide-x-transition>
              </v-card-text>
            </v-card>
          </v-dialog-transition>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { cloneDeep, each, filter, isArray, isBuffer, isEmpty, isNumber, map, pullAllWith, remove, throttle, toNumber } from "lodash";
import { Steps } from "../interface";
import { useRefHistory } from "@vueuse/core";
import $, { Cash } from "cash-dom";
import { Ref, UnwrapNestedRefs } from "vue";
import { EdgeType, IMapNextion, IMapNextionEvent, IMapNextionWithNode, IMapNode, IMapObject, IMapSetting } from "~~/components/flowchart/interface";
import Drawer from "~~/components/drawer.vue";
import { edgeTypes } from "~~/components/flowchart/edgeTypes";
import { diff_match_patch } from "diff-match-patch";
import { storeToRefs } from "pinia";
import { IMapView, useWorksStore } from "~~/stores/works";
import { onBeforeRouteLeave } from "vue-router";
import useEditPopper from "~~/composables/editPopper";
import { node } from "unenv";
import $axios from "axios";
import { diff, create } from "jsondiffpatch";
import consolaGlobalInstance from "consola";

interface DrawerSelection {
  tag: HTMLElement;
  node?: IMapNode;
  nextion?: IMapNextionWithNode;
  type: "node" | "link" | "linkText";
}
const canPaning = ref(false);
const { replace: replaceUrl } = useRouter();
const { params } = useRoute();
const diffMatchPatch = new diff_match_patch();
let lastNodes: IMapNode[] | null = null;
const { fetchMap } = useWorksStore();
const currentSelection: Ref<DrawerSelection[] | null> = ref(null);
const isLinking = ref(false);
// let currentId: Ref<number | null> = ref(null);
// let currentTag: Ref<Cash | null> = ref(null);
// let currentNode: Ref<IMapNode | null> = ref(null);
// let currentNextion: Ref<IMapNextionWithNode | null> = ref(null);
// const selectionType: Ref<"node" | "link" | "linkText" | null> = ref(null);
const editingText = ref("");
const type = reactive({
  name: "graph TD",
  alias: "flowchart",
});
const placeholder: Ref<HTMLElement | null> = ref(null);
const nodes = computed({
  get() {
    return mapObject.value?.raw || [];
  },
  set(val) {
    if (mapObject.value) {
      mapObject.value.raw = val;
    }
  },
});
const { alertProps, handlerError, snackbarProps } = useErrorMessage();
const mapObject: Ref<IMapView | null> = ref(null);
const isLoading: Ref<boolean> = ref(true);
const fetch = async () => {
  if (params.id) {
    const map = await fetchMap(params.id as string, handlerError);
    if (map) {
      mapObject.value = map;
      lastNodes = cloneDeep(map.raw);
    }
    isLoading.value = false;
    // $axios
    //   .get<IMapObject>(`/maps/${params.id}`)
    //   .then((res) => {
    //     res.data.raw = res.data.raw || [];
    //     mapObject.value = res.data;
    //     lastNodes = res.data.raw;
    //   })
    //   .catch((error) => {
    //     switch (error.response.status) {
    //       case 404:
    //         alert("文件已删除或不存在，请返回");
    //         replaceUrl({
    //           path: "/desktop/mine",
    //         });
    //         break;
    //     }
    //   })
    //   .finally(() => {
    //     isLoading.value = false;
    //   });
  }
};
const selectedNodes = computed(() => {
  return filter(currentSelection.value, (selection) => selection.type === "node");
});

const onClickNode = (args: DrawerSelection[]) => {
  currentSelection.value = args;
  const [arg0] = args;
  showPopover(arg0.tag as HTMLElement);
  if (mapObject.value && args.length === 1) {
    const item = mapObject.value.raw.find((item) => item.id === arg0.node?.id);
    if (item) {
      editingText.value = item.text.replaceAll(/\\n/g, "\n");
    }
  } else {
    editingText.value = "";
  }
};
const textRows = computed(() => {
  return editingText.value.split("\n").length;
});

const onMouseDown = () => {
  if (!canPaning.value) {
    return;
  }

  if (document.body.style.cursor !== "grabbing") {
    document.body.style.cursor = "grabbing";
  }
};
const onMouseUp = () => {
  if (!canPaning.value) {
    return;
  }

  document.body.style.cursor = "grab";
};
// const onClickLink = ({ nextion, tag }: IMapNextionEvent) => {
//   editingText.value = (nextion.text || "").replaceAll(/\\n/g, "\n");

//   currentSelection.value = {
//     tag: $(tag),
//     type: "link",
//     nextion: nextion,
//   };

//   showPopover(tag);
// };
// const onClickLinkText = ({ nextion, tag }: IMapNextionEvent) => {
//   editingText.value = (nextion.text || "").replaceAll(/\\n/g, "\n");

//   currentSelection.value = {
//     tag: $(tag),
//     type: "linkText",
//     nextion: nextion,
//   };
//   menuStep.value = Steps.EDIT_TEXT;

//   showPopover(tag);
// };
const popoverRef: Ref<HTMLElement | null> = ref(null);
const addOther = () => {
  menuStep.value = Steps.NEW_OTHER_NODE;
};
const replace = () => {
  menuStep.value = Steps.REPLACE;
};
const link = () => {
  drawer.value?.ds.stop();
  menuStep.value = Steps.LINK;
  const onClick = (e: any) => {
    const tag = $(e.target).parents("g.node");
    const mermaidId = tag.attr("id");

    if (mermaidId) {
      const [, id] = mermaidId.split("-");

      if (id) {
        const nodeValue = nodes.value.find((node) => node.id === toNumber(id));
        if (nodeValue) {
          if (!isArray(nodeValue.next)) {
            nodeValue.next = [];
          }

          currentSelection.value?.forEach((selection) => {
            nodeValue.next?.push({ id: selection.node?.id || 0 });
          });
        }

        $("g.node").off("click", onClick);

        closePopover();
        drawer.value?.ds.start();
      } else {
        console.log("not found");
      }
    }
  };
  $("g.node").on("click", onClick);
};
const deleteNode = () => {
  each(currentSelection.value, (selection) => {
    remove(mapObject.value!.raw, (item: IMapNode) => item.id === selection.node?.id);
  });

  closePopover();
};
const setIcon = () => {
  menuStep.value = Steps.SET_ICON;
}
const addNode = () => {
  if (selectedNodes.value.length > 0) {
    each(selectedNodes.value, (selection) => {
      const id = new Date().getTime();
      // const node = nodes.value.find((item) => item.id === currentNode.value?.id);

      if (selection.node) {
        if (!isArray(selection.node.next)) {
          selection.node.next = [];
        }

        selection.node.next.push({ id });
        nodes.value.push({ id, text: "test" });
        setTimeout(() => {
          const tag = $(getNodeElementName(id));
          if (tag) {
            $(tag).trigger("click");
          }
        });
      }
    });
  } else {
    const id = new Date().getTime();
    nodes.value.push({ id, text: "开始", edgeType: "rounded" });
  }

  closePopover();
};
const getNodeElementName = (id: string | number) => `g[id^='flowchart-${id}-'`;
const menuStep: Ref<Steps> = ref(Steps.NONE);
const {
  last,
  history,
  undo: _undo,
  redo: _redo,
  canRedo,
  canUndo,
} = useRefHistory(nodes, {
  deep: true,
});

const undo = () => {
  closePopover();
  _undo();
};
const redo = () => {
  closePopover();
  _redo();
};
const text = ref();
const drawer: Ref<typeof Drawer | null> = ref(null);
// const drawer = ref();
const config = {
  startOnLoad: false,
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: "cardinal" },
  securityLevel: "loose",
};
const onSelectShape = (shape: string) => {
  each(selectedNodes.value, (selection) => {
    const id = new Date().getTime();
    // console.log(shape);
    if (menuStep.value === Steps.REPLACE) {
      if (currentSelection.value) {
        const replaceItem = nodes.value.find((item) => item.id === selection.node?.id);
        if (replaceItem) {
          replaceItem.edgeType = shape;
          closePopover();
        }
      }
    } else if (menuStep.value === Steps.NEW_OTHER_NODE) {
      if (selection.node) {
        nodes.value.push({ id: new Date().getTime(), text: "test", edgeType: shape });
        if (!isArray(selection.node.next)) {
          selection.node.next = [];
        }
        selection.node.next.push({
          id,
        });
      }
    }
  });

  if (selectedNodes.value.length < 1 && menuStep.value === Steps.NEW_OTHER_NODE) {
    const id = new Date().getTime();
    nodes.value.push({ id, text: "开始", edgeType: shape });
  }

  closePopover();
};

const { hide: closePopover, show: showPopover, popoverShow, update: updatePopover } = useEditPopper(popoverRef, () => !canPaning.value);
const startChangeText = () => {};
const saveText = () => {
  const text = (editingText.value || "").replaceAll(/[\n\r]/g, "\\n");
  each(currentSelection.value, (selection) => {
    switch (selection.type) {
      case "node":
        if (selection.node) {
          selection.node.text = text;
        }
        break;

      case "link":
        if (selection.nextion) {
          const realNext = selection.nextion.node.next![selection.nextion.index!];
          if (isNumber(realNext)) {
            selection.nextion.node.next!.splice(selection.nextion.index!, 1, {
              id: selection.id,
              text: text,
            });
          } else {
            realNext.text = text;
          }

          // if (currentNextion.value.text === undefined) {

          // } else {
          //   currentNextion.value.text = editingText.value;
          // }
        }

      case "linkText":
        if (selection.nextion) {
          const realNext = selection.nextion.node.next![selection.nextion.index!];
          if (!isNumber(realNext)) {
            realNext.text = (editingText.value || "").replaceAll(/[\n\r]/g, "\\n");
          }
        }
        break;
    }
  });

  closePopover();
};

const onPan = (value: Partial<IMapSetting>) => {
  updateSetting({ pan: value });
};

const onZoom = (value: Partial<IMapSetting>) => {
  updateSetting({ zoom: value });
};

const onCilckDrawer = () => {
  if (placeholder.value) {
    showPopover(placeholder.value);
  }
};

watch(drawer, () => {
  if (drawer.value) {
    drawer.value.zoomContext.addOnPanListener(() => {
      updatePopover();
    });

    drawer.value.zoomContext.addOnZoomListener(() => {
      updatePopover();
    });
  }
});

const updateSetting = throttle((params) => {
  // $axios.patch(`/maps/${query.id}/setting`, {
  //   s: params,
  // });
}, 2000);

const onKeyup = (event: KeyboardEvent) => {
  if (event.code === "Space" && canPaning.value) {
    document.body.onkeyup = null;
    canPaning.value = false;
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.code === "Space" && !canPaning.value) {
    window.onkeyup = onKeyup;
    canPaning.value = true;
  }
};

document.onselectstart = (event) => {
  if (!canPaning.value) {
    return true;
  }

  event.preventDefault();
};

document.body.onkeydown = onKeydown;

watch(
  canPaning,
  () => {
    if (canPaning.value) {
      drawer.value?.zoomContext.zoomInstance.value.enablePan();
      document.body.style.cursor = "grab";
      drawer.value?.ds.stop();
    } else {
      drawer.value?.zoomContext.zoomInstance.value.disablePan();
      document.body.style.cursor = "";
      drawer.value?.ds.start();
    }
  },
  {
    immediate: true,
  }
);
watch(
  currentSelection,
  (value, oldValue) => {
    if (oldValue !== value) {
      each(oldValue, (old) => {
        $(old.tag).removeClass("selected");
      });

      each(value, (val) => {
        $(val.tag).addClass("selected");
      });
    }
  },
  {
    deep: true,
  }
);
watch(popoverShow, (value) => {
  menuStep.value = 0;
  if (!value) {
    drawer.value?.ds.clearSelection();
    currentSelection.value = [];
  }
});
var diffpatcher = create({
  objectHash: function (obj: IMapNode) {
    return JSON.stringify(obj);
  },
});

watch(
  nodes,
  (value) => {
    if (lastNodes != null) {
      const valueUnref = toRaw(value);
      const delta = diffpatcher.diff(lastNodes, valueUnref);

      if (!isEmpty(delta)) {
        $axios.patch(`/maps/${params.id}/raw`, { p: delta }).then(() => {
          lastNodes = cloneDeep(valueUnref);
        });
      }
    }
  },
  {
    deep: true,
    immediate: false
  }
);

onBeforeRouteLeave((to, from, next) => {
  console.log(to);
  console.log(from);
});

onMounted(() => {
  fetch();
});
</script>

<style lang="scss" scoped>
label.shortcut {
  padding: 2px;
  border-radius: 4px;
  border: solid 1px #e3e3e3;
}

section.popover {
  @apply border-0 mr-3 z-50 font-normal leading-normal text-sm text-left no-underline break-words  shadow-xl;

  .title {
    @apply bg-gray-400 text-white opacity-75 font-semibold p-3 mb-0 border-b border-solid border-slate-100 uppercase rounded-t-lg flex justify-between;
  }

  .shapes {
    @apply bg-gray-100;
  }
  ul {
    li {
      &:last-of-type {
        @apply rounded-b-lg;
      }

      @apply bg-gray-200  text-gray-800 p-3 hover:cursor-pointer hover:bg-gray-50;
    }
  }

  input[type="text"] {
    @apply block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
  }
}

.m-toolbar-x {
  @apply px-2 py-2 font-medium text-gray-900 bg-white border border-gray-200  hover:bg-blue-500 hover:text-white focus:z-10 focus:ring-2 focus:bg-blue-500 focus:ring-blue-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white;

  &:first-of-type {
    @apply rounded-l-lg;
  }

  &:last-of-type {
    @apply rounded-r-lg;
  }

  &:disabled {
    @apply cursor-not-allowed bg-gray-100 text-gray-600;
  }
}
.m-toolbar-y {
  @apply absolute bottom-10 right-10 flex flex-col space-x-0;
  button {
    @apply px-2 py-2 font-medium text-gray-900 bg-white border border-gray-200   hover:bg-blue-500 hover:text-white focus:z-10 focus:ring-2 focus:bg-blue-500 focus:ring-blue-700 focus:text-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white;

    &:first-of-type {
      @apply rounded-t-lg;
    }

    &:last-of-type {
      @apply rounded-b-lg;
    }
  }
}
</style>
<style lang="less">
g.node.selected {
  outline: solid;
  outline-offset: 2px;
  outline-color: rgb(var(--v-theme-secondary));
  outline-width: 2px;
}

.flowchart-link,
g.node {
  cursor: pointer;
}

rect.selected {
  outline: solid;
  outline-offset: 1px;
  outline-color: rgb(var(--v-theme-secondary));
  outline-width: 2px;
}

g.edgePaths path.selected {
  stroke: rgb(var(--v-theme-secondary)) !important;
}

.linking {
  g.node {
    cursor: crosshair;
  }
}

div.click-effect {
  box-sizing: border-box;
  border-style: solid;
  border-color: red;
  border-radius: 50%;
  animation: click-effect 2s ease-out;
  animation-iteration-count: 3;
  z-index: 99999;
}
@keyframes click-effect {
  0% {
    opacity: 1;
    width: 0.5em;
    height: 0.5em;
    margin: -0.25em;
    border-width: 0.5em;
  }
  100% {
    opacity: 0.2;
    width: 15em;
    height: 15em;
    margin: -7.5em;
    border-width: 0.03em;
  }
}
</style>
