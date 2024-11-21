<template>
  <v-row>
    <v-col cols="4" style="padding: 0" v-for="shape in edgeTypes" :key="shape.type">
      <v-hover>
        <template v-slot:default="{ isHovering, props }">
          <v-sheet rounded v-bind="props" class="pa-2 ma-2 d-flex flex-column justify-space-between align-center" style="width: 116; cursor: pointer; height: 126px" :color="isHovering ? 'grey-lighten-4' : ''" @click="emit('select', shape.type)">
            <img class="replace-svg" :class="isHovering ? 'hover' : ''" :src="shapesObject[shape.type]" />
            <label v-show="!isHovering">{{ shape.label }}</label>
          </v-sheet>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { filename } from "pathe/utils";
import { edgeTypes } from "./flowchart/edgeTypes";

const glob = import.meta.glob("~/assets/shapes/*.svg", { eager: true });
const shapesObject = Object.fromEntries(Object.entries(glob).map(([key, value]) => [filename(key), value.default]));
const lines = [];
const emit = defineEmits(["select"]);
</script>
<style lang="less" scoped>
.replace-svg {
  width: 80px;
  height: 80px;

  &.hover {
    width: 116px;
    height: 126px;
  }
}
</style>
