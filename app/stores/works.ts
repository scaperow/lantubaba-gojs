import { IMapObject } from "./../components/flowchart/interface";
// import Parse from "parse";
// import Http from '~/api/common'
import { STATEMENT_OR_BLOCK_KEYS } from "@babel/types";
import _, { last, find, indexOf, chain, map, get, toUpper, camelCase, each, pull, pullAllWith, toNumber, reduce, isEmpty, cloneDeep, defaults } from "lodash";
import { root } from "postcss";
import { parentPort } from "worker_threads";
import { IFolder } from "./types";
import { mapState } from "pinia";
import { FetchResult } from "#app";
import { IMapNode } from "~~/components/flowchart/interface";

// import go from "gojs";

// const FavoriteClass = Parse.Object.extend('favorite')
// const WorksClass = Parse.Object.extend('works')
// const Works = Http.create('works')

const allowedCurrentOn = ["mine", "favorite", "recycle"];

const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// mutations
// const mutations = {
//   SET_LIST(state, { count = this.count, results = this.results, folderId = this.folderId, index = this.index, size = this.size }) {
//     this.count = count;
//     this.folderId = folderId;
//     this.index = index;
//     this.size = size;
//     localStorage.folderId = folderId;

//     this.objects = results;
//     this.list = processList(results);
//   },
//   SET_SEARCH_LIST(state, list) {
//     this.searchObjects = list.results;
//     this.searchList = processList(list.results);
//   },
//   NEW_MAP(state, map) {
//     state[this.currentOn].files.push(map);
//   },
//   NEW_FOLDER(state, folder) {
//     state[this.currentOn].folders.push(folder);
//   },
//   SET_FOLDERS(state, folders) {
//     const index = this.index(state);

//     if (index === 0) {
//       state[this.currentOn].folders = [...folders];
//     } else {
//       state[this.currentOn].folders = [...state[this.currentOn].folders, ...folders];
//     }
//   },
//   SET_MAPS(state, maps, index) {
//     state[this.currentOn].maps = index === 0 ? maps : [...this.currentView(state).maps, ...maps];
//     state[this.currentOn].index = index;
//   },
//   SET_FOLDER(state, folder) {
//     state[this.currentOn].folder = folder;
//     state[this.currentOn].index = -1;
//   },
//   SET_CURRENTON(state, currentOn) {
//     if (!allowedCurrentOn.includes(currentOn)) {
//       throw new Error("currentOn can only be a anyone of list:" + allowedCurrentOn);
//     }

//     this.currentOn = camelCase(currentOn);
//   },
//   SET_CURRENTON_WORKS(state, currentState) {
//     state[this.currentOn] = {
//       ...state[this.currentOn],
//       ...currentState,
//     };
//   },
// };

const getFolderMaps = (children: IFolderView[]): { [index: number]: IFolderView } => {
  return children.reduce<{ [index: number]: IFolderView }>(
    (result, current) => ({
      ...result,
      [current.id]: current,
      ...getFolderMaps(current.children),
    }),
    {}
  );
};

const rootFolder: IFolderView = {
  allChildrenLoaded: false,
  children: [],
  allMapsLoaded: false,
  index: -1,
  id: 0,
  name: "",
  parentId: 0,
  maps: [],
};

export interface IMap {
  id: number;
  name: string;
  folderId: number;
  raw: IMapNode[];
}
export interface IMapView extends IMap {
  checked: boolean;
}

export interface IMapResponse {
  isAllSucceeded: boolean;
  rows: IMap[];
}
interface IFolderView extends IFolder {
  allChildrenLoaded: boolean;
  children: IFolderView[];
  allMapsLoaded: boolean;
  index: number;
  maps: IMapView[];
}

export interface IWorksView {
  folders: IFolderView[];
  size: number;
  folder: IFolderView;
  total: number;
  loading: boolean;
  loadingParents: boolean;
}
export interface ISearchView {
  folders: IFolderView[];
  maps: IMapView[];
  loading: boolean;
  keywords: string;
  size: number;
  index: number;
  total: number;
}
export interface IWorksState {
  searchIndex: 0;
  searchCount: 20;
  searchList: [];
  currentOn: "mine" | "favorite" | "recycle";
  mine: IWorksView;
  recycle: IWorksView;
  favorite: IWorksView;
  searchViews: ISearchView[]
}

export const useWorksStore = defineStore("works", {
  state: (): IWorksState => ({
    searchIndex: 0,
    searchCount: 20,
    searchList: [],
    currentOn: "mine",
    mine: {
      folders: [{ ...rootFolder }],
      size: 20,
      folder: { ...rootFolder },
      total: 0,
      loading: false,
      loadingParents: false,
    },
    recycle: {
      folders: [{ ...rootFolder }],
      size: 20,
      folder: { ...rootFolder },
      total: 0,
      loading: false,
      loadingParents: false,
    },
    favorite: {
      folders: [{ ...rootFolder }],
      size: 20,
      folder: { ...rootFolder },
      total: 0,
      loading: false,
      loadingParents: false,
    },
    searchViews: []
  }),
  getters: {
    currentView(state) {
      switch (state.currentOn) {
        case "mine":
          return state.mine;

        case "favorite":
          return state.favorite;

        case "recycle":
          return state.recycle;

        default:
          return state.mine;
      }
    },
    mappingFolders(state): { [index: number]: IFolderView } {
      return getFolderMaps(state[state.currentOn].folders);
    },
    // currentFolder(state) {
    //   return last(state[state.currentOn].folder) || { id: 0 };
    // },
    // maps(state) {
    //   return state[state.currentOn].folder.maps;
    // },
    // total(state) {
    //   return state[state.currentOn].total;
    // },
    size(state) {
      return state[state.currentOn].size;
    },
    isLoading(state) {
      return state[state.currentOn].loading;
    },
    folder(state): IFolderView {
      return state[state.currentOn].folder;
    },
    parentFolders(state) {
      let result: IFolderView[] = [];
      let childFolder = this.folder;

      while (true) {
        if (childFolder && childFolder.id !== 0) {
          const parent = this.mappingFolders[childFolder.parentId];
          if (parent) result.splice(0, 0, parent);
          childFolder = parent;
          continue;
        }
        break;
      }

      return result;
    },
    currentLoadingParents(state) {
      return state[state.currentOn].loadingParents;
    },
  },
  actions: {
    async setCurrentFolder(id: number | string) {
      const folderId = toNumber(id);
      const localFolder = this.mappingFolders[folderId];
      if (localFolder) {
        this.$patch({
          [this.$state.currentOn]: {
            folder: localFolder,
          },
        });
      } else {
        this.$patch({
          [this.currentOn]: {
            loadingParents: true,
          },
        });

        const { data: serverFolder } = await useAPIFetch<IFolder>(`/folders/${folderId}`);
        if (serverFolder.value) {
          const serverFolderView: IFolderView = {
            ...serverFolder.value,
            children: [],
            allChildrenLoaded: false,
            allMapsLoaded: false,
            index: -1,
            maps: [],
          };

          this.$patch({
            [this.currentOn]: {
              folder: serverFolderView,
            },
          });
          const rootFolder = await this.getRootFolder(serverFolderView);

          this.$patch((state) => {
            state[state.currentOn].loadingParents = false;
            state[state.currentOn].folders[0].children.push(rootFolder);
          });
        }
      }
    },
    async getRootFolder(childFolder: IFolderView): Promise<IFolderView> {
      if (childFolder.parentId !== 0) {
        const { data: parentFolder } = await useAPIFetch<IFolder>(`/folders/${childFolder.parentId}`);

        if (parentFolder.value) {
          const parentFolderView: IFolderView = {
            ...parentFolder.value,
            children: [childFolder],
            allChildrenLoaded: false,
            index: -1,
            allMapsLoaded: false,
            maps: [],
          };

          return await this.getRootFolder(parentFolderView);
        }
      }

      return childFolder;
    },
    async fetchMaps(index: number) {
      if (!this.folder.allMapsLoaded) {
        const { data } = await useAPIFetch<IMapResponse>("/maps", {
          onRequestError: (error) => {},
          query: {
            index: index,
            parentId: this.folder.id,
            mode: this.currentOn,
            size: this.currentView.size,
          },
        });

        if (data && data.value) {
          const rows = map(data.value?.rows, (row) => ({
            ...row,
            checked: false,
          }));

          // const index = reset ? -1 : (this.folder.index || 0) + (data.value?.isAllSucceeded ? 0 : 1);
          const maps = index === 0 ? rows : [...this.folder.maps, ...(rows || [])];

          this.$patch({
            [this.$state.currentOn]: {
              folder: { ...this.folder, index, allMapsLoaded: data.value?.isAllSucceeded, maps },
            },
          });
        }
      }
    },
    async fetchMap(id: number | string, errorHandler: Function): Promise<IMapView | null> {
      const { data } = await useAPIFetch<IMapObject>(`/maps/${id}`, {
        onRequestError(ctx) {
          errorHandler(ctx);
        },
      });

      if (data && data.value) {
        const result: IMapView = defaults(
          {
            ...data.value,
            checked: false,
          },
          {
            raw: [],
          }
        );

        return result;
      }

      return null;
    },
    async fetchFolders() {
      if (!this.folder?.allChildrenLoaded) {
        const { data: folders } = await useAPIFetch<[IFolder]>(`/folders`, {
          query: {
            parentId: this.folder.id,
          },
        });

        const folderViews = map(folders.value, (f) => ({
          ...f,
          allChildrenLoaded: false,
          allMapsLoaded: false,
          maps: [],
          index: -1,
          children: [],
        }));

        this.$patch((state) => {
          const folder = state[state.currentOn].folder;
          if (folder) {
            folder.children = folderViews;
            folder.allChildrenLoaded = true;
          }
        });
      }
    },
    async getMineList({ folderId = null, index = 0, size = 20 } = {}) {
      // var user = await dispatch("user/getUser", null, { root: true });
      // folderId =
      //   folderId ||
      //   this.folderId ||
      //   localStorage.folderId ||
      //   (this.folderList.length > 0 && this.folderList[0].objectId);
      // if (folderId) {
      // var { count, results } = await new Parse.Query(WorksClass)
      //   .notEqualTo('isDelete', true)
      //   .notEqualTo('isFolder', true)
      //   .equalTo('parentId', folderId)
      //   .include('style')
      //   .include('share')
      //   .equalTo('user', user)
      //   .limit(size)
      //   .skip(index * size)
      //   .withCount()
      //   .find()
      // if (index === 0) {
      //   commit('SET_LIST', { count, results, folderId })
      // } else {
      //   commit('SET_LIST', { count, results: [...this.objects, ...results], folderId })
      // }
      // }
    },
    async getRecycleList({ index = 0, size = 20 } = {}) {
      // var user = await dispatch('user/getUser', null, { root: true })
      // var { count, results } = await new Parse.Query(WorksClass)
      //   .equalTo('isDelete', true)
      //   .equalTo('user', user)
      //   .notEqualTo('isFolder', true)
      //   .skip(index * size)
      //   .limit(size)
      //   .withCount()
      //   .find()
      // if (index === 0) {
      //   commit('SET_LIST', { count, results, folderId: 'recycle' })
      // } else {
      //   commit('SET_LIST', {
      //     count, results: [...(this.objects || []), ...(results || [])], folderId: 'recycle'
      //   })
      // }
    },
    async getFavoriteList({ index = 0, size = 20 } = {}) {
      // var user = await dispatch('user/getUser', null, { root: true })
      // var { count, results } = await new Parse.Query(FavoriteClass)
      //   .equalTo('user', user)
      //   .select('works.user', 'works.name')
      //   .notEqualTo('works.isFolder', true)
      //   .skip(index * size)
      //   .limit(size)
      //   .withCount()
      //   .find()
      // if (index === 0) {
      //   commit('SET_LIST', { count, results, folderId: 'favorite' })
      // } else {
      //   commit('SET_LIST', {
      //     count, results: [...(this.objects || []), ...(results || [])], folderId: 'favorite'
      //   })
      // }
    },
    // async getShareList({ folder = null } = {}) {
    //   var user = await dispatch('user/getUser', null, { root: true })

    //   var shareFilter =
    //     Parse.Query.or(
    //       new Parse.Query(ShareClass).equalTo('shareWithPicture', true),
    //       new Parse.Query(ShareClass).equalTo('shareWithMedia', true),
    //       new Parse.Query(ShareClass).equalTo('shareWithLink', true))

    //   var worksFilter = getWorksFilter(user.objectId, folder)
    //     .matchesKeyInQuery('objectId', 'source', shareFilter)

    // var worksFilter = getWorksFilter(user.objectId, folder)ate

    // var shareFilter = Parse.Query.or(
    //   new Parse.Query(WorksClass).equalTo('share.shareWithPicture', true),
    //   new Parse.Query(WorksClass).equalTo('share.shareWithMedia', true),
    //   new Parse.Query(WorksClass).equalTo('share.shareWithLink', true))

    // var filter = Parse.Query.and(worksFilter, shareFilter)
    //   commit('SET_LIST', await worksFilter.find())
    // },
    // async getTeamList({ commit, dispatch }, { folder } = {}) {
    //   var user = await dispatch('user/getUser', null, { root: true })

    //commit('SET_TEAMLIST', await getWorksFilter(user.objectId, folder).find())
    //   commit('SET_LIST', await getWorksFilter(user.objectId, folder).find())
    // },
    // async getRecycleList({ commit }) {
    //   var filter = new Parse.Query(WorksClass)
    //     .equalTo('isDelete', true)
    //     .doesNotExist('isFolder')

    //   commit('SET_LIST', await filter.find())
    // },
    async favorite({ id, worksId, isFavorite }) {
      // var user = await dispatch('user/getUser', null, { root: true })
      // var favorite = FavoriteClass.createWithoutData(id)
      // var works = WorksClass.createWithoutData(worksId)
      // if (isFavorite) {
      //   await this.favoriteObject.save({
      //     user,
      //     works,
      //   });
      //   if (this.folderId === 'favorite') {
      //     this.objects.splice(0, 0, favorite)
      //     commit('SET_LIST', {
      //       count: this.count + 1,
      //       results: [...this.objects, favorite],
      //       folderId: 'favorite'
      //     })
      //   }
      // } else {
      //   await favorite.destroy()
      //   if (this.folderId === 'favorite') {
      //     var index = _.findIndex(this.objects, { id: id })
      //     if (index >= 0) {
      //       this.objects.splice(index, 1)
      //       commit('SET_LIST', {
      //         count: this.count - 1,
      //         results: this.objects,
      //         folderId: 'favorite'
      //       })
      //     }
      //   }
      // }
    },
    async search({ keyword, folder } = {}) {
      if (keyword) {
        const filter = {};

        if (folder) {
          filter.parentId = folder.id;
        }

        if (keyword) {
          filter.keyworks = keyword;
        }

        const { data: list } = $axios.get("/works", { params: filter });
        mutations.SET_SEARCH_LIST(state, list);
      }
    },
    async createMap(model: object, parentId: number, errorHandler: Function) {
      const { data } = await useAPIFetch("/maps", {
        method: "POST",
        body: model,
        onRequestError: (error) => errorHandler(error),
      });

      if (data && data.value) {
        const newModel = { ...model, ...data.value } as unknown as IMapView;

        this.$patch((state) => {
          const folder = this.mappingFolders[parentId];
          folder.maps.push(newModel);
        });

        return newModel;
      }

      return null;
    },
    async createFolder(model: object, parentId: number, handleError: Function) {
      const { data } = await useAPIFetch("/folders", {
        method: "POST",
        body: model,
        onRequestError: (error) => {
          handleError(error);
        },
      });

      if (data && data.value) {
        const newModel = { ...model, ...data.value } as unknown as IFolderView;

        this.$patch((state) => {
          const folder = this.mappingFolders[parentId];
          folder.children.push(newModel);
        });

        return newModel;
      }

      return null;
    },
    async update(object) {
      // var works = find(this.objects, { id: object.id || object.objectId });
      // var index = indexOf(this.objects, works);
      // if (works) {
      //   var newly = await works.save(object);
      //   this.objects.splice(index, 1, newly);
      //   commit("SET_LIST", { results: this.objects });
      // }
    },

    async recovery(id) {
      // var list = this.objects;
      // var ids = id instanceof Array ? id : [id];
      // await asyncForEach(ids, async (id) => {
      //   var model = find(list, { id });
      //   var index = indexOf(list, model);
      //   model.unset("isDelete");
      //   await model.save();
      //   list.splice(index, 1);
      // });
      // commit("SET_LIST", { results: list });
    },
    async removeFolder({ id, isDeleted }) {
      // const ids = id instanceof Array ? id : [id];
      // const { data: deletedIds } = await $axios.delete(`folders`, {
      //   params: {
      //     isDeleted,
      //     id: ids.join(","),
      //   },
      // });
      // const list = pullAllWith(this.folders(state), deletedIds, (map, deletedId) => toNumber(map.id) === toNumber(deletedId));
      // mutations.SET_FOLDERS(state, list, this.index(state));
    },
    async remove({ id, isDeleted }) {
      // const ids = id instanceof Array ? id : [id];
      // const { data: deletedIds } = await $axios.delete(`maps`, {
      //   params: {
      //     isDeleted,
      //     id: ids.join(","),
      //   },
      // });
      // const list = pullAllWith(this.maps(state), deletedIds, (map, deletedId) => toNumber(map.id) === toNumber(deletedId));
      // mutations.SET_LIST(state, list, this.index(state));
      // await asyncForEach(ids, async (id) => {
      //   var model = _.find(list, { id });
      //   var index = _.indexOf(list, model);
      //   if (model.has("isDelete")) {
      //     // physics delete
      //     await model.destroy();
      //   } else {
      //     // logic delete
      //     model.set("isDelete", true);
      //     await model.save();
      //   }
      //   // dispatch('system/putSummary', {
      //   //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
      //   //   value: -1
      //   // })
      //   list.splice(index, 1);
      // });
    },
    // async clearRecycle({ commit }) {
    //   var success = false;

    //   try {
    //     await Parse.Cloud.run("clearRecycle");
    //     success = true;
    //   } catch (error) {
    //     console.error(error);
    //     throw error;
    //   }

    //   if (success) {
    //     commit("SET_LIST", {
    //       results: [],
    //       count: 0,
    //     });
    //   }
    // },
    async move({ folderId, fileId }) {
      // var isOtherFolder = false;
      // var file = _.find(this.objects, { id: fileId });
      // var index = _.findIndex(this.objects, { id: fileId });
      // if (file) {
      //   isOtherFolder = file.get("parentId") !== folderId;
      //   file.set("parentId", folderId);
      //   await file.save();
      //   if (isOtherFolder) {
      //     this.objects.splice(index, 1);
      //     commit("SET_LIST", { results: this.objects });
      //   }
      // }
    },

    async copy({ folderIds, fileId }) {
      var file = _.find(this.objects, { id: fileId });
      var fileModel = null;
      var sameFolder = [];
      if (file) {
        // await asyncForEach(folderIds, async (folderId) => {
        fileModel = file.clone();
        fileModel.set("parentId", folderId);
        //fileModel.set('name', file.get('name') + '(复制)')
        // await fileModel.save();

        // if (folderId === (file.get("parentId") || null)) {
        //   sameFolder.push(fileModel);
        // }

        // dispatch('system/putSummary', {
        //   code: model.get('isPrivate') ? 'privateFile' : 'publicFile',
        //   value: 1
        // })
      }

      // this.objects = [...this.objects, ...sameFolder];
      // commit("SET_LIST", { results: this.objects });
    },
  },
});

// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations,
// };
