<template>
  <section class="recycle d-flex flex-grow-1 flex-column">
    <div class="mx-4 d-flex align-space-between">
      <v-btn outlined rounded color="primary" @click="clearRecycle">
        <v-icon class="colorful">mdi-delete-forever</v-icon>全部删除
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <file-list
      :show-breadcrumbs="false"
      :allow-create-folder="false"
      root-name="回收站"
      ref="fileList"
    >
      <template v-slot:card="{model}">
        <v-hover v-slot="{hover}">
          <v-card
            v-if="model && model.works"
            width="200"
            color="grey lighten-4"
            flat
            class="ma-4 animated"
            :class="hover?'shadowed':''"
          >
            <v-img
              class="document grey lighten-4 animated"
              v-ripple
              :alt="model.works.name"
              fit="contain"
              :width="200"
              :height="180"
              @click.prevent="open(model.works.objectId)"
            ></v-img>

            <v-card-actions style="font-size:14px">
              <div
                style="min-height:85px"
                class="d-flex flex-column justify-space-between flex-grow-1 align-space-around"
              >
                <div class="d-flex flex-row align-space-between">
                  <div
                    class="flex-grow-1 d-flex flex-column"
                    style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
                  >
                    <label :title="model.works.name">{{model.works.name}}</label>
                    <i
                      :title="model.works.user.nickname || model.works.user.username"
                    >{{model.works.user.nickname || model.works.user.username}}</i>
                  </div>
                  <v-avatar size="32">
                    <v-img :src="model.works.user.avatar"></v-img>
                  </v-avatar>
                </div>
                <!-- <div class="flex-grow-0">
                  <label>{{model.works.user.nickname || model.works.user.username}}</label>
                </div>-->
                <v-divider />
                <div class="d-flex flex-row align-space-around justify-center">
                  <v-btn small icon title="新窗口打开" @click.prevent="open(model.works.objectId)">
                    <v-icon small>mdi-open-in-new</v-icon>
                  </v-btn>
                  <v-btn small icon title="分享">
                    <v-icon small>mdi-share-variant</v-icon>
                  </v-btn>
                  <v-menu>
                    <template v-slot:activator="{on}">
                      <v-btn small icon title="取消收藏" v-on="on">
                        <v-icon small>mdi-cancel</v-icon>
                      </v-btn>
                    </template>
                    <v-card min-width="260">
                      <v-card-text>是否取消收藏</v-card-text>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn text small color="primary" @click="remove(model.works.objectId)">是</v-btn>
                        <v-btn text small>否</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </div>
              </div>
            </v-card-actions>
          </v-card>
        </v-hover>
      </template>
      <template slot="foot">
        <more ref="loader" @start="fetch"></more>
      </template>
    </file-list>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import FileList from "~/components/FileList";
import More from "../../components/More";
import Parse from "parse";
const ossUrl = process.env.NUXT_ENV_OSS_URL;

export default {
  computed: {
    ...mapGetters({
      user: "user/user",
      list: "works/list",
      count: "works/count"
    })
  },
  filters: {
    cover(works) {
      return `${ossUrl}/users/${works.user.objectId}/map/${works.objectId}?x-oss-process=style/thumbnail`;
    }
  },
  components: {
    FileList,
    More
  },
  data() {
    return { index: 0, size: 20 };
  },
  watch: {},
  methods: {
    async remove(favoriteId) {
      try {
        await this.$store.dispatch("works/favorite", {
          id: favoriteId,
          isFavorite: false
        });
      } catch (error) {
        this.$catch(error);
      }
    },
    async clearRecycle() {
      try {
        await this.$overlay.confirm({
          text: "永久删除回收站中的文件，且无法恢复，是否继续?"
        });

        this.$store.dispatch("works/clearRecycle");
      } catch (error) {
        console.error(error);
      }
    },
    async fetch({ resolve, reject } = {}) {
      try {
        await this.$store.dispatch("works/getFavoriteList", {
          index: this.index++,
          size: this.size
        });
        if (this.list.length >= this.count) {
          reject && reject();
        } else {
          resolve && resolve();
        }
      } catch (error) {
        this.$catch(error);
      }
    },
    open(worksId) {
      let { href } = this.$router.resolve({
        name: "visit",
        query: {
          id: worksId
        }
      });
      window.open(href, "_blank");
      // this.$router.push({
      //   name: "visit",
      //   params: {
      //     id: worksId
      //   }
      // });
    }
  }
};
</script>


