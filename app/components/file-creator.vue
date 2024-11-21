<template>
  <v-dialog v-model="isShowing" :persistent="true" max-width="520" scrollable>
    <v-slide-y-transition mode="in">
      <div class="mb-6" v-show="alertProps.text">
        <v-alert border="start" v-bind="alertProps" :closable="false"></v-alert>
      </div>
    </v-slide-y-transition>
    <v-card>
      <v-card-text class="d-flex flex-column justify-space-between">
        <label class="font-weight-thin text-title-2">新建</label>
        <v-divider class="my-4" />

        <div>
          <h6 class="text-blue-grey-lighten-2">请输入名称</h6>
          <v-text-field class="mx-2 mt-2 text-body-2" variant="outlined" color="blue-grey" placeholder="请输入名称" outlined v-model="fileName" :rules="[]"></v-text-field>
        </div>
        <div class="mt-4">
          <h6 class="text-blue-grey-lighten-2">请选择类型</h6>
          <v-item-group class="d-flex flex-row justify-center mt-2 ml-2" mandatory @update:model-value="selectMap = $event" selected-class="checked">
            <template v-for="map in combineMaps" :key="map.name">
              <v-item v-slot="{ toggle, selectedClass }" :value="map">
                <v-card class="d-flex justify-center align-center flex-column mx-1 text-white" variant="tonal" height="100" width="120" :class="['card', selectedClass]" key="map.name" @click="toggle" :style="`background:linear-gradient(70deg, ${map.color[0]}, ${map.color[1]}); outline: solid 0 ${map.color[0]}`">
                  <span class="pa-2" :class="map.icon"></span>
                  <h6 style="letter-spacing: 6px !important" class="text-subtitle-2 font-weight-thin">{{ map.label }}</h6>
                </v-card>
              </v-item>
            </template>
          </v-item-group>
        </div>

        <!-- <div :elevation="4"> -->
        <!-- <div class="mt-4 mb-2">请选择蓝图类型</div> -->
        <!-- <v-btn-toggle color="primary" v-model="selectMap"> -->
        <!-- <v-hover v-for="map in maps" :key="map.id">
              <template v-slot:default="{ hover }">
                <v-btn text :value="map">
                  <v-icon
                    :class="selectMap === map ? 'bounce colorful' : ''"
                    class="mx-2 animated fast"
                    :color="selectMap === map ? 'primary ' : 'grey'"
                    >{{ map.icon }}</v-icon
                  >
                  {{ map.label }}
                </v-btn>
              </template>
            </v-hover> -->
        <!-- </v-btn-toggle> -->
        <!-- </div> -->
        <!-- <div>
          <div class="mt-4 mb-2">
            查看权限
            <v-menu top offset-y>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-help-circle</v-icon>
              </template>
              <v-card color="grey lighten-4">
                <v-card-text>
                  <div>
                    公开文件会自动同步到
                    <v-btn outlined small nuxt to="/square" class="mx-2">
                      广场页面
                      <v-icon>mdi-href</v-icon> </v-btn
                    >，并且所有用户可见。
                  </div>
                  <div>私有文件可仅自己可见</div>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>

          <div class="d-flex justify-start">
            <v-btn-toggle color="primary " v-model="isPrivate">
              <v-btn text :value="true">
                <v-icon
                  :class="isPrivate === true ? 'bounce colorful' : ''"
                  class="mx-2 animated"
                  :color="isPrivate ? 'primary' : 'grey'"
                  >mdi-lock-open-variant</v-icon
                >开放
              </v-btn>
              <v-btn text :value="false">
                <v-icon
                  :class="isPrivate !== true ? 'bounce colorful' : ''"
                  class="mx-2 animated"
                  :color="!isPrivate ? 'primary' : 'grey'"
                  >mdi-lock</v-icon
                >私有
              </v-btn>
            </v-btn-toggle>
          </div>
        </div> -->
        <v-divider class="my-6" />
        <div class="d-flex flex-grow-1 justify-end">
          <v-btn :loading="isLoading" color="primary" variant="flat" @click="create">确定</v-btn>
          <v-btn flat @click="isShowing = false">取消</v-btn>
          <!-- <v-btn color="primary" depressed @click="create" v-show="selectMap"
            >创建</v-btn
          > -->
        </div>
      </v-card-text>

      <!-- <v-card-text>
        <v-row>
          <v-col :cols="4" class="grey lighten-5">
            <v-list class="grey lighten-5">
              <v-list-item-group color="primary">
                <v-list-item @click="selectCategory = '*'">所有分类</v-list-item>

                <v-list-item
                  @click="selectCategory = category"
                  :key="category"
                  v-for="(category) in categories"
                >
                  <v-list-item-icon v-if="getAvatarName(category)">
                    <v-img width="32" height="32" :src="`/icon/${getAvatarName(category)}.png`"></v-img>
                  </v-list-item-icon>
                  <v-list-item-content>{{category}}</v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col :cols="8">
            <div>
              <v-card
                ripple
                v-for="(map,index) in filterMaps"
                :key="index"
                @click="selectMap = map"
                depressed
                hover
                flat
                outlined
                width="180"
                class="ma-2 float-right"
              >
                <v-card-text
                  :class="selectMap === map?'blue-grey white--text  ':'white black--text'"
                >{{map.label}}</v-card-text>
                <v-img :src="map.cover" height="180"></v-img>
              </v-card>
              <div key="empty-message" class="content-tip" v-show="filterMaps.length ===0">暂无结果</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>-->
    </v-card>
  </v-dialog>
</template>
<script setup>
import _ from "lodash";
import { useMapsStore } from "~~/stores/maps";
import { useUserStore } from "~~/stores/user";
import { useWorksStore } from "~~/stores/works";
const { folder, createMap, createFolder } = useWorksStore();
const { mapCategory: maps } = useMapsStore();
const { push } = useRouter();
const isLoading = ref(false);
const { user } = useUserStore();
const { handlerError, alertProps, clear } = useErrorMessage();
const combineMaps = computed(() => {
  return [
    {
      name: "folder",
      category: 0,
      label: "文件夹",
      icon: "iconfont icon-folder-plus",
      color: ["#FBC02D", "#F0DC00"],
    },
    ...maps,
  ];
});
const categories = () => {
  return _.chain(maps || [])
    .map((map) => {
      return map.category;
    })
    .flattenDeep()
    .uniq()
    .compact()
    .value();
};
const filterMaps = () => {
  var categoryFilter = (map) => {
    return selectCategory === "*" || _.indexOf(map.category, selectCategory) >= 0;
  };

  var keywordFilter = (map) => {
    if (_.isEmpty(searchKeyword)) {
      return true;
    }

    return _.findIndex(map.category || [], (category) => category.indexOf(searchKeyword) >= 0) >= 0;
  };

  return _.chain(maps)
    .filter(_.isEmpty(searchKeyword) ? categoryFilter : keywordFilter)
    .value();
};
const create = async () => {
  // var style = await this.$store.dispatch("style/getPredefine");
  var model = {
    name: fileName.value,
    // style: Parse.Object.extend("style").createWithoutData(style.objectId),
    // raw: map.model,
    folderId: folder.id || 0,
    // isPrivate: isPrivate,
  };

  var newly = null;
  clear();
  isLoading.value = true;

  try {
    if (selectMap.value.category === 0) {
      newly = await createFolder(model, folder.id, handlerError);
    } else {
      model.category = selectMap.value.category;
      newly = await createMap(model, folder.id, handlerError);

      if (newly) {
        push("/map/" + newly.id);
      }
    }

    if (newly) {
      isShowing.value = false;
    }
    //  await this.$store.dispatch("works/create", model);
  } catch (error) {
    // this.$catch(error);
  } finally {
    isLoading.value = false;
  }
};

const fileName = ref("");
const isPrivate = ref(false);
const selectCategory = ref("*");
const searchKeyword = ref(null);
const selectMap = ref(null);
const isShowing = ref(false);

watchEffect(selectCategory, () => {
  selectMap.value = null;
});

watchEffect(isShowing, () => {
  fileName.value = "";
});

watchEffect(searchKeyword, () => {
  if (!_.isEmpty(searchKeyword)) {
    selectCategory = "*";
  }
});

const getAvatarName = (categoryName) => {
  switch (categoryName) {
    case "流程图":
      return "liuchengtu";

    case "脑图":
      return "naotu";

    case "跨职能流程图":
      return "xulietu";

    case "结构":
      return "jiegou";

    case "工程":
      return "gongcheng";

    case "商务":
      return "shangwu";

    case "地面和平面布置图":
      return "dimian";

    case "网络":
      return "wangluo";

    case "软件和数据库":
      return "ruanjian";

    case "常规":
      return "changui";
  }

  return null;
};
const open = () => {
  isShowing.value = true;
};
defineExpose({ open: open });
</script>
<style lang="scss" scoped>
@import "~/assets/settings.scss";

.card {
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px !important;
  &:hover {
    opacity: 0.8;
  }
  &:last-of-type {
    margin-right: 0;
  }

  &.checked {
    outline-width: 4px !important;
    outline-offset: 2px !important;
  }

  .iconfont {
    font-size: 32px;
    color: white;
  }
}
</style>
