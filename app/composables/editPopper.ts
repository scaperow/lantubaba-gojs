import { popper, createPopper, Instance } from "@popperjs/core";
import { Ref } from "vue";

const useEditPopper = (popoverRef: Ref<HTMLElement | null>, onBeforeShow?: () => Boolean) => {
  let popoverInstance: Instance | null = null;

  const popoverShow = ref(false);
  const show = (target: HTMLElement) => {
    if (onBeforeShow && !onBeforeShow()) {
      return;
    }

    if (popoverRef.value) {
      popoverInstance = createPopper(target, popoverRef.value, {
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

  const hide = () => {
    popoverInstance?.destroy();
    popoverShow.value = false;
  };

  const update = () => {
    popoverInstance?.update();
  };

  return {
    popoverInstance,
    popoverShow,
    update,
    show,
    hide,
  };
};

export default useEditPopper;
