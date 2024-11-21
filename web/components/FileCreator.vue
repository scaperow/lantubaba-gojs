<template>
  <v-dialog v-model="isShowing" :persistent="true" max-width="520" scrollable>
    <v-card>
      <v-card-title>
        <h6>创建文件</h6>
        <!-- <v-text-field
          filled
          rounded
          label="搜索"
          v-model="searchKeyword"
          style="max-width:280px;"
          prepend-inner-icon="mdi-search-web"
          hint="搜索可以创建的蓝图"
        ></v-text-field>-->
      </v-card-title>
      <v-divider />
      <v-card-text class="d-flex flex-column justify-start pa-6">
        <v-text-field placeholder="请输入名称" outlined v-model="fileName" :rules="[]" label="名称"></v-text-field>
        <div class="d-flex flex-row justify-center mt-2">

          <!-- <v-hover>
            <template v-slot:default="{ hover }">
              <v-card :outlined="selectMap === 'folder'" width="120" height="120" :elevation="hover ? 6 : 0"
                class="d-flex justify-center flex-column align-center mx-2" @click="selectMap = 'folder'" :style="`
            background: -webkit-linear-gradient(#FDD835, #FBC02D);
        `">
                <v-icon size="48" color="white" class="pa-2" style="solid 2px #c3c3c3;">mdi-folder-plus</v-icon>
                <span class="text-subtitle-2 font-weight-bold white--text">文件夹</span>
              </v-card>
            </template>
          </v-hover> -->
          <v-hover v-for="map in combineMaps" :key="map.id">
            <template v-slot:default="{ hover }">
              <v-card :outlined="selectMap === map" width="120" height="120" :elevation="hover ? 6 : 0" :key="map.name"
                class="d-flex justify-center flex-column align-center mx-2" @click="selectMap = map" :style="`
            background: -webkit-linear-gradient(${map.color[0]}, ${map.color[1]});
        `">
                <v-icon size="48" color="white" class="pa-2" style="solid 2px #c3c3c3;">{{ map.icon }}</v-icon>
                <span class="text-subtitle-2 font-weight-bold white--text">{{
    map.label
}}</span>
              </v-card>
            </template>
          </v-hover>
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
      <v-card-actions class="d-flex flex-grow-1 justify-end py-4">
        <v-btn color="primary" text @click="create" :disabled="!selectMap || !fileName">确定</v-btn>
        <v-btn text @click="isShowing = false">取消</v-btn>
        <!-- <v-btn color="primary" depressed @click="create" v-show="selectMap"
          >创建</v-btn
        > -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from "lodash";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  computed: {
    combineMaps() {
      return [{
        category: 0,
        label: "文件夹",
        icon: "mdi-folder-plus",
        color: ["#FDD835", "#FBC02D"],
      }, ...this.maps];
    },
    ...mapGetters({
      currentFolder: 'works/currentFolder',
      user: "user/user"
    }),
    ...mapState({
      maps: (state) => state.maps.list
    })
    // categories() {
    //   return _.chain(this.maps || [])
    //     .map((map) => {
    //       return map.category;
    //     })
    //     .flattenDeep()
    //     .uniq()
    //     .compact()
    //     .value();
    // },
    // filterMaps() {
    //   var categoryFilter = (map) => {
    //     return (
    //       this.selectCategory === "*" ||
    //       _.indexOf(map.category, this.selectCategory) >= 0
    //     );
    //   };

    //   var keywordFilter = (map) => {
    //     if (_.isEmpty(this.searchKeyword)) {
    //       return true;
    //     }

    //     return (
    //       _.findIndex(
    //         map.category || [],
    //         (category) => category.indexOf(this.searchKeyword) >= 0
    //       ) >= 0
    //     );
    //   };

    //   return _.chain(this.maps)
    //     .filter(_.isEmpty(this.searchKeyword) ? categoryFilter : keywordFilter)
    //     .value();
    // },
  },
  data() {
    return {
      fileName: "",
      isPrivate: false,
      selectCategory: "*",
      searchKeyword: null,
      selectMap: null,
      isShowing: false,
    };
  },
  watch: {
    selectCategory() {
      this.selectMap = null;
    },

    searchKeyword() {
      if (!_.isEmpty(this.searchKeyword)) {
        this.selectCategory = "*";
      }
    },

    isShowing() {
      this.fileName = "";
    }
  },
  methods: {
    ...mapActions({
      createMap: 'works/createMap',
      createFolder: 'works/createFolder'
    }),
    getAvatarName(categoryName) {
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
    },
    open() {
      this.isShowing = true;
    },

    async create() {  // var style = await this.$store.dispatch("style/getPredefine");
      var model = {
        name: this.fileName,
        // style: Parse.Object.extend("style").createWithoutData(style.objectId),
        // raw: map.model,
        parentId: this.currentFolder.id,
        // isPrivate: this.isPrivate,
      };

      var newly = null;



      try {
        if (this.selectMap.category === 0) {
          newly = await this.createFolder(model);
        } else {
          model.category = this.selectMap.category;
          newly = await this.createMap(model);

          if (newly) {
            this.$router.push("/map?id=" + newly.id);
          }
        }

        this.isShowing = false;
        //  await this.$store.dispatch("works/create", model);
      } catch (error) {
        this.$catch(error);
      }
    },
  },
  created() { },
};
</script>
<style lang="scss" scoped>
@import "~/assets/variables.scss";

.v-sheet--outlined {
  outline-color: #1E88E5;
  outline-offset: 2px;
  outline-width: 4px;
  outline-style: solid;
}

.create-modal {
  .container {
    display: flex;
    flex-direction: column;

    .search {
      margin-bottom: 24px;

      // /deep/ .v-text-field {
      //   input[type="text"] {
      //     border-radius: 40px;
      //   }
      // }
    }
  }



  .content {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    padding-top: 0;
    background: $--background-color-base;
    border-radius: 10px;
    padding: 16px;

    .categories {
      width: 120px;

      .item {
        cursor: pointer;
        text-align: left;
        padding: 10px 14px;
        border-radius: 6px;

        &.select {
          background: lighten($--color-primary, 20%);
          color: $--color-white;
        }
      }
    }

    .list {
      height: 460px;
      overflow-y: auto;
      text-align: right;
      flex-grow: 1;
      width: 100%;

      .item {
        overflow: hidden;
        text-align: center;
        width: 80px;
        height: 120px;
        display: inline-block;
        cursor: pointer;
        padding: 12px;
        margin: 6px;
        text-align: center;
        vertical-align: middle;
        line-height: 120px;
        font-size: 16px;
        color: $--color-text-secondary;
        border: solid 1px #f3f3f3;
        transition: all 0.3s;
        // text-shadow: 2px 2px #f3f3f3;
        background: #fff;

        &.select {
          color: $--color-primary;
          box-shadow: 0 0 16px 0 #3333;
        }
      }
    }
  }

  .footer {
    padding: 12px 0;
  }
}
</style>


