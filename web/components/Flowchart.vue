<template>
  <div :id="drawerId"></div>
</template>

<script lang="ts">
import Zoomer from "~/map/zoomer";
import mermaid from "mermaid";
import { FlowchartMap, MapNode } from "~/map/flowchart/interface";
import { shapes } from "~/map/flowchart/shapes";
import { PropType } from "vue";
import Vue from "vue/types/umd";

export default Vue.extend({
  mixins: [Zoomer],
  props: {
    mapObject: {
      required: true,
      type: Object as PropType<FlowchartMap>,
    },
    drawerId: {
      type: String,
      required: true,
    },
    styles: {
      type: Array,
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
      type: Object,
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
  },
  data() {
    return {
      edges: [...shapes],
    };
  },

  methods: {
    getGroupNodes(nodes: MapNode[]) {
      const innerMap = new Map();
      nodes.forEach((element: MapNode) => {
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
            const innerNodes: MapNode[] = [];
            const outNodes: MapNode[] = [];
            narr.forEach((node: MapNode) => {
              if (node.next) {
                innerNodes.push({
                  id: node.id,
                  text: node.text,
                  style: node.style,
                  editable: node.editable,
                });
                node.next.forEach((id) => {
                  if (nids.has(id)) {
                    innerNodes.push({
                      id: node.id,
                      text: node.text,
                      link: node.link,
                      next: [id],
                    });
                  } else {
                    outNodes.push({
                      id: node.id,
                      text: node.text,
                      link: node.link,
                      next: [id],
                    });
                  }
                });
              } else {
                innerNodes.push(node);
              }
            });
            const innerNodesStr = this.buildNodesStr(innerNodes);
            const outNodeStr = this.buildNodesStr(outNodes);
            return `subgraph ${groupName} \n ${innerNodesStr} end \n ${outNodeStr}`;
          } else {
            const nodesStr = this.buildNodesStr(narr);
            return nodesStr;
          }
        })
        .join(" \n");
    },
    buildNodesStr(nodes: MapNode[]) {
      return (
        nodes
          .map((item: MapNode) => {
            if (item.next && item.next.length > 0) {
              return item.next
                .map((n, index: number) => {
                  const next = this.nodeObject[n];
                  if (next != null && typeof next != "undefined") {
                    return `${this.buildNode(item)}${this.buildLink(
                      item,
                      index
                    )}${this.buildNode(next)}`;
                  } else {
                    //TODO error
                    return `${this.buildNode(item)}`;
                  }
                })
                .join("\n");
            } else {
              return `${this.buildNode(item)}`;
            }
          })
          .join("\n") +
        "\n" +
        nodes
          .filter((item: MapNode) => item.editable)
          .map((item: MapNode) => {
            return `click ${item.id} href "javascript:mermaidClick('${item.id}');"`;
          })
          .join("\n") +
        "\n" +
        nodes
          .filter((item: MapNode) => item.url)
          .map((item: MapNode) => {
            return `click ${item.id} "${item.url}"`;
          })
          .join("\n") +
        "\n"
      );
    },
    buildLink(item: MapNode, index: number) {
      const link = "-->";
      if (item.link) {
        if (Array.isArray(item.link)) {
          if (item.link.length > index) return item.link[index];
          else return item.link[item.link.length - 1];
        } else {
          return item.link;
        }
      }
      return link;
    },
    buildNode(item: MapNode) {
      let edge = !item.edgeType
        ? this.edges.find((e) => {
            return e.type === "node";
          })
        : this.edges.find((e) => {
            return e.type === item.edgeType;
          });
      if (edge) {
        return `${item.id}${edge.open}${item.text}${edge.close}`;
      }

      return "";
    },
    init() {
      //@ts-ignore
      window.mermaidClick = function (id: string) {
        // this.edit(id);
      };

      mermaid.initialize({
        ...this.defaultConfig,
        ...this.config,
        ...{
          mermaid: {
            callback: () => {},
          },
        },
      });
    },
    edit(id: any) {
      this.$emit("nodeClick", id);
    },
  },
  computed: {
    customStyle() {
      const nodeStyles = this.mapObject.nodes
        .filter((node) => node.style)
        .map((node) => `style ${node.id} ${node.style}`);
      let index = 0;
      const nodeLinkStyles = this.mapObject.nodes
        .filter((node: MapNode) => node.linkStyle)
        .map((node: MapNode) => {
          let linkNumber =
            node.linkNumber || node.linkNumber == 0 ? node.linkNumber : index;
          index++;
          return `linkStyle ${linkNumber} ${node.linkStyle}`;
        });

      return nodeStyles.concat(this.styles as string[]).concat(nodeLinkStyles);
    },
    nodeObject() {
      if (
        Array.isArray(this.mapObject.nodes) &&
        this.mapObject.nodes.length > 0
      ) {
        const arrayToObject = (arr: any[], keyField: string) =>
          Object.assign({}, ...arr.map((item) => ({ [item[keyField]]: item })));
        return arrayToObject(this.mapObject.nodes, "id");
      } else {
        return {};
      }
    },
    parseCode() {
      if (
        Array.isArray(this.mapObject.nodes) &&
        this.mapObject.nodes.length > 0
      ) {
        const parseCode = this.mapObject.type + "\n";
        const groupNodes = this.getGroupNodes(this.mapObject.nodes);
        const code =
          parseCode + groupNodes + (this.customStyle || []).join(" \n");
        return code;
      } else {
        return "";
      }
    },
  },
  mounted() {
    this.initZoomer(this.drawerId);
  },
  watch: {
    parseCode() {
      if (this.parseCode) {
        const preparedDrawerId = "#prepared_" + this.drawerId;
        mermaid.mermaidAPI.render(
          preparedDrawerId,
          this.parseCode,
          (code: any) => {
            const container = document.querySelector("#" + this.drawerId);
            if (container) {
              //@ts-ignore
              container.style.opacity = 0;
              container.innerHTML = code;
              this.initZoomer(this.drawerId);
              //@ts-ignore
              container.style.opacity = 1;
            }
          }
        );
      }
    },
  },
});
</script>
