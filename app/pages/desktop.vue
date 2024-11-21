<template>
  <v-app>
    <v-navigation-drawer class="blue-grey lighten-5" v-model="drawer" app>
      <v-sheet class="pa-4 blue-grey lighten-5">
        <div class="logo dark ma-4" @click="$router.push('/')">
          <label>蓝图巴巴</label>
        </div>
        <div class="pa-2 text-center">
          <v-btn rounded outlined depressed color="primary" x-large @click="create()">
            <v-icon>mdi mdi-plus</v-icon>
            新建</v-btn
          >
        </div>
      </v-sheet>

      <v-list nav color="blue-grey-darken-2">
        <v-list-item :to="{ name: 'desktop-mine-id' }" title="我的文件" prepend-icon="mdi-file" />
        <v-list-item :to="{ name: 'desktop-favorite-id', params: { id: 'favorite' } }" title="我的收藏" prepend-icon="mdi-star" />
        <v-list-item :to="{ name: 'desktop-recycle-id', params: { id: 'recycle' } }" title="回收站" prepend-icon="mdi-trash-can" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4 d-flex flex-column" style="height: 100vh; position: relative">
        <div class="d-flex flex-row justify-space-between">
          <div class="bg-white">
          <v-text-field variant="plain" color="secondary" prepend-icon="mdi-magnify" hide-details @click:append-inner="onClick" class="flex-grow-1" style="max-width: 320px" label="搜索标题/文件夹名称" @click:append-outer="search" @keydown.enter="search" @click:clear="cancelSearch" v-model="keyword">
          </v-text-field>
        </div>
          <user-avatar style="width: 45px; height: 45px"></user-avatar>
        </div>

        <v-slide-y-transition style="padding: 24px">
          <div class="toolbar" v-show="multiSelected">
            <v-btn variant="flat" prepend-icon="mdi-check-all"><span class="text-caption">全选</span></v-btn>
            <v-btn variant="flat" prepend-icon="mdi-file-move-outline"><span class="text-caption">移动</span></v-btn>
            <v-btn variant="flat" prepend-icon="mdi-content-copy"><span class="text-caption">复制</span></v-btn>
            <v-btn variant="flat" prepend-icon="mdi-file-document-remove-outline"><span class="text-caption">删除</span></v-btn>
            <v-btn variant="flat" prepend-icon="mdi-cancel"><span class="text-caption">取消全选并关闭</span></v-btn>
          </div></v-slide-y-transition
        >
        <nuxt-page class="flex-grow-1"></nuxt-page>

        <FileCreator ref="fileCreator"></FileCreator>
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { every, findIndex, includes } from "lodash";
import { storeToRefs } from "pinia";
import { IMapView, useWorksStore } from "~~/stores/works";
import FileCreator from "~~/components/file-creator.vue";
import { PropType, Ref } from "vue";

const onClick = () => {};
const { folder } = storeToRefs(useWorksStore());
const drawer = ref(true);
const fileCreator: Ref<typeof FileCreator | null> = ref(null);
const keyword = ref("");
const search = () => {};
const cancelSearch = () => {};
const create = () => {
  if (fileCreator.value) {
    fileCreator.value.open();
  }
  // console.log(creator.value.);
};
const multiSelected = computed(() => findIndex(folder.value.maps, (map: IMapView) => map.checked) > -1);
</script>
<style lang="less" scoped>
.toolbar {
  position: absolute;
  top: 0;
  /* width: 100%; */
  display: flex;
  left: 0;
  right: 0;
  /* padding-left: 256px; */
  background: white;
  z-index: 333;
  height: 110px;
  box-shadow: rgb(17 12 46 / 15%) 0px 48px 100px 0px;
  /* line-height: 110px; */
  align-items: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-list .v-list-item .v-icon {
  margin: 4px;
  border-radius: 8px;
  background: white;
  padding: 12px;
}

.v-list .v-list-item--active .v-icon {
  margin: 4px;
  border-radius: 12px;
  background: white;
  padding: 18px;
}
</style>
