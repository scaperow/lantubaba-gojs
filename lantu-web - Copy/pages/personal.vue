<template>
  <div class="primary d-flex flex-column justify-space-between align-stretch flex-grow-1">
    <div class="d-flex flex-row justify-start align-start pa-6">
      <div class="logo white--text">蓝图巴巴</div>
    </div>
    <div class="d-flex flex-grow-1 flex-column justify-center align-center">
      <v-card v-if="user" width="720" class="pa-12 pt-12" style="border-radius:16px">
        <v-card-title class="d-flex flex-row justify-center">
          <div style="position: absolute;top: -92px;width: 100%;text-align: center;">
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-avatar color="info" size="140">
                  <img v-if="user && user.avatar" class="avatar" :src="user.avatar" />
                  <v-icon v-else color="white">mdi-account mdi-48px</v-icon>

                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="primary">
                      <v-btn text @click="changeAvatar">修改头像</v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-avatar>
              </template>
            </v-hover>
          </div>
          <v-btn-toggle rounded v-model="tab" color="primary" group>
            <v-btn value="BASIC">基本信息</v-btn>
            <v-btn value="PASSWORD">修改密码</v-btn>
            <!-- <v-btn value="ORDER">我的订单</v-btn> -->
          </v-btn-toggle>
        </v-card-title>

        <v-card-text class="pt-6" transition="scale-transition">
          <div class="panel animated fadeIn" v-show="tab === 'BASIC'">
            <v-content>
              <v-form ref="basicForm" @submit.prevent="saveBasic">
                <v-text-field
                  filled
                  label="用户名"
                  :rules="[$validate('isNotEmpty'),$validate('isAlphanumeric'),$validate('isLength',{min:3,max:24})]"
                  v-model="user.username"
                ></v-text-field>

                <v-text-field
                  filled
                  label="昵称"
                  :rules="[$validate('isCommonName'),$validate('isEmpty|isLength:长度应小于24, 大于 3',{min:3,max:24})]"
                  v-model="user.nick"
                ></v-text-field>
                <!-- 
                <v-text-field v-model="mineModel.nick"
                :rules="userNameValidators"></v-text-field>-->

                <v-text-field
                  filled
                  label="邮箱"
                  v-model="user.email"
                  :rules="[$validate('isNotEmpty'),$validate('isEmail')]"
                ></v-text-field>
                <!-- <span class="tab"
                      success
                      v-if="mineModel.emailVerified === true">
                  已激活
                </span>
                <span class="tab"
                      @click="verifyEmail"
                warning>未激活</span>-->
                <div class="d-flex flex-row justify-end">
                  <v-btn
                    type="submit"
                    rounded
                    depressed
                    color="secondary"
                    v-show="tab ==='BASIC'"
                    :loading="isSavingBasic"
                  >保存</v-btn>
                </div>
              </v-form>
            </v-content>
          </div>
          <div class="panel animated fadeIn" v-show="tab === 'PASSWORD'">
            <div>
              <v-alert text :type="isPasswordSuccess?'success':'info'">
                <p v-if="isPasswordSuccess">发送成功, 请到您的邮箱({{user.email}})中查收修改密码的链接</p>
                <p v-else>安全起见, 只能通过授权链接来修改密码, 点击下方按钮, 将授权链接发送到您的邮箱({{user.email}})</p>
                <div class="text-center">
                  <v-btn text @click="changePassword" color="primary">
                    <span v-if="isPasswordSuccess">重新发送</span>
                    <span v-else>发送修改密码链接</span>
                  </v-btn>
                </div>
              </v-alert>

              <!-- <v-form class="password"
                      @submit.prevent="changePassword"
                      ref="passwordForm">
                <v-text-field filled
                              type="password"
                              label="当前密码"
                              placeholder="请输入当前密码"
                              :rules="[$validate('isPassword'),$validate('isNotEmpty'),$validate('isLength',{min:6,max:24})]"
                              v-model="currentPassword"></v-text-field>
                <v-text-field filled
                              label="新密码"
                              type="password"
                              placeholder="请输入新密码"
                              :rules="[$validate('isPassword'),$validate('isNotEmpty'),$validate('isLength',{min:6,max:24})]"
                              v-model="newPassword"></v-text-field>
                <v-text-field filled
                              type="password"
                              label="重复新密码"
                              placeholder="请再次输入新密码"
                              :rules="[$validate('isPassword'),$validate('isNotEmpty'),$validate('isEqual:两次密码不一致', { value: this.newPassword })]"
                              v-model="retryPassword"></v-text-field>

                <div class="d-flex flex-row-reverse">
                  <v-btn type="submit"
                         color="primary"
                         text
                         rounded
                         large
                         :loading="isChangingPassword">保存</v-btn>
                </div>
              </v-form>-->
            </div>
          </div>

          <div class="panel animated fadeIn" v-show="tab === 'ORDER'">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">订单编号</th>
                    <th class="text-left">购买内容</th>
                    <th class="text-left">支付金额</th>
                    <th class="text-left">支付时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in orders" :key="order.objectId">
                    <td>{{ order.number }}</td>
                    <td>{{ order.name }}</td>
                    <td>{{ order.price }}</td>
                    <td>{{ order.updatedAt|date('%Y-%m-%d %T') }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="d-flex flex-row justify-space-between">
          <v-btn text @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>返回
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <picture-selector ref="pictureSelector" :on-save="saveAvatar" :loading="isSavingAvatar"></picture-selector>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import PictureSelector from "~/components/Picture.vue";
import Parse from "parse";
import Validators from "~/utils/validators";

export default {
  computed: {
    ...mapGetters({
      user: "user/user",
      orders: "user/orders"
    })
  },
  data() {
    return {
      tab: _.toUpper(this.$route.query.action || "basic"),
      currentPassword: null,
      newPassword: null,
      retryPassword: null,
      showUserSetting: false,
      isSavingBasic: false,
      isChangingPassword: false,
      isPasswordSuccess: false,
      isSavingAvatar: false
    };
  },
  components: {
    PictureSelector
  },
  watch: {
    tab: {
      handler() {
        switch (this.tab) {
          case "ORDER":
            this.$store.dispatch("user/getOrder");
        }
      },
      immediate: true
    }
  },
  methods: {
    async changeAvatar() {
      this.$refs.pictureSelector.open();
    },
    async saveBasic() {
      var isSuccess = false;
      var mine = Parse.User.current();

      this.isSavingBasic = true;

      if (this.$refs.basicForm.validate()) {
        mine.set("email", this.user.email);
        mine.set("username", this.user.username);
        mine.set("nick", this.user.nick);

        try {
          await mine.save();
          await this.$store.dispatch("user/getUser");

          this.$overlay.message.success("已保存");
        } catch (error) {
          this.$catch(error);
        }
      }

      this.isSavingBasic = false;
    },
    async changePassword() {
      var mine = Parse.User.current();

      try {
        await Parse.User.requestPasswordReset(mine.get("email"));
        if (this.isPasswordSuccess === true) {
          this.$overlay.message.success("已发送");
        } else {
          this.isPasswordSuccess = true;
        }
      } catch (error) {
        this.$catch(error);
      }

      // if (this.$refs.passwordForm.validate()) {

      //   try {
      //     await Parse.Cloud.run('changePassword', {
      //       current: this.currentPassword,
      //       password: this.newPassword
      //     })

      //     this.$store.dispatch('user/getUser')
      //     this.$overlay.message.success('已保存')

      //   } catch (error) {
      //     this.$catch(error)
      //   }
      // }

      // this.isSavingBasic = false
    },
    async saveAvatar({ blob, canvas }) {
      var dataUrl = canvas.toDataURL("image/jpeg");
      var mine = Parse.User.current();

      this.isSavingAvatar = true;
      mine.set("avatar", dataUrl);

      try {
        await mine.save();
        await this.$store.dispatch("user/getUser");

        this.$refs.pictureSelector.close();
      } catch (error) {
        this.$catch(error);
      } finally {
        this.isSavingAvatar = false;
      }
    },
    verifyEmail() {}
  }
};
</script>