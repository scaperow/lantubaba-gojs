<template>
  <v-hover>
    <template v-slot:default="{ props, isHovering }">
      <v-card variant="outlined" @click="emitter('open')" width="182" class="ma-2" color="grey-lighten-2 bg-white" v-bind="props" >
        <!-- <v-badge overlap color="orange" style="width: 180px">
          <template v-slot:badge v-if="model.isShare === true">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tip }">
                <v-icon color="white" v-on="tip" @click.stop="emitter('share')"
                  >mdi-share-variant</v-icon
                >
              </template>
              <label>已分享</label>
            </v-tooltip>
          </template> -->
        <v-img v-if="model.isDelete === true" class="document grey lighten-4" :alt="model.name" fit="contain" :width="180" :height="180">
          <v-fade-transition>
            <!-- <v-menu>
                <template v-slot:activator="{on}"> -->
            <v-overlay v-if="isHovering" absolute>
              <v-btn outlined text block @click.stop="emitter('remove_forever')">彻底删除</v-btn>
              <v-btn outlined text block @click.stop="emitter('recovery')">还原</v-btn>
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
                    <v-btn @click.stop="emitter('remove_forever')" text color="primary">继续删除</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu> -->
          </v-fade-transition>
        </v-img>

        <v-img v-else class="document grey lighten-4 animated" v-ripple :alt="model.name" fit="contain" :width="180" :height="180" @click.prevent="emitter('open')"></v-img>

        <v-card-actions class="d-flex justify-space-between align-center">
          <h6 class="flex-grow-1 text-black" :title="model.name" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap">{{ model.name }}</h6>
          <div v-if="!model.isDelete">
            <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                    @click.stop="emitter('change_accessibility')"
                  >
                    <v-icon :size="16">{{
                      model.isPrivate ? "mdi-lock" : "mdi-lock-open-variant"
                    }}</v-icon>
                  </v-btn>
                </template>
                {{ model.isPrivate ? "设为公开文件" : "设为私有文件" }}
              </v-tooltip> -->
            <v-btn icon small @click.stop="emitter('check')" style="position: absolute; top: 3px; left: 3px" v-show="isHovering || model.checked">
              <v-icon size="24" :color="model.checked ? 'primary' : ''">mdi-check-circle</v-icon>
            </v-btn>
            <v-menu offset-y v-if="model.isDelete !== true" content-class="overlay">
              <template v-slot:activator="{ props, isActive }">
                <v-btn  size="small" variant="tonal" color="grey"  style="position: absolute; top: 12px; right: 12px" small v-bind="props" v-show="isHovering || isActive">
                  <v-icon size="20">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list elevation="0">
                <v-list-item prepend-icon="mdi-file-document-edit-outline" @click="emitter('rename')"><v-list-item-subtitle>重命名</v-list-item-subtitle> </v-list-item>
                <v-list-item prepend-icon="mdi-close-outline" @click="emitter('remove')"><v-list-item-subtitle>删除</v-list-item-subtitle> </v-list-item>
                <v-list-item prepend-icon="mdi-content-copy" @click="emitter('copy')"> <v-list-item-subtitle>复制</v-list-item-subtitle></v-list-item>
                <v-list-item prepend-icon="mdi-content-duplicate" @click="emitter('copy_to')"> <v-list-item-subtitle>复制到</v-list-item-subtitle></v-list-item>
                <v-list-item prepend-icon="mdi-file-move-outline" @click="emitter('move_to')"><v-list-item-subtitle>移动到</v-list-item-subtitle> </v-list-item>
                <!-- <v-list-item :title="model.isPrivate ? '设置公开' : '设置私有'" :prepend-icon="model.isPrivate ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'" @click="emitter('change_accessibility')"><v-list-item-subtitle>重命名</v-list-item-subtitle> </v-list-item> -->
                <!-- <v-list-item title="分享" prepend-icon="mdi-share" @click="emitter('share')"> </v-list-item> -->
              </v-list>
            </v-menu>
          </div>
        </v-card-actions>
        <!-- </v-badge> -->
      </v-card>
    </template>
  </v-hover>
</template>
<script setup>
// const ossUrl = process.env.NUXT_ENV_OSS_URL;
// import { mapGetters } from "vuex";

const emitter = defineEmits(["check", "open", "rename", "remove", "share", "remove_forever", "recovery", "move_to", "copy_to", "copy", "change_accessibility"]);

defineProps({
  model: {
    required: true,
  },
});

const onCheck = () => {
  emitter("check");
};
// export default {
//   props: {
//     model: {
//       required: true,
//     },
//   },
//   methods: {
//     onCheck() {},
//   },
//   computed: {
//     ...mapGetters({
//       user: "user/user",
//     }),
//     cover() {
//       if (this.user && this.model) {
//         return `${ossUrl}/users/${this.user.objectId}/map/${this.model.objectId}?x-oss-process=style/thumbnail`;
//       }

//       return "";
//     },
//   },
// };
</script>
<style lang="less" scoped>
.v-card-actions {
  min-height: unset !important;
}
</style>