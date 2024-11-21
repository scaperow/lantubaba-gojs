<template>
  <v-dialog class="share" width="540" v-model="isOpening">
    <v-card color="grey lighten-4" class="pa-2" v-if="model">
      <v-card-title>分享</v-card-title>
      <v-alert color="error" dark v-if="isPrivate">
        私有文件无法分享，如果要分享，请将此文件设置位公开文件
        <v-btn class="fr mt-2" small outlined @click="setPublic">设置为公开文件</v-btn>
      </v-alert>
      <v-card-text class="shadowed white pa-4">
        <!-- <v-alert
          icon="mdi-shield-lock-outline"
          prominent
          text
          type="primary lighten-2"
        >复制链接并发送给对方, 获取此链接的人都可以查看该文件</v-alert>-->
        <div>
          <v-form ref="form" :disabled="!model.shareWithLink" :model="model">
            <v-switch
              :disabled="isPrivate"
              inset
              color="secondary"
              v-model="model.isShare"
              :label="model.isShare?'点击取消':'点击分享'"
            ></v-switch>

            <v-text-field
              :disabled="!model.isShare ||isPrivate"
              label="分享链接"
              readonly
              filled
              v-model="shareLink"
              rounded
              hide-details
            ></v-text-field>
            <div v-if="model.isShare" class="text-right">
              <v-btn color="grey" text @click.stop="copyToClipboard(shareLink)">复制链接</v-btn>
              <v-btn color="grey " text nuxt :href="shareLink">打开链接</v-btn>
            </div>
            <v-divider class="my-4" />
            <v-switch
              :disabled="isPrivate"
              inset
              v-if="model.isShare"
              color="secondary"
              v-model="model.usePassword"
              label="密码保护"
            ></v-switch>

            <v-text-field
              v-if="model.isShare && model.usePassword "
              :disabled=" isPrivate"
              filled
              :rules="[$validate('isNotEmpty'),$validate('isPassword'),$validate('isLength',{min:4,max:12})]"
              label="访问密码"
              rounded
              v-model="model.password"
            ></v-text-field>
            <div v-if="model.isShare && model.usePassword" class="text-right">
              <v-btn color="grey" :disabled="isPrivate" @click.stop="randomPassword" title text>生成密码</v-btn>
            </div>
          </v-form>
        </div>

        <!-- <v-tabs v-model="tab" grow>
          <v-btn-toggle v-model="tab" rounded color="primary">
            <v-btn :value="0">网页链接</v-btn>
            <v-btn :value="1">网络图片</v-btn>
        </v-btn-toggle>-->
        <!-- <v-tab>
            <v-icon
              :color="model.shareWithLink?'success':'warning'"
              class="mr-2"
              v-html="model.shareWithLink ?'mdi-check-circle-outline':'mdi-close-circle-outline'"
            ></v-icon>网页链接
          </v-tab>
          <v-tab>
            <v-icon
              :color="model.shareWithPicture?'success':'warning'"
              class="mr-2"
              v-html="model.shareWithPicture ?'mdi-check-circle-outline':'mdi-close-circle-outline'"
            ></v-icon>网络图片
        </v-tab>-->
        <!-- <v-tab>
            <v-icon
              :color="model.shareWithMedia?'success':'warning'"
              class="mr-2"
              v-html="model.shareWithMedia ?'mdi-check-circle-outline':'mdi-close-circle-outline'"
            ></v-icon>IFRAME 分享
        </v-tab>-->

        <!-- <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-alert
                icon="mdi-shield-lock-outline"
                prominent
                text
                type="info"
              >复制并下方链接并发送给对方, 获取此链接的人都可以查看该文件</v-alert>
              <div>
                <v-switch
                  inset
                  color="secondary"
                  v-model="model.shareWithLink"
                  label="启用"
                  @change="onSwitchLinkShare"
                ></v-switch>
                <v-form ref="form" :disabled="!model.shareWithLink" :model="model">
                  <v-text-field
                    :disabled="!model.shareWithLink"
                    label="链接地址"
                    readonly
                    filled
                    v-model="shareLink"
                    append-outer-icon="mdi-content-copy"
                    @click:append-outer="copyToClipboard(shareLink)"
                  >
                    <template v-slot:append-outer>
                      <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
                        <template v-slot:activator="{ on }">
                          <v-btn title="生成新链接" text icon v-on="on">
                            <v-icon>mdi-refresh</v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-card-text>
                            <p>点击继续将生成新的链接, 旧链接同时会失效</p>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn color="primary" text @click.stop="createShareLink">继续</v-btn>
                            <v-btn text @click.stop="isCreateShareLink = false">取消</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>

                      <v-btn title="复制链接" text icon @click.stop="copyToClipboard(shareLink)">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                  <v-text-field
                    :disabled="!model.shareWithLink"
                    filled
                    :rules="[$validate('isPassword'),$validate('isLength|isEmpty',{min:4,max:12})]"
                    label="访问密码"
                    v-model="sharePassword"
                    placeholder="如果不设置访问权限, 请留空密码"
                  >
                    <template v-slot:append-outer>
                      <v-btn @click.stop="randomPassword" title="生成一个随机密码" text icon>
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                      <v-btn
                        @click.stop="savePassword"
                        v-if="$refs.form"
                        icon
                        text
                        color="primary"
                        title="保存密码"
                        :disabled="!dirtyPassword"
                      >
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-form>
              </div>
            </v-tab-item>
            <v-tab-item>
              <v-alert
                icon="mdi-shield-lock-outline"
                prominent
                text
                type="info"
              >复制并下方链接并发送给对方, 获取此链接的人都可以查看该文件</v-alert>
              <div>
                <v-switch
                  inset
                  v-model="model.shareWithPicture"
                  label="启用"
                  color="secondary"
                  @change="onSwitchPictureShare"
                ></v-switch>
                <v-text-field
                  :disabled="!model.shareWithPicture"
                  label="链接地址"
                  :value="pictureUrl"
                  readonly
                >
                  <template v-slot:append-outer>
                    <v-btn text icon title="复制地址" @click="copyToClipboard(pictureUrl)">
                      <v-icon class="iconfont icon-copy">mdi-content-copy</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
            </v-tab-item>
            <v-tab-item>
              <v-alert
                icon="mdi-shield-lock-outline"
                prominent
                text
                type="info"
              >您可以通过 iframe 的方式嵌入到第三方网站</v-alert>
              <div>
                <v-switch
                  inset
                  v-model="model.shareWithMedia"
                  label="启用"
                  color="secondary"
                  @change="onSwitchMediaShare"
                ></v-switch>
                <v-row>
                  <v-col>
                    <v-text-field
                      label="宽度"
                      v-model="width"
                      :persistent-hint="true"
                      hint="单位 (px)"
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col>
                    <label></label>
                    <v-text-field
                      label="高度"
                      v-model="height"
                      :persistent-hint="true"
                      hint="单位 (px)"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-textarea type="textarea" filled :rows="5" readonly :value="shareMedia">
                  <template v-slot:append-outer>
                    <v-btn text icon title="复制地址" @click="copyToClipboard(shareMedia)">
                      <v-icon class="iconfont icon-copy">mdi-content-copy</v-icon>
                    </v-btn>
                  </template>
                </v-textarea>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
      <v-card-actions class="d-flex flex-column align-end py-4">
        <v-btn text @click="isOpening = false">取消</v-btn>
        <v-btn color="primary" depressed rounded @click="isOpening = false">关闭</v-btn>
        </v-card-actions>-->
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between">
        <v-btn text @click="isOpening = false">关闭</v-btn>
        <v-btn color="primary" depressed rounded @click="save" :disabled="isPrivate">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import NanoId from "nanoid";
import _ from 'lodash'

// const ShareClass = Parse.Object.extend("share");
// const WorksClass = Parse.Object.extend("works");
const { NUXT_ENV_SITE_DOMAIN } = process.env;
const copyToClipboard = function(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

export default {
  computed: {
    shareLink() {
      if (this.model) {
        return `${NUXT_ENV_SITE_DOMAIN}/#/visit/?id=${this.model.source}`;
      }

      return null;
    },
    shareMedia() {
      return `<iframe  frameborder="0" style="display:block;width:${this.width}px; height:${this.height}px;" src="${this.shareLink}"></iframe>`;
    }
  },
  data() {
    return {
      model: null,
      tab: null,
      object: null,
      worksId: null,
      isOpening: false,
      isLoading: false,
      width: 500,
      height: 500,
      isPrivate: false
    };
  },
  watch: {
    object() {
      if (this.object) {
        this.model = this.object.toJSON();
      } else {
        this.model = null;
      }
    }
  },
  methods: {
    async open(id) {
      // var shareQuery = new Parse.Query(ShareClass);
      // this.worksId = id;
      // this.isOpening = true;
      // this.isLoading = true;

      // try {
      //   var works = await new Parse.Query(WorksClass).get(id);
      //   if (_.isEmpty(works)) {
      //     this.$overlay.alert("该文件不存在");
      //     this.isOpening = false;
      //   } else {
      //     this.isPrivate = works.get("isPrivate") === true;
      //     this.object =
      //       (await shareQuery.equalTo("source", id).first()) ||
      //       Parse.Object.fromJSON({
      //         className: "share",
      //         isShare: false,
      //         usePassword: false,
      //         source: id
      //       });
      //   }

        // if (this.shareObject) {
        //   this.model = this.shareObject.toJSON();
        // } else {
        //   this.model = _.defaults(this.model, {
        //     password: null,
        //     width: 500,
        //     height: 500
        //   });
        // }

        // this.sharePassword = this.model.password;

        // this.usePassword = !_.isEmpty(this.model.password);
        // this.width = this.model.width || 500;
        // this.height = this.model.height || 500;
      // } catch (error) {
      //   this.$catch(error)
      //   //this.$overlay.message.error(message);
      //   this.isOpening = false;
      // }

      // this.isLoading = false;
    },
    randomPassword() {
      this.model.password = NanoId(6);
    },
    copyToClipboard(text) {
      copyToClipboard(text);

      this.$overlay.message.success("已复制到剪切板");
    },
    async save() {
      if (this.$refs.form.validate()) {
        try {
          await this.object.save(this.model);

          await this.$store.dispatch("works/update", {
            id: this.worksId,
            share: this.object
          });

          this.isOpening = false;
        } catch (error) {
          this.$catch(error);
        }
      }
    },
    async setPublic() {
      try {
        await this.$store.dispatch("works/update", {
          id: this.worksId,
          isPrivate: false
        });

        this.isPrivate = false;
        this.$overlay.message.success('已保存')
      } catch (error) {
        this.$catch(error);
      }
    }
  }
};
</script>




