<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props: hoverProps }">
      <div class="folder-item bg-white" v-bind="hoverProps">
        <div @click="push({ path: `/desktop/${currentOn}/${folder.id}`, replace: false })" color="grey-lighten-2" style="" class="">
          <v-icon class="pr-1" size="18" color="amber">mdi-folder</v-icon>
          <h6 class="text-truncate text-black">{{ folder.name }}</h6>
        </div>

        <v-menu offset-y content-class="overlay">
          <template v-slot:activator="{ props: menuProps, isActive }">
            <v-btn size="small" variant="tonal" color="grey" icon="mdi-dots-vertical" style="position: absolute; top: 6px; right: 4px" small v-bind="menuProps" v-show="isActive || isHovering"> </v-btn>
          </template>
          <v-list elevation="0">
            <v-list-item prepend-icon="mdi-folder-edit-outline" @click="emitter('rename')"> <v-list-item-subtitle slot="subtitle"> 重命名 </v-list-item-subtitle> </v-list-item>
            <v-list-item prepend-icon="mdi-close-outline" @click="emitter('remove')"><v-list-item-subtitle slot="subtitle">删除</v-list-item-subtitle> </v-list-item>
            <v-list-item prepend-icon="mdi-content-copy" @click="emitter('copy')"><v-list-item-subtitle slot="subtitle">复制</v-list-item-subtitle> </v-list-item>
            <v-list-item prepend-icon="mdi-content-duplicate" @click="emitter('copy_to')"><v-list-item-subtitle slot="subtitle">复制到</v-list-item-subtitle> </v-list-item>
            <v-list-item prepend-icon="mdi-file-move-outline" @click="emitter('move_to')"><v-list-item-subtitle slot="subtitle">移动到</v-list-item-subtitle> </v-list-item>
          </v-list>
        </v-menu>
        <!-- <v-card-text>
          <v-img v-if="model.isDelete === true" class="folder" src="/folder.svg" />
          <v-fade-transition v-if="model.isDelete === true">
            <v-overlay v-if="hover" absolute color="transparent">
              <v-btn block class="mb-2" @click.stop="emitter('remove_forever')">彻底删除</v-btn>
              <v-btn class="mb-2" @click.stop="emitter('recovery')" block>还原</v-btn>
            </v-overlay>
          </v-fade-transition>
        </v-card-text> -->
      </div>
    </template>
  </v-hover>

  <!-- <v-card-text v-else>
      <svg v-ripple @click.stop="emitter('open')" class="folder" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" width="190px"
        height="190px" viewBox="0 0 190 190" version="1.1">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
          <path
            d="M1.74272727,190 C0.78,190 0,189.197295 0,188.207672 L0,1.79232751 C0,0.802704646 0.78,0 1.74272727,0 L47.9354545,0 C50.3327273,0 51.8581818,2.12915984 51.8581818,2.12915984 L60.1372727,9.07454756 L188.256364,8.96258639 C189.219091,8.96258639 190,9.76529104 190,10.7549139 L190,188.207672 C190,189.197295 189.219091,190 188.256364,190 L1.74272727,190 Z"
            fill="#D5D8DB" stroke="#bbbbbb" stroke-width="1" sketch:type="MSShapeGroup" />
        </g>
      </svg>
    </v-card-text> -->
</template>
<script setup>
import { useWorksStore } from "~~/stores/works";
const worksStore = useWorksStore();
const emitter = defineEmits(["open", "rename", "remove", "copy_to", "copy", "move_to"]);
const { push } = useRouter();
defineProps({
  folder: {
    required: true,
  },
  currentOn: {
    required: true,
  },
});
</script>
<style lang="scss" scoped>
@use "~~/assets/settings.scss";

.folder-item {
  padding: 6px 12px;
  margin: 6px;
  width: 186px;
  cursor: pointer;
  border: solid 1px #e3e3e3;
  border-radius: 4px;
  position: relative;
}

.v-card {
  margin-right: 12px;

  svg {
    transition: all 0.3s;
    cursor: pointer;

    &.folder {
      &:hover {
        filter: drop-shadow(5px 5px 10px #ccc);
      }
    }
  }
}
</style>
