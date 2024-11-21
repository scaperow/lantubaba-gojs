import { FetchContext } from "ohmyfetch";
export const useErrorMessage = () => {
  const alertProps = reactive({ text: "", type: "error", title: "sdfdsf" });
  const snackbarProps = reactive({
    color: "error",
    timeout: 5000,
    text: "",
    "model-value": false,
    variant: "tonal",
  });

  const clear = () => {
    alertProps.text = "";
    alertProps.type = "error";
    snackbarProps.text = "";
    snackbarProps["model-value"] = false;
  };

  const handlerError = (
    error: FetchContext & {
      error: Error;
    }
  ) => {
    if (error.options?.signal?.aborted) {
      snackbarProps.text = alertProps.text = "服务器未响应，请重试";
      return;
    }

    snackbarProps.text = alertProps.text = "无法连接到服务器，请稍后再试";
    snackbarProps.timeout = -1;
    snackbarProps["model-value"] = true;
  };

  return {
    snackbarProps,
    handlerError,
    alertProps,
    clear,
  };
};
