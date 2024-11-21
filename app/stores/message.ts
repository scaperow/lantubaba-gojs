export const useMapsStore = defineStore("maps", {
  state: () => {
    return {
      mapCategory: [
        {
          category: 1,
          label: "流程图",
          icon: "iconfont icon-liuchengtu",
          color: ["#1F618D", "#71AFD9"],
        },
        {
          label: "思维导图",
          category: 2,
          icon: "iconfont icon-siweidaotu",
          color: ["#148F77", "#60DBC3"],
        },
        {
          label: "实体图",
          category: 3,
          icon: "iconfont icon-shititu",
          color: ["#839192", "#AAB7B8"],
        },
      ],
    };
  },
});
