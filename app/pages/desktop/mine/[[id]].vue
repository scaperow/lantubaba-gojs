<template>
  <div class="d-flex flex-1 flex-column justify-start">
    <v-breadcrumbs rounded :items="routes" divider=">">
      <template v-slot:prepend>
        <v-progress-circular size="20" width="2" v-show="currentLoadingParents" color="grey" indeterminate></v-progress-circular>
      </template>
      <template v-slot:title="{ item }">
        <v-btn variant="tonal" size="small">{{ item.title }}</v-btn>
      </template>
    </v-breadcrumbs>

    <div>
      <div>
        <v-slide-x-transition mode="in">
          <h6 class="text-blue-grey-lighten-2" v-show="folder.children && folder.children.length > 0">文件夹</h6>
        </v-slide-x-transition> 
        <v-fade-transition group mode="in" tag="div" class="d-flex flex-wrap">
          <div v-for="folder in folder.children" :key="folder.id">
            <folder-item @open="openFolder(folder)" :folder="folder" :current-on="currentOn" />
          </div>
        </v-fade-transition>
      </div>
      <div>
        <h6 class="mt-6 text-blue-grey-lighten-2">文件</h6>
        <map-list ref="loader">
          <template #foot v-if="folder">
            <more :index="folder.index" @start="fetch(false)" :has-more="folder && !folder.allMapsLoaded" :loading="isLoading">
              <template #empty>
                <h6 v-if="folder.index > -1 && folder.maps.length > 0" class="mt-6 text-blue-grey-lighten-2">没有更多了</h6>
                <div v-else>
                  <div class="text-center">
                    <!-- <div class="icon-backdrop">
                    <v-icon color="primary" class="backdrop">mdi-file</v-icon>
                    <label class="font-weight-black grey--text">没有内容</yarnlabel>
                  </div> -->
                    <v-btn size="large" prepend-icon="mdi-plus-circle" variant="outlined" rounded class="mt-6" color="grey" @click="createFile()"> 新建</v-btn>
                  </div>
                </div>
              </template>
            </more>
          </template>
        </map-list>
        <FileCreator ref="fileCreator"></FileCreator>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { findIndex, isArray, isEmpty } from "lodash";
import { useWorksStore } from "~~/stores/works";
import { storeToRefs } from "pinia";
import FolderItem from "~~/components/folder-item.vue";
import More from "~~/components/more.vue";
import FileCreator from "~~/components/file-creator.vue";
import MapList from "~~/components/map-list.vue";
const none = ref("1");
const fetched: boolean = false;
const fileCreator = ref(null);
const loader = ref();
const { params } = useRoute();
const worksStore = useWorksStore();
const { currentOn, size, total, isLoading, parentFolders, folder, currentLoadingParents, mappingFolders } = storeToRefs(worksStore);
const { fetchMaps, fetchFolders, setCurrentFolder } = worksStore;
const routes = computed(() => {
  return [...parentFolders.value, folder.value].map((folder) => {
    if (folder.id === 0) {
      return { to: "/desktop/" + currentOn.value + "/", replace: false, text: "我的文件", id: folder.id };
    } else {
      return { to: "/desktop/" + currentOn.value + "/" + folder.id, replace: false, text: folder.name, id: folder.id };
    }
  });
});

const folderId = computed(() => {
  return params.id || 0;
});
const fetch = async (resetIndex: boolean) => {
  try {
    await Promise.all([fetchFolders(), fetchMaps(resetIndex ? 0 : (folder.value?.index || -1) + 1)]);
  } catch (error) {
    throw error;
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
  fetch(false);
};
const createFile = () => {
  fileCreator?.value?.open();
};
watch(
  folderId,
  (id) => {
    if (!isArray(id)) {
      worksStore.$patch({
        currentOn: "mine",
        mine: {
          loading: true,
        },
      });
      setCurrentFolder(id || 0).then(() => {
        fetch(false);
      });
    }
  },
  {
    immediate: true,
  }
);
</script>
<style lang="scss" scoped></style>
