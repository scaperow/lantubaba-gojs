<template>
  <v-app>
    <v-main>
      <v-container fluid style="padding: 0">
        <div v-if="mapObject && !isEmpty(mapObject.raw)">
          <Drawer ref="drawer" :type="type.name" :map="mapObject" @clickDrawer="onCilckDrawer" @onPan="onPan" @onZoom="onZoom" @clickNode="onClickNode" @clickLink="onClickLink" @clickLinkText="onClickLinkText"></Drawer>
        </div>
        <div v-if="mapObject && isEmpty(mapObject.raw)" style="width: 100vw; height: 100vh; cursor: pointer" class="d-flex justify-center align-center" @click="onCilckDrawer">
          <label ref="placeholder" class="text-h6 text-grey">点击空白处开始</label>
          <v-icon color="secondary" class="animate__animated animate__delay-1s animate__pulse animate__repeat-3" size="48">mdi-cursor-default-click-outline</v-icon>
        </div>
        <section class="absolute top-10 left-10 flex m-toolbars space-x-0 m-toolbar-x"></section>
        <section style="position: absolute; left: 16px; top: 16px; z-index: 6">
          <v-btn class="rounded-s-lg" rounded="0" variant="tonal">返回</v-btn>
          <v-btn variant="tonal" @click="undo" rounded="0" :disabled="!canUndo">撤销</v-btn>
          <v-btn class="rounded-e-lg" variant="tonal" rounded="0" @click="redo" :disabled="!canRedo">重做</v-btn>
        </section>
        <section style="position: absolute; right: 16px; bottom: 16px; z-index: 6" class="d-flex flex-column" v-if="drawer?.zoomContext?.zoomInstance">
          <v-btn icon="mdi-plus" class="rounded-t-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomIn()" :disabled="drawer.zoomContext.isMaxZoom.value"> </v-btn>
          <v-btn icon="mdi-fit-to-screen" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.resetZoom()"> </v-btn>
          <v-btn icon="mdi-minus" class="rounded-b-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomOut()" :disabled="drawer.zoomContext.isMinZoom.value"> </v-btn>
        </section>
        <section style="position: absolute; right: 16px; top: 16px; z-index: 6" class="d-flex" v-if="drawer?.zoomContext?.zoomInstance">
          <v-btn class="rounded-s-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomIn()" :disabled="drawer.zoomContext.isMaxZoom.value">导出 </v-btn>
          <v-btn rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.resetZoom()">分享 </v-btn>
          <v-btn class="rounded-e-lg" rounded="0" variant="tonal" @click="drawer?.zoomContext.zoomInstance.value.zoomOut()" :disabled="drawer.zoomContext.isMinZoom.value"> </v-btn>
        </section>
        <div ref="popoverRef">
          <v-card width="460" v-show="popoverShow">
            <v-card-title>
              <div class="d-flex justify-end align-center mb-4">
                <v-btn title="锁定改步骤" icon="mdi-lock-open-variant-outline" variant="plain" color="grey" v-show="menuStep != Steps.NONE" @click="menuStep = Steps.NONE"></v-btn>
                <v-btn title="返回" icon="mdi-arrow-left" variant="plain" color="grey" v-show="menuStep != Steps.NONE" @click="menuStep = Steps.NONE"></v-btn>
                <v-btn title="关闭" icon="mdi-close-circle" variant="plain" color="red" v-show="menuStep === Steps.NONE" @click="popoverShow = false"></v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <div v-show="menuStep === Steps.NONE">
                <div class="pb-2 d-flex justify-space-around">
                  <v-btn variant="tonal" @click="addNode"><v-icon color="secondary">mdi-plus-circle </v-icon>添加节点</v-btn>
                  <v-btn variant="tonal" @click="addNode"><v-icon color="secondary">mdi-plus-minus-box</v-icon>添加其他</v-btn>
                  <v-btn variant="tonal" @click="link"><v-icon color="secondary">mdi-vector-link</v-icon>连接节点</v-btn>
                </div>
              </div>
              <v-list>
                <div v-show="[Steps.NONE, Steps.EDIT_TEXT].includes(menuStep)">
                  <v-textarea label="文本" :rows="menuStep === Steps.EDIT_TEXT ? textRows : 1" :autofocus="false" @keydown.ctrl.enter="saveText()" @focus="menuStep = Steps.EDIT_TEXT" v-model="editingText" type="text"> </v-textarea>
                  <div v-show="menuStep === Steps.EDIT_TEXT">
                    <div class="d-flex justify-space-between mt-2">
                      <div class="text-grey text-caption">保存快捷键：<label class="shortcut">Ctrl</label> + <label class="shortcut">Enter</label></div>
                      <v-btn variant="tonal" @click="saveText()">保存</v-btn>
                    </div>
                  </div>
                </div>
                <v-list-item @click="replace" v-show="menuStep === Steps.NONE" title="更换节点" prepend-icon="mdi-file-replace-outline"> </v-list-item>
                <v-list-item @click="deleteNode" v-show="menuStep === Steps.NONE" title="删除" prepend-icon="mdi-close-box-outline"></v-list-item>
          
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { createPopper } from "@popperjs/core";
import { cloneDeep, isArray, isBuffer, isEmpty, isNumber, pullAllWith, throttle } from "lodash";
import svgPanZoom from "svg-pan-zoom";
import { Steps } from "./interface";
import { useRefHistory } from "@vueuse/core";
import $, { Cash } from "cash-dom";
import { Ref, UnwrapNestedRefs } from "vue";
import { EdgeType, IMapNextion, IMapNextionEvent, IMapNextionWithNode, IMapNode, IMapObject, IMapSetting } from "~~/components/flowchart/interface";
import Drawer from "~~/components/drawer.vue";
import { edgeTypes } from "~~/components/flowchart/edgeTypes";
import { diff_match_patch } from "diff-match-patch";
import "animate.css";
import { storeToRefs } from "pinia";
import { useWorksStore } from "~~/stores/works";

const { replace: replaceUrl } = useRouter();
const { params, query } = useRoute();
const isLoading = ref(true);
const diffMatchPatch = new diff_match_patch();
const { $axios } = useNuxtApp();
const originalNodes: IMapNode[] = [
  {
    id: 11,
    text: "A",
    next: [
      {
        id: 22,
        text: "test",
      },
    ],
  },
  { id: 22, text: "Btest", edgeType: "circle", next: [33] },
  { id: 33, text: "C", next: [{ id: 44, text: "aaaa" }, 66] },
  { id: 44, text: "D", next: [55] },
  { id: 55, text: "E" },
  { id: 66, text: "F" },
];
let currentId: Ref<number | null> = ref(null);
let currentTag: Cash | null = null;
let popper: null | any = null;
let currentNode: Ref<IMapNode | null> = ref(null);
let currentNextion: Ref<IMapNextionWithNode | null> = ref(null);
const selectionType: Ref<"node" | "link" | "linkText" | null> = ref(null);
const isAutoSaveText = ref(false);
const editingText = ref("");
const type = reactive({
  name: "graph TD",
  alias: "flowchart",
});
const placeholder: Ref<HTMLElement | null> = ref(null);
const nodes = computed(() => mapObject.value?.raw || []);
const mapObject: Ref<IMapObject | null> = ref(null);

if (query.id) {
  $axios
    .get<IMapObject>(`/maps/${query.id}`)
    .then((res) => {
      res.data.raw = res.data.raw || [];
      mapObject.value = res.data;
      lastNodes = res.data.raw;
    })
    .catch((error) => {
      switch (error.response.status) {
        case 404:
          alert("文件已删除或不存在，请返回");
          replaceUrl({
            path: "/desktop/mine",
          });
          break;
      }
    });
}

const onClickNode = ({ node, tag }: { node: IMapNode; tag: HTMLElement }) => {
  const cashTag = $(tag);
  if (currentTag) {
    currentTag.removeClass("selected");
  }

  cashTag.removeClass("selected");
  cashTag.addClass("selected");

  if (popoverRef.value) {
    popper = createPopper(tag as HTMLElement, popoverRef.value, {
      placement: "right",
      modifiers: [
        {
          name: "arrow",
          options: {
            element: document.querySelector("#popoverArrow"),
          },
        },
      ],
    });
  }
  popoverShow.value = true;
  currentId.value = node.id;
  currentNode.value = node;
  currentTag = cashTag;
  selectionType.value = "node";
  if (mapObject.value) {
    const item = mapObject.value.raw.find((item) => item.id === node.id);
    if (item) {
      editingText.value = item.text.replaceAll(/\\n/g, "\n");
    }
  }
};
const textRows = computed(() => {
  return editingText.value.split("\n").length;
});
const onClickLink = ({ nextion, tag }: IMapNextionEvent) => {
  editingText.value = (nextion.text || "").replaceAll(/\\n/g, "\n");
  selectionType.value = "link";
  currentNextion.value = nextion;
  $(tag).addClass("selected");

  if (popoverRef.value) {
    popper = createPopper(tag, popoverRef.value, {
      placement: "right",
      modifiers: [
        {
          name: "arrow",
          options: {
            element: document.querySelector("#popoverArrow"),
          },
        },
      ],
    });
  }

  popoverShow.value = true;
};

const onClickLinkText = ({ nextion, tag }: IMapNextionEvent) => {
  console.log(tag);
  const cashTag = $(tag);
  if (currentTag) {
    currentTag.removeClass("selected");
  }

  cashTag.removeClass("selected");
  cashTag.addClass("selected");

  editingText.value = (nextion.text || "").replaceAll(/\\n/g, "\n");
  selectionType.value = "linkText";
  currentNextion.value = nextion;
  menuStep.value = Steps.EDIT_TEXT;

  if (popoverRef.value) {
    popper = createPopper(tag, popoverRef.value, {
      placement: "right",
      modifiers: [
        {
          name: "arrow",
          options: {
            element: document.querySelector("#popoverArrow"),
          },
        },
      ],
    });
  }

  popoverShow.value = true;
};
const popoverRef: Ref<HTMLElement | null> = ref(null);
const popoverShow: Ref<Boolean> = ref(false);
const addOther = () => {
  menuStep.value = Steps.NEW_OTHER_NODE;
};
const replace = () => {
  menuStep.value = Steps.REPLACE;
};
const link = () => {
  menuStep.value = Steps.LINK;
};
const deleteNode = () => {
  // data = pullAllWith(data, (item) => item.id === currentId.value);
  const index = mapObject.value!.raw.findIndex((item) => item.id === currentNode?.value?.id);
  if (index >= 0) {
    nodes.value.splice(index, 1);
  }

  popoverShow.value = false;
};
const addNode = () => {
  const id = new Date().getTime();
  // const node = nodes.value.find((item) => item.id === currentNode.value?.id);

  if (currentNode.value) {
    if (!isArray(currentNode.value.next)) {
      currentNode.value.next = [];
    }
    currentNode.value.next.push(id);
    nodes.value.push({ id, text: "test" });
    setTimeout(() => {
      const tag = $(getNodeElementName(id));
      if (tag) {
        $(tag).trigger("click");
      }
    });
    popoverShow.value = false;
  } else {
    nodes.value.push({ id, text: "开始", edgeType: "rounded" });
    popoverShow.value = false;
  }
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
  popoverShow.value = false;
  _undo();
};
const redo = () => {
  popoverShow.value = false;
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
const onSelectShape = (shape: EdgeType) => {
  // console.log(shape);
  // if (menuStep.value === Steps.REPLACE && currentId.value) {
  //   const replaceItem = nodes.value.find((item) => item.id === currentId.value);
  //   if (replaceItem) {
  //     replaceItem.edgeType = shape.type as keyof typeof edgeTypes;
  //     popoverShow.value = false;
  //   }
  // }
};
const closePopover = () => {
  popoverShow.value = false;
  if (popper) {
    popper.dispose();
  }
};
const startChangeText = () => {};
const saveText = () => {
  const text = (editingText.value || "").replaceAll(/[\n\r]/g, "\\n");
  switch (selectionType.value) {
    case "node":
      if (currentNode.value) {
        currentNode.value.text = text;
      }
      break;

    case "link":
      if (currentNextion.value) {
        const realNext = currentNextion.value!.node.next![currentNextion.value.index!];
        if (isNumber(realNext)) {
          currentNextion.value!.node.next!.splice(currentNextion.value.index!, 1, {
            id: currentNextion.value.id,
            text: text,
          });
        } else {
          realNext.text = text;
        }
        currentNextion.value.node.next;
        // if (currentNextion.value.text === undefined) {

        // } else {
        //   currentNextion.value.text = editingText.value;
        // }
      }

    case "linkText":
      if (currentNextion.value) {
        const realNext = currentNextion.value!.node.next![currentNextion.value.index!];
        realNext.text = (editingText.value || "").replaceAll(/[\n\r]/g, "\\n");
      }
      break;
  }

  popoverShow.value = false;
};

const onPan = (value: Partial<IMapSetting>) => {
  updateSetting({ pan: value });
};

const onZoom = (value: Partial<IMapSetting>) => {
  updateSetting({ zoom: value });
};

const onCilckDrawer = () => {
  if (popoverRef.value && placeholder.value) {
    popper = createPopper(placeholder.value, popoverRef.value, {
      placement: "right",
      modifiers: [
        {
          name: "arrow",
          options: {
            element: document.querySelector("#popoverArrow"),
          },
        },
      ],
    });
  }
  popoverShow.value = true;
};

watch(drawer, () => {
  if (drawer.value) {
    drawer.value.zoomContext.addOnPanListener(() => {
      if (popper) {
        popper.update();
      }
    });

    drawer.value.zoomContext.addOnZoomListener(() => {
      if (popper) {
        popper.update();
      }
    });
  }
});

const updateSetting = throttle((params) => {
  // $axios.patch(`/maps/${query.id}/setting`, {
  //   s: params,
  // });
}, 2000);

watch(popoverShow, () => {
  menuStep.value = 0;
});
watch(
  nodes,
  (value) => {
    const valueUnref = unref(value);
    const patch = diffMatchPatch.patch_make(diffMatchPatch.diff_main(JSON.stringify([]), JSON.stringify(valueUnref)));

    // $axios.patch(`/maps/${query.id}/raw`, { p: patch }).then(() => {
    //   lastNodes = { ...valueUnref };
    // });
  },
  {
    deep: true,
  }
);
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
.flowchart-link,
g.node {
  cursor: pointer;
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
