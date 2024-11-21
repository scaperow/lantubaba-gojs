export const useThemeStore = defineStore("maps", {
  state: () => {
    return {
      app: {
        theme: "app",
        themeVariables: {
          primaryColor: "#BB2528",
          primaryTextColor: "#fff",
          primaryBorderColor: "#7C0000",
          lineColor: "#F8B229",
          secondaryColor: "#006100",
          tertiaryColor: "#fff",
        },
      },
      deepin: {
        theme: "app",
        themeVariables: {
          primaryColor: "#5FBDB4",
          primaryTextColor: "#C7E6E4",
          primaryBorderColor: "#5FBDB4",
          lineColor: "#858D9C",
          secondaryColor: "#472F55",
          tertiaryColor: "#C7E6E4",
        },
      },
      breath: {
        theme: "app",
        themeVariables: {
          primaryColor: "#F19437",
          primaryTextColor: "#fff",
          primaryBorderColor: "#fff",
          lineColor: "#B0BEC5",
          secondaryColor: "#5E7C8C",
          tertiaryColor: "#7A7B7B",
        },
      },
      sober: {
        theme: "app",
        themeVariables: {
          primaryColor: "#0E3361",
          primaryTextColor: "#C0DDE8",
          primaryBorderColor: "#0E3361",
          lineColor: "#ABCBE2",
          secondaryColor: "#799CB4",
          tertiaryColor: "#ABCBE2",
        },
      },
    };
  },
});
