<template>
  <div class="drawer" :id="drawerId" @keypress="emitter('keyPressing')" @drag="emitter('dragDrawer')" @click="emitter('clickDrawer', { placeholder })"></div>
</template>

<script setup lang="ts">
import { useZoomer } from "../composables/zoomer";
import $, { Cash } from "cash-dom";
import mermaid from "mermaid";
import { edgeTypes } from "./flowchart/edgeTypes";
import { each, isEmpty, isNumber, map, reduce, toNumber } from "lodash";
import { MapConfig, IMapNode, IMapNextion, IMapSetting, IMapObject } from "./flowchart/interface";
import { PropType } from "vue";
import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles";
import { IMapView } from "~~/stores/works";
import { useThemeStore } from "~~/stores/themes";
import DragSelect from "dragselect";
const { app, deepin, breath, sober } = useThemeStore();
const prepareSchemaId = computed(() => {
  return `preparedSchema_${new Date().getTime()}`;
});

const drawerId = computed(() => {
  return `drawer_${new Date().getTime()}`;
});
const props = defineProps({
  map: {
    type: Object as PropType<IMapView>,
    required: true,
  },
  type: {
    type: String,
    default: "graph TD",
  },
  styles: {
    type: Array<any>,
    default() {
      return [];
    },
  },
  config: {
    type: Object,
    default() {
      return {};
    },
  },
  defaultConfig: {
    type: Object as PropType<MapConfig>,
    default() {
      return {
        theme: "default",
        startOnLoad: false,
        securityLevel: "loose",
        flowchart: {
          useMaxWidth: false,
        },
      };
    },
  },
  stopOnError: {
    type: Boolean,
    default: false,
  },
});
interface DrawerSelection {
  tag: HTMLElement;
  node?: IMapNode;
  type: "node" | "link" | "linkText";
}
const placeholder = ref("placeholder");
const nodes = computed(() => props.map?.raw || []);
const emitter = defineEmits(["selectNode", "onZoom", "onPan", "clickLink", "clickLinkText", "clickDrawer", "dragDrawer", "keyPressing", "onBeforePan"]);
const edges = reactive(edgeTypes);
const nodeObject = computed(() => {
  if (Array.isArray(nodes.value) && nodes.value.length > 0) {
    //@ts-ignore
    const arrayToObject = (arr: IMapNode[], keyField: string) => Object.assign({}, ...arr.map((item) => ({ [item[keyField]]: item })));
    return arrayToObject(nodes.value, "id");
  } else {
    return {};
  }
});
const nextions = computed(() => {
  return reduce(
    nodes.value,
    (result: IMapNextion[], current: IMapNode) => {
      if (current.next) {
        const padNextions = current.next.map((nextion, index) => {
          if (isNumber(nextion)) {
            return {
              id: nextion,
              node: current,
              index,
            };
          } else {
            return { ...nextion, index, node: current };
          }
        });
        return result.concat(padNextions);
      }

      return result;
    },
    []
  );
});
const customStyle = computed(() => {
  return [];
  // const { nodes, styles } = props;
  // const nodeStyles = nodes.filter((node) => node.style).map((node) => `style ${node.id} ${node.style}`);
  // let index = 0;
  // const nodeLinkStyles = nodes
  //   .filter((node) => node.linkStyle)
  //   .map((node) => {
  //     let linkNumber = node.linkNumber || node.linkNumber === 0 ? node.linkNumber : index;
  //     index++;
  //     return `linkStyle ${linkNumber} ${node.linkStyle}`;
  //   });

  // return nodeStyles.concat(styles).concat(nodeLinkStyles);
});
const parseCode = computed(() => {
  if (Array.isArray(nodes.value) && nodes.value.length > 0) {
    const parseCode = props.type + "\n";
    const groupNodes = getGroupNodes(nodes.value);
    // const theme = buildThemeStr();
    const code = parseCode + groupNodes + (customStyle.value || []).join(" \n");
    console.log(code);
    return code;
  } else {
    return "";
  }
});
const getGroupNodes = (nodes: IMapNode[]) => {
  const innerMap = new Map();
  nodes.forEach((element) => {
    const group = element.group || "";
    const data = innerMap.get(group) || { nids: new Set(), narr: [] };
    data.nids.add(element.id);
    data.narr.push(element);
    innerMap.set(group, data);
  });
  return [...innerMap.entries()]
    .map((item) => {
      const [groupName, entry] = item;
      const { nids, narr } = entry;
      if (groupName !== "") {
        const innerNodes: IMapNode[] = [];
        const outNodes: IMapNode[] = [];
        narr.forEach((node: IMapNode) => {
          // if (node.next && !isEmpty(node.next)) {
          //   innerNodes.push({
          //     id: node.id,
          //     text: node.text,
          //     editable: node.editable,
          //     url: node.url,
          //     edgeType: node.edgeType
          //   });
          //   node.next.forEach((id) => {
          //     if (nids.has(id)) {
          //       innerNodes.push({
          //         id: node.id,
          //         text: node.text,
          //         next: [id],
          //       });
          //     } else {
          //       outNodes.push({
          //         id: node.id,
          //         text: node.text,
          //         next: [id],
          //       });
          //     }
          //   });
          // } else {
          //   innerNodes.push(node);
          // }
        });
        const innerNodesStr = buildNodesStr(innerNodes);
        const outNodeStr = buildNodesStr(outNodes);
        return `subgraph ${groupName} \n ${innerNodesStr} end \n ${outNodeStr}`;
      } else {
        const nodesStr = buildNodesStr(narr);
        return nodesStr;
      }
    })
    .join(" \n");
};
const buildNodesStr = (nodes: IMapNode[]) => {
  return (
    nodes
      .map((item) => {
        if (item.next && item.next.length > 0) {
          return item.next
            .map((n: IMapNextion | number, index) => {
              const nextNode = isNumber(n) ? nodeObject.value[n] : nodeObject.value[n.id];
              if (nextNode != null && typeof nextNode != "undefined") {
                return `${buildNode(item)}${buildLink(n)}${buildLinkText(n)}${buildNode(nextNode)}`;
              } else {
                //TODO error
                return `${buildNode(item)}`;
              }
            })
            .join("\n");
        } else {
          return `${buildNode(item)}`;
        }
      })
      .join("\n") +
    "\n" +
    nodes
      .filter((item) => item.editable)
      .map((item) => {
        return `click ${item.id} href "javascript:mermaidClick('${item.id}');"`;
      })
      .join("\n") +
    "\n" +
    nodes
      .filter((item) => item.url)
      .map((item) => {
        return `click ${item.id} "${item.url}"`;
      })
      .join("\n") +
    "\n"
  );
};
const buildNode = (item: IMapNode) => {
  const edge = edges[item.edgeType || "node"];

  if (edge) {
    return `${item.id}${edge.open}${item.text}${edge.close}`;
  }
  return "";
};
const buildLink = (item: IMapNextion) => {
  return item.link || "-->";
};
const buildLinkText = (item: IMapNextion) => {
  if (!isEmpty(item.text)) {
    return `|${item.text}|`;
  }

  return "";
};
const init = () => {
  //@ts-ignore
  window.mermaidClick = function (id) {
    edit(id);
  };

  mermaid.initialize({
    ...props.defaultConfig,
    ...props.config,
    theme: "base",
    themeVariables: sober.themeVariables,
  });
};
const zoomContext = useZoomer("#" + prepareSchemaId.value, props.map.setting || {});
zoomContext.addOnPanListener((...args: any) => {
  emitter("onPan", ...args);
});
zoomContext.addOnZoomListener((...args: any) => {
  emitter("onZoom", ...args);
});
zoomContext.addOnBeforePanListener((...args: any) => {
  emitter("onBeforePan", ...args);
});

const getNodeObject = (nodeTag: Cash) => {
  const mermaidId = nodeTag.attr("id");

  if (mermaidId) {
    const [, id] = mermaidId.split("-");

    if (id) {
      const nodeValue = nodes.value.find((node) => node.id === toNumber(id));
      return nodeValue;
    }
  }
};

const addEventListener = () => {
  // $(".flowchart-link").on("click", (e) => {
  //   const index = $(e.target).index();
  //   emitter("clickLink", { nextion: nextions.value[index], tag: e.target });
  //   // e.preventDefault();
  //   // return false;
  // });
  // $("g.node").on("click", (e) => {
  //   // console.log(e);
  //   const tag = $(e.target).parents("g.node");
  //   const node = getNodeObject(tag);
  //   if (node) {
  //     emitter("selectNode", { node, tag: tag.get(0) });
  //   }
  //   // e.preventDefault();
  //   // return false;
  // });
  // $("g.edgeLabel").on("click", (e) => {
  //   const tag = $(e.target).parents("g.edgeLabel");
  //   const index = tag.index();
  //   emitter("clickLinkText", { nextion: nextions.value[index], tag: tag.get(0) });
  //   // e.preventDefault();
  //   // return false;
  // });
};
const ds = new DragSelect({});
const nodeClass = "node";
const labelClass = "edgeLabel";
const linkClass = "flowchart-link";
ds.subscribe("callback", (e: CallbackObject) => {
  if (!isEmpty(e.items)) {
    const args = map<Selection>(e.items, (item: HTMLElement) => {
      const cashNode = $(item);
      if (cashNode.hasClass(nodeClass)) {
        const node = getNodeObject(cashNode);
        if (node) {
          return { node, tag: item, type: "node" };
        }
      }
      if (cashNode.hasClass(linkClass)) {
        const index = cashNode.index();
        return { nextion: nextions.value[index], tag: item, type: "link" };
      }
      if (cashNode.hasClass(labelClass)) {
        const index = cashNode.index();
        emitter("clickLinkText", { nextion: nextions.value[index], tag: item });
      }
    });

    console.log(args);
    emitter("selectNode", args);
  }
});

onMounted(() => {
  init();

  watchEffect(() => {
    if (parseCode.value) {
      mermaid.mermaidAPI.render(prepareSchemaId.value, parseCode.value, (code) => {
        // $(drawerId.value).addClass("opacity-100");
        // const scrollTop = zoomContext.scrollTop();
        $("#" + drawerId.value).html(code);
        // console.log(
        //   $("#" + drawerId.value)
        //     .children()
        //     .attr("viewBox")
        // );
        // $("#" + drawerId.value)
        //   .children()
        //   .attr("viewBox", "0 0 1024 1024");
        zoomContext.update();
        // addEventListener();

        ds.setSettings({
          selectables: [...document.querySelectorAll("g." + nodeClass), ...document.querySelectorAll("g." + labelClass), ...document.querySelectorAll("." + linkClass)] as unknown as HTMLElement[],
        });
        // $(drawerId.value).removeClass("opacity-100");
      });
    }
  });

  ds.setSettings({
    draggability: false,
    selectables: [...document.querySelectorAll("g." + nodeClass), ...document.querySelectorAll("g." + labelClass), ...document.querySelectorAll("." + linkClass)] as unknown as HTMLElement[],
    selectedClass: "ds-selected",
    area: document.querySelector(".drawer") as HTMLElement,
  });
});
defineExpose({
  zoomContext,
  ds,
});
</script>
<style lang="less" scoped>
.drawer {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

g.node.selected {
  outline: invert;
  outline-offset: 2px;
}
</style>
