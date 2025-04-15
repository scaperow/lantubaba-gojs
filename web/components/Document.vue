<template>
  <v-hover>
    <template v-slot:default="{hover}">
      <v-card
        width="180"
        color="grey lighten-4"
        flat
        class="ma-4 animated"
        :class="hover?'shadowed':''"
      >
        <v-badge overlap color="orange"  style="width:180px">
          <template v-slot:badge v-if="model.isShare === true">
            <v-tooltip bottom>
              <template v-slot:activator="{on:tip}">
                <v-icon color="white" v-on="tip" @click.stop="$emit('share')">mdi-share-variant</v-icon>
              </template>
              <label>已分享</label>
            </v-tooltip>
          </template>
          <v-img
            v-if="model.isDelete === true"
            class="document grey lighten-4"
            :src="model | thumbnail"
            :alt="model.name"
            fit="contain"
            :width="180"
            :height="180"
          >
            <v-fade-transition>
              <!-- <v-menu>
                <template v-slot:activator="{on}"> -->
                  <v-overlay v-if="hover" absolute>
                    <v-btn outlined text block @click.stop="$emit('remove_forever')">彻底删除</v-btn>
                    <v-btn outlined text block @click.stop="$emit('recovery')">还原</v-btn>
                  </v-overlay>

                  <v-overlay v-else absolute class="text-center">
                    <v-icon size="32">mdi-trash-can-outline</v-icon>
                    <label>已删除</label>
                  </v-overlay>
                <!-- </template> -->
                <!-- <v-card>
                  <v-card-text>删除后无法恢复，是否继续?</v-card-text>
                  <v-card-actions class="d-flex justify-space-between">
                    <v-btn text>取消</v-btn>
                    <v-btn @click.stop="$emit('remove_forever')" text color="primary">继续删除</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu> -->
            </v-fade-transition>
          </v-img>

          <v-img
            v-else
            class="document grey lighten-4 animated"
            v-ripple
            :src="cover"
            :alt="model.name"
            fit="contain"
            :width="180"
            :height="180"
            @click.prevent="$emit('open')"
          ></v-img>

          <v-card-actions class="d-flex justify-space-between align-center" style="font-size:14px">
            <label
              class="flex-grow-1"
              :title="model.name"
              style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;"
            >{{model.name}}</label>
            <div style="min-width:80px" v-if="!model.isDelete">
              <v-tooltip bottom>
                <template v-slot:activator="{on}">
                  <v-btn icon v-on="on" @click.stop="$emit('change_accessibility')">
                    <v-icon :size="16">{{model.isPrivate?'mdi-lock':'mdi-lock-open-variant'}}</v-icon>
                  </v-btn>
                </template>
                {{model.isPrivate?'设为公开文件':'设为私有文件'}}
              </v-tooltip>
              <v-menu offset-y v-if="model.isDelete !== true">
                <template v-slot:activator="{ on }">
                  <v-btn small text icon v-on="on">
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="$emit('rename')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-file-document-edit-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>重命名</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="$emit('remove')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-file-document-box-remove-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>删除</v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="$emit('copy')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-content-copy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>复制</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="$emit('copy_to')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-content-duplicate</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>复制到</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="$emit('move_to')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-file-move-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>移动到</v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item @click="$emit('change_accessibility')">
                    <v-list-item-icon>
                      <v-icon
                        class="colorful"
                      >{{model.isPrivate?'mdi-lock-open-variant-outline':'mdi-lock-outline'}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>{{model.isPrivate?'设置公开':'设置私有'}}</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="$emit('share')">
                    <v-list-item-icon>
                      <v-icon class="colorful">mdi-share</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>分享</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-card-actions>
        </v-badge>
      </v-card>
    </template>
  </v-hover>
</template>
<script>
const ossUrl = process.env.NUXT_ENV_OSS_URL;
import { mapGetters } from "vuex";
export default {
  props: {
    model: {
      required: true
    }
  },
  computed: {
    ...mapGetters({
      user: "user/user"
    }),
    cover() {
      if (this.user && this.model) {
        return `${ossUrl}/users/${this.user.objectId}/map/${this.model.objectId}?x-oss-process=style/thumbnail`;
      }

      return "";
    }
  }
};
</script>
