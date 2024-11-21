<template>
  <div class="d-flex flex-1 flex-column justify-start">
    <v-breadcrumbs rounded :items="routes" divider=">">
      <template v-slot:prepend>
        <v-progress-circular size="20" width="2" v-show="currentLoadingParents" color="grey" indeterminate></v-progress-circular>
      </template>
    </v-breadcrumbs>
    <div :class="isLoading ? 'd-flex flex-grow-1 justify-center align-center' : ''" v-show="isLoading">
      <v-progress-circular :size="80" color="grey" indeterminate></v-progress-circular>
    </div>
    <div v-show="!isLoading">
      <div v-show="currentOn === 'mine' && folders && folders.length > 0">
        <h6 class="text-blue-grey-lighten-2">文件夹</h6>
        <FolderItem @open="openFolder(folder)" v-for="folder in folders" :key="folder.id" :folder="folder" :current-on="currentOn"></FolderItem>
      </div>
      <div>
        <h6 class="mt-6 text-blue-grey-lighten-2">文件</h6>
        <MapList>
          <slot name="foot">
            <More :index="index" :count="maps.length" ref="loader" @start="fetch" :has-more="hasMore" :loading="isLoading">
              <slot name="empty">
                <div class="text-center" v-if="!isLoading && index <= 0 && maps && maps.length === 0">
                  <div class="icon-backdrop">
                    <v-icon color="primary" class="backdrop">mdi-file</v-icon>
                    <label class="font-weight-black grey--text">没有内容</label>
                  </div>
                  <v-btn rounded outlined class="mt-6" depressed color="primary" x-large @click="createFile()">
                    <v-icon>mdi mdi-plus</v-icon>
                    新建</v-btn
                  >
                  <FileCreator ref="fileCreator"></FileCreator>
                </div>
              </slot>
            </More>
          </slot>
        </MapList>
      </div>
    </div>
  </div>
</template>
<script setup>
import { findIndex, isEmpty } from "lodash";
import { useWorksStore } from "~~/stores/works";
import { storeToRefs } from "pinia";
import FolderItem from "~~/components/folder-item.vue";
import More from "~~/components/more.vue";
import FileCreator from "~~/components/file-creator.vue";
import MapList from "~~/components/map-list.vue";
const fileCreator = ref(null);
const { params } = useRoute();
const worksStore = useWorksStore();
const { currentOn, maps, folders, size, index, total, isLoading, parentFolders, folder, currentLoadingParents } = storeToRefs(worksStore);
const { fetchMaps, fetchFolders, setCurrentFolder } = worksStore;
onMounted(() => {
  worksStore.$patch({ currentOn: currentOnRouter.value });
  setCurrentFolder(folderId.value);
  fetch();
});
const routes = computed(() => {
  return [
    { text: "我的文件", to: "/desktop/" + currentOn.value, id: 0, replace: true },
    ...[...parentFolders.value, folder.value]
      .filter((f) => !isEmpty(f))
      .map((folder) => ({
        to: "/desktop/" + currentOn.value + "/" + folder.id,
        replace: true,
        text: folder.name,
        id: folder.id,
      })),
  ];
});
const currentOnRouter = computed(() => {
  return params.id;
});
const folderId = computed(() => {
  return params.folder || 0;
});
const hasMore = computed(() => {
  return (index.value + 1) * size.value < total.value;
});
const fetch = async () => {
  try {
    worksStore.$patch({
      [currentOn.value]: {
        loading: true,
      },
    });

    await Promise.all([fetchMaps(), fetchFolders()]);
    // await this.$store.dispatch("works/fetch");

    // resolve();
    // if (this.list.length >= this.count) {
    //   reject && reject();
    // } else {
    //   resolve && resolve();
    // }
  } catch (error) {
    // this.$catch(error);
  } finally {
    worksStore.$patch({
      [currentOn.value]: {
        loading: false,
      },
    });
  }
};

const openFolder = async (enterToFolder) => {
  // worksStore.$patch({
  //   [currentOn.value]: {
  //     works: [],
  //     loading: true,
  //     folders: [],
  //     folder: [...folder.value, enterToFolder],
  //   },
  // });
  // fetch();
};

const linkFolder = (folder) => {
  if (folder.id === 0) {
    // setFolder([]);
    worksStore.$patch({
      [currentOn.value]: { folder: [] },
    });
  } else {
    const index = findIndex(folder, (f) => f.id === folder.id);

    worksStore.$patch({
      [currentOn.value]: { folder: folder.slice(0, index + 1) },
    });
  }
  fetch();
};
const createFile = () => {
  fileCreator?.value?.open();
};
</script>
<style lang="scss" scoped>
ul.v-breadcrumbs {
  padding: 6px;
  margin-bottom: 16px;
  border-left: solid 6px #f3f3f3;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 22px;
}
</style>
