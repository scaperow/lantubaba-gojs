<template>
  <section class="d-flex flex-column flex-grow-1">
    <hair :dark="false" :only-logo="true">
      <div class="d-flex flex-row align-center">
        <div v-if="model" class="d-flex flex-column align-center mr-8" style="min-width:100px">
          <label>《{{model && model.name}}》</label>
          <div>
            <v-icon title="作者">mdi-account-circle</v-icon>
            <label class="grey--text">{{model.user.nick || model.user.username || model.user.email}}</label>
          </div>
        </div>
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{on}">
            <v-btn tile text v-on="on">
              <v-icon class="colorful">mdi-share-variant</v-icon>
              <label>分享</label>
            </v-btn>
          </template>
          <v-card width="420" class="py-4" min-width="500" color="grey lighten-4 ">
            <v-card-title>
              <div style="text-align:center">
                <v-btn-toggle rounded v-model="shareWith" color="primary">
                  <v-btn value="LINK">
                    <v-icon class="colorful">mdi-link-box</v-icon>链接
                  </v-btn>
                  <v-btn value="CODE">
                    <v-icon class="colorful">mdi-qrcode</v-icon>二维码
                  </v-btn>
                  <v-btn value="OTHER">
                    <v-icon class="colorful">mdi-open-in-app</v-icon>社交网络
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-card-title>

            <v-card-text>
              <div v-show="shareWith === 'CODE'">
                <v-alert dense color="transparent">扫描二维码发送给指定的人</v-alert>
                <div class="text-center">
                  <qr-code :value="url" size="200" level="H"></qr-code>
                </div>
                <v-img></v-img>
              </div>
              <div v-show="shareWith === 'LINK'">
                <v-alert dense color="transparent">复制网页链接发送给指定的人</v-alert>
                <v-text-field
                  rounded
                  solo
                  hide-details
                  append-outer-icon="mdi-content-copy"
                  @click:append-outer="copy(url)"
                  :value="url"
                  readonly
                >复制</v-text-field>
              </div>
              <div v-show="shareWith === 'OTHER'">
                <social-sharing
                  v-if="model"
                  :url="url"
                  :title="`蓝图巴巴-《${model.name}》`"
                  description="蓝图巴巴-免费使用海量作图,uml,脑图,流程图,思维导图,序列图等等，统统搞定"
                  quote="蓝图巴巴-免费使用海量作图"
                  hashtags="uml,脑图,流程图,思维导图,序列图"
                  twitter-user="蓝图巴巴"
                  inline-template
                >
                  <v-row align="center" justify="center" no-gutters class="my-4">
                    <v-col class="text-center" :cols="3" align-self="center" v-ripple>
                      <network network="email">
                        <v-icon size="48" color="white">mdi-email</v-icon>
                      </network>
                      <div>邮箱</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="facebook">
                        <v-icon size="48" color="blue">mdi-facebook-box</v-icon>
                      </network>
                      <div>Facebook</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="googleplus">
                        <v-icon size="48" color="red">mdi-google-plus</v-icon>
                      </network>
                      <div>Google+</div>
                    </v-col>
                    <!-- <network network="line">
                      <v-col class="text-center" :cols="3">
                        <v-icon color="red">mdi-google-plus</v-icon>
                        <div>Google+</div>
                      </div>
                    </network>-->
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="linkedin">
                        <v-icon size="48" color="blue">mdi-linkedin-box</v-icon>
                      </network>
                      <div>LinkedIn</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="pinterest">
                        <v-icon size="48" color="red">mdi-pinterest-box</v-icon>
                      </network>
                      <div>Pinterest</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="reddit">
                        <v-icon size="48" color="white">mdi-reddit</v-icon>
                      </network>
                      <div>Reddit</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="skype">
                        <v-icon size="48" color="blue lighten-2">mdi-skype</v-icon>
                      </network>
                      <div>Skype</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="twitter">
                        <v-icon size="48" color="blue lighten-4">mdi-twitter</v-icon>
                      </network>
                      <div>Twitter</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="weibo">
                        <v-icon size="48" color="orange">mdi-sina-weibo</v-icon>
                      </network>
                      <div>微博</div>
                    </v-col>
                    <v-col class="text-center" :cols="3" v-ripple>
                      <network network="whatsapp">
                        <v-icon size="48" color="green lighten-2">mdi-whatsapp</v-icon>
                      </network>
                      <div>Whatsapp</div>
                    </v-col>
                  </v-row>
                </social-sharing>
              </div>
            </v-card-text>
            <!-- <div class="pa-2">用户评论({{commentsCount}})</div>

            <v-card-actions class="d-flex justify-space-between align-center">
              <div>
                <v-btn rounded color="primary" depressed @click="comment">提交评论</v-btn>
                <v-btn rounded text @click="showComments = false">关闭</v-btn>
              </div>
            </v-card-actions>-->
          </v-card>
        </v-menu>

        <v-btn tile text @click="favorite" :outlined="favoriteObject">
          <v-icon class="colorful">mdi-star</v-icon>收藏
        </v-btn>

        <v-btn tile text @click="like" :outlined="likeObject">
          <v-badge value="20">
            <v-icon class="colorful" color="info">mdi-thumb-up</v-icon>
          </v-badge>
          {{likes}}
        </v-btn>

        <v-menu offset-y :close-on-content-click="false" v-model="showComments">
          <template v-slot:activator="{on}">
            <v-btn tile text v-on="on">
              <v-icon class="colorful">mdi-comment-text</v-icon>
              {{commentsCount}}
            </v-btn>
          </template>
          <v-card class="py-4" min-width="500" color="grey lighten-4">
            <div class="pa-2">用户评论({{commentsCount}})</div>

            <v-list
              style="max-height:600px; overflow-y:auto"
              ref="commentList"
              color="grey lighten-4"
            >
              <template v-for="comment in comments">
                <v-list-item :key="comment.objectId" class="white mt-1">
                  <v-list-item-avatar>
                    <v-img :src="comment.user.avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content v-if="user && comment.user">
                    <v-list-item-subtitle
                      v-if="  comment.user.objectId !== user.objectId"
                    >{{comment.user.nike || comment.user.name || comment.user.email}}</v-list-item-subtitle>
                    <v-list-item-subtitle v-else>
                      <v-chip small v-if="comment.user.objectId === user.objectId">我</v-chip>
                      <v-chip
                        color="primary"
                        small
                        v-else-if="comment.user.objectId === model.user.objectId"
                      >作者</v-chip>
                      <label>{{comment.createdAt | ago}}</label>
                    </v-list-item-subtitle>
                    <p class="my-2">{{comment.content}}</p>
                  </v-list-item-content>
                </v-list-item>

                <!-- <v-divider :key="'l'+ comment.objectId" inset></v-divider> -->
              </template>
              <more
                class="d-flex flex-grow-1 flex-row justify-center my-4"
                :target="scrollTarget"
                @start="fetchComment"
                :total="commentsCount"
                :index="comments.length"
              ></more>
            </v-list>

            <v-card-actions class="d-flex justify-space-between align-center">
              <v-textarea
                hide-details
                rows="3"
                background-color="white"
                label="请输入评论内容"
                outlined
                class="animated faster ma-4"
                v-model="content"
              ></v-textarea>
              <div>
                <v-btn rounded color="primary" depressed @click="comment">提交评论</v-btn>
                <v-btn rounded text @click="showComments = false">关闭</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </hair>

    <div class="grey lighten-2 d-flex flex-column flex-grow-1 pa-2">
      <div id="maper" style="width:100%" class="flex-grow-1"></div>
    </div>
  </section>
</template>

<script>
import SocialSharing from "vue-social-sharing";
import QrCode from "qrcode.vue";
import { mapGetters } from "vuex";
import More from "../components/More";
import _ from "lodash";
import Hair from "../components/Hair";
const LikeClass = Parse.Object.extend("like");
const CommentClass = Parse.Object.extend("comment");
const FavoriteClass = Parse.Object.extend("favorite");

function copyToClipboard(text) {
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
}

export default {
  computed: {
    ...mapGetters({
      userObject: "user/object",
      user: "user/user"
    }),
    fileName() {
      return (this.mapData && this.mapData.name) || "";
    },
    url() {
      return window.location.href;
    }
  },
  data() {
    return {
      shareWith: "LINK",
      scrollTarget: null,
      showComments: false,
      content: "",
      drawerId: "maper",
      zoomScale: 100,
      statusMessage: "",
      object: null,
      model: null,
      likes: 0,
      comments: [],
      commentsCount: 0,
      likeObject: null,
      favoriteObject: null,
      lastScrollPosition: null,
      commentIndex: 0,
      commentSize: 20
    };
  },
  components: {
    Hair,
    More,
    QrCode,
    SocialSharing
  },
  watch: {
    showComments() {
      this.$nextTick(() => {
        this.scrollTarget = this.$refs.commentList.$el;
      });
    }
  },
  methods: {
    copy(text) {
      try {
        copyToClipboard(text);
        this.$overlay.message.success("已复制");
      } catch (error) {
        this.$catch(error);
      }
    },
    async favorite() {
      if (this.favoriteObject) {
        try {
          await this.favoriteObject.destroy();
        } catch (error) {
          this.$catch(error);
        } finally {
          this.favoriteObject = null;
        }
      } else {
        try {
          this.favoriteObject = new FavoriteClass();

          await this.favoriteObject.save({
            user: this.userObject,
            works: this.object
          });
        } catch (error) {
          this.$catch(error);
        }
      }
    },
    async comment() {
      var content = _.trim(this.content);
      if (_.isEmpty(content)) {
        return this.$overlay.message.info("请输入评论内容");
      }

      if (content.length > 500) {
        return this.$overlay.message.info("评论内容不能超过500字");
      }

      var comment = new CommentClass();
      comment.set("user", this.userObject);
      comment.set("works", this.object);
      comment.set("content", this.content);

      try {
        await comment.save();

        this.content = null;
        this.comments.splice(0, 0, comment.toJSON());

        this.$nextTick(() => {
          this.$refs.commentList.$el.scrollTo(0, 0);
        });
      } catch (error) {
        this.$catch(error);
      }
    },
    async like() {
      if (_.isEmpty(this.likeObject)) {
        var like = new LikeClass();
        like.set("user", this.userObject);
        like.set("works", this.object);

        try {
          await like.save();
          this.likeObject = like;
          this.likes += 1;
        } catch (error) {
          this.$catch(error);
        }
      } else {
        try {
          await this.likeObject.destroy();
          this.likeObject = null;
          this.likes -= 1;
        } catch (error) {
          this.$catch(error);
        }
      }
    },
    async fetchComment({ reject, resolve } = {}) {
      try {
        var comments = await new Parse.Query(CommentClass)
          .equalTo("works", this.object)
          .include("user")
          .addDescending("createdAt")
          .withCount()
          .skip(this.commentIndex * this.commentSize)
          .limit(this.commentSize)
          .find();

        this.commentIndex += 1;
        this.comments = _.union(
          _.map(comments.results, c => c.toJSON()),
          this.comments
        );
        this.commentsCount = comments.count;

        if (this.commentsCount <= this.comments.length) {
          reject && reject();
        } else {
          resolve && resolve();
        }
      } catch (error) {
        this.$catch(error);
      }
    }
  },
  async created() {
    try {
      this.object = await Parse.Cloud.run("visit", {
        id: this.$route.query.id
      });
      this.model = this.object.toJSON();
      this.maper = await this.$store.dispatch("go/createMap", this.model);
      this.maper.mount(this.drawerId, this.model.raw);
      this.maper.setReadonly(true);

      this.likes = await new Parse.Query(LikeClass)
        .equalTo("works", this.object)
        .count();

      this.likeObject = await new Parse.Query(LikeClass)
        .equalTo("works", this.object)
        .equalTo("user", this.userObject)
        .first();

      this.favoriteObject = await new Parse.Query(FavoriteClass)
        .equalTo("works", this.object)
        .equalTo("user", this.userObject)
        .first();

      this.fetchComment();
    } catch (error) {
      if (
        await this.$overlay.confirm({
          text: error.message,
          actions: {
            true: "关闭"
          }
        })
      ) {
        if (this.user) {
          this.$router.push({
            name: "desktop"
          });
        } else {
          this.$router.push({
            name: "desktop"
          });
        }
      }
    }
  }
};
</script>
