<template>
  <div class="d-flex flex-column align-space-between flex-grow-1 grey lighten-4">
    <hair :dark="false"></hair>
    <div class="d-flex flex-column flex-md-row align-center justify-md-center flex-grow-1 white">
      <v-card
        v-for="plane in planes"
        :key="plane.id"
        width="300"
        min-width="300"
        height="560"
        min-height="560"
        color="blue"
        dark
        class="d-flex flex-column justify-space-between ma-4"
      >
        <v-card-title class="justify-center align-center py-6" style="background:#fff3">
          <div class>{{plane.label}}</div>
          <h2>{{plane.price}}</h2>
          <h4>元/年</h4>
        </v-card-title>
        <v-card-text class="flex-grow-1">
          <ul class="mt-6">
            <li
              v-for="(feature,index) in plane.items"
              :key="`items:${feature.id}_${index}`"
              class="d-flex flex-row justify-space-between"
            >
              <label style="font-size:14px">{{feature.label}}</label>
              <v-icon color="success" v-if="feature.condition === true">mdi-check-circle</v-icon>
              <label style="font-size:12px" v-else>{{feature.condition}}</label>
            </li>
          </ul>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn
            :disabled="userPlane.price >= plane.price"
            color="primary"
            depressed
            block
            large
            rounded
            @click="buy(plane)"
            v-show="plane.price > 0"
          >
            <label v-if="userPlane.price === plane.price">已购买</label>
            <label v-else-if="userPlane.price < plane.price && userPlane.price > 0">升级</label>
            <label v-else>购买</label>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-dialog persistent max-width="860" :value="payStatus">
      <v-card>
        <v-card-title>收银台</v-card-title>
        <v-card-text>
          <div
            v-if="payStatus === 'CREATE'"
            class="d-flex flex-column flex-sm-row justify-sm-space-around"
          >
            <v-list>
              <v-subheader class="primary--text">购买 {{payPlane.label}}</v-subheader>
              <ul>
                <li
                  v-for="(feature,index) in payPlane.items"
                  :key="`items:${feature.id}_${index}`"
                  class="d-flex flex-row justify-space-between"
                >
                  <label style="font-size:14px">{{feature.label}}</label>
                  <v-icon color="success" v-if="feature.condition === true">mdi-check-circle</v-icon>
                  <label style="font-size:12px" v-else>{{feature.condition}}</label>
                </li>
              </ul>
            </v-list>
            <v-divider :vertical="$vuetify.breakpoint.smAndUp"></v-divider>
            <div class="d-flex flex-column justify-center">
              <div>
                <v-subheader class="primary--text">购买时长</v-subheader>
                <v-btn-toggle v-model="payYears" group color="primary">
                  <v-btn
                    :disabled="planeFee && planeFee.payYears > off.year"
                    text
                    :value="off.year"
                    v-for="off in paymentOffs"
                    :key="off.objectId"
                  >
                    <v-icon v-show="payYears == off.year" color="success">mdi-check</v-icon>
                    <label>{{off.year}}年</label>
                    <i v-if="off.offPoint === 1">(无折扣)</i>
                    <i v-else>{{`(${off.offPoint* 10} 折)`}}</i>
                  </v-btn>
                </v-btn-toggle>
                <div class="mt-6" v-show="planeFee && planeFee.payYears > 0">
                  <v-icon size="16">mdi-help-circle</v-icon>
                  版本升级时，购买时长不能小于老版本的时长 ({{planeFee.payYears}} 年)
                </div>
              </div>
              <div class="mt-6">
                <v-subheader class="primary--text">付款方式</v-subheader>
                <v-btn-toggle class="payment" group color="primary" v-model="payUse">
                  <v-btn outlined value="ALIPAY">
                    <div style="color:#00aaee;" class="d-flex align-center">
                      <i class="iconfont icon-alipay"></i>
                      <label>支付宝</label>
                    </div>
                  </v-btn>
                  <v-btn outlined value="WEPAY">
                    <div style="color:#19c105;" class="d-flex align-center">
                      <i class="iconfont icon-wechat-pay"></i>
                      <label>微信</label>
                    </div>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </div>
          <div
            v-if="payStatus === 'WAITING'"
            class="d-flex flex-column justify-stretch align-center"
          >
            <v-alert outlined type="info" color="primary">请在新页面中进行支付，完成后该页面会自动刷新</v-alert>
            <v-icon :size="84" color="primary" class="ma-12 mb-12">mdi-spin mdi-loading</v-icon>
          </div>
          <div
            v-if="payStatus === 'SUCCESS'"
            class="d-flex flex-column justify-stretch align-center"
          >
            <v-alert outlined color="success">支付成功</v-alert>
            <v-icon :size="84" color="success" class="ma-12 mb-12">mdi-check-circle</v-icon>
          </div>
        </v-card-text>

        <v-card-actions
          v-if="payStatus === 'CREATE'"
          class="pa-8 d-flex flex-column align-end flex-sm-row align-sm-end justify-sm-space-between"
        >
          <div class="d-flex flex-row align-end">
            <label>合计</label>
            <strong class="price">{{payTotal}}</strong>
            <small class="ml-2 grey--text">
              已优惠
              <i class="price secondary--text">{{payOffset}}</i>
            </small>
            <small class="ml-2 grey--text" v-if="planeFee && planeFee.fee > 0">
              老版本升级已抵现
              <i class="price secondary--text">{{planeFee.fee}}</i>
            </small>
          </div>

          <div>
            <v-btn color="primary" @click="pay">支付</v-btn>
            <v-btn text @click="payStatus = null">取消</v-btn>
          </div>
        </v-card-actions>

        <v-card-actions
          v-if="payStatus === 'WAITING'"
          class="pa-8 d-flex flex-row justify-center align-center"
        >
          <div class="d-flex flex-row justify-center align-center mt-12">
            <v-icon>mdi-help-circle</v-icon>
            <v-btn text @click="refreshStatus">我已完成支付</v-btn>
            <v-divider vertical class="ma-2" />
            <!-- <v-btn text>支付遇到了问题?</v-btn>
            <v-divider vertical class="ma-2" />-->
            <v-btn text @click="payStatus = null">取消支付</v-btn>
          </div>
        </v-card-actions>

        <v-card-actions
          v-if="payStatus === 'SUCCESS'"
          class="pa-8 d-flex flex-row justify-end align-center"
        >
          <v-btn color="primary" @click="payStatus = null">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <foot class="flex-grow-0" :dark="false"></foot>
  </div>
</template>
<script>
import UserAvatar from "../components/UserAvatar";
import Foot from "../components/Foot";
import Hair from "../components/Hair";
import { mapGetters } from "vuex";
import planes from "../store/predefine/planes";
import { debug } from "util";
const FeatureClass = Parse.Object.extend("feature");
const PaymentOffClass = Parse.Object.extend("paymentOff");
const OrderClass = Parse.Object.extend("order");
const openUrl = function(url) {
  var newPage = window.open();
  newPage.location.href = url

  return newPage
};

export default {
  head() {
    return {
      title: "价格"
    };
  },
  data() {
    return {
      payPlane: null,
      payStatus: null, //CREATE,WAITING,SUCCESS
      isPaying: false,
      paymentOffs: [],
      payYears: 1,
      orderNumber: null,
      payWindow: null,
      planes: [],
      isUpgrade: false,
      planeFee: null,
      payUse: "ALIPAY"
    };
  },
  computed: {
    ...mapGetters({
      user: "user/user"
    }),
    userPlane() {
      if (this.user && this.user.plane) {
        return planes[this.user.plane] || planes.planeA;
      }

      return planes.planeA;
    },
    /**
     * 合计金额
     */
    payTotal() {
      var offPoint = 1;
      var payOff = _.find(this.paymentOffs, { year: this.payYears });
      if (payOff) {
        offPoint = payOff.offPoint;
      }

      return _.toNumber(
        _.toNumber(this.payPrice * this.payYears * offPoint) -
          _.toNumber(this.planeFee.fee)
      ).toFixed(2);
    },
    /**
     * 选购版本的单价
     */
    payPrice() {
      return _.toNumber(_.get(this.payPlane, "price") || 0).toFixed(2);
    },
    /**
     * 折扣
     */
    payOffset() {
      return _.toNumber(
        _.toNumber(this.payPrice * this.payYears) -
          _.toNumber(this.payTotal) -
          this.planeFee.fee
      ).toFixed(2);
    }
  },
  components: {
    UserAvatar,
    Foot,
    Hair
  },
  methods: {
    async buy(plan) {
      if (this.userPlane.price < plan.price) {
        try {
          this.isUpgrade = true;
          this.planeFee = await Parse.Cloud.run("planeFee");
        } catch (error) {
          this.$catch(error);
          return;
        }
      }

      this.payPlane = plan;
      this.payStatus = "CREATE";
    },
    async pay() {
      var order = null;

      if (!_.isEmpty(this.payPlane)) {
        this.isPaying = true;

        try {
          order = await Parse.Cloud.run("buy", {
            payYears: this.payYears,
            payPlane: this.payPlane.id,
            payUse: this.payUse
          });
        } catch (error) {
          this.$catch(error);
        }

        if (order) {
          var { url, number } = order;

          if (number) {
            this.orderNumber = number;
          }

          if (url) {
            this.stopWatch();
            this.startWatch();
            this.payWindow = openUrl(url);
            this.payStatus = "WAITING";
          }
        }
      }
    },
    async getData() {
      var features = [];
      var paymentOffs = [];
      var planMap = (planName, list) => {
        return _.chain(list)
          .filter(
            i =>
              i[planName] === -1 ||
              (_.isEmpty(i.unit) ? i[planName] === 1 : i[planName] > 0)
          )
          .map(i => {
            var condition = null;

            if (i[planName] === -1) {
              condition = "不限";
            } else if (i.unit) {
              condition = `最多 ${i[planName]} ${i.unit}`;
            } else {
              condition = true;
            }

            return {
              label: i.label,
              code: i.code,
              condition
            };
          })
          .value();
      };

      try {
        features = await new Parse.Query(FeatureClass).find();
        paymentOffs = await new Parse.Query(PaymentOffClass).find();
      } catch (error) {
        this.$catch(error);
      }

      if (!_.isEmpty(features) && !_.isEmpty(paymentOffs)) {
        var features = _.map(features, i => i.toJSON());

        var planeA = {
          ...planes.planeA,
          items: planMap("planeA", features)
        };
        var planeB = {
          ...planes.planeB,
          items: planMap("planeB", features)
        };
        var planeC = {
          ...planes.planeC,
          items: planMap("planeC", features)
        };

        this.paymentOffs = _.chain(paymentOffs)
          .map(item => item.toJSON())
          .orderBy("year")
          .value();

        this.planes = [planeA, planeB, planeC];
      }
    },
    async refreshStatus() {
      if (!this.orderNumber) {
        return;
      }

      var order = await new Parse.Query(OrderClass)
        .equalTo("number", this.orderNumber)
        .equalTo("status", "success")
        .first();

      if (order) {
        this.payStatus = "SUCCESS";
        this.stopWatch();
        this.$store.dispatch("user/getUser");
        this.payWindow.removeEventListener("paySuccess", this.refreshStatus);
      }
    },
    startWatch() {
      window.addEventListener("visibilitychange", this.refreshStatus);
    },
    stopWatch() {
      window.removeEventListener("visibilitychange", this.refreshStatus);
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  destroyed() {
    this.stopWatch();
  }
};
</script>
<style lang="scss" scoped>
.price-list {
  .v-card {
    margin: 12px;
  }
}

ul {
  li {
    line-height: 32px;
  }
}
.price-table-featured div {
  margin: 10px 0;
  font-size: 14px;
  font-weight: lighter;
}

h2 {
  font-size: 48px;
  font-weight: 200;
  padding: 12px;
}

h4 {
  font-size: 16px;
  font-weight: 200;
}

.staff {
  letter-spacing: 6px;
  font-size: 20px;
  font-weight: 100;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid #e3f2fd;
  color: #0d47a1;
  height: 0;
  width: 220px;
  line-height: 40px;
  text-align: center;
  transform: rotate(-45deg);
  position: absolute;
  top: 40px;
  left: -50px;
}

.through-line {
  text-decoration: line-through;
}

.payment {
  .iconfont {
    font-size: 24px;
  }

  label {
    font-size: 16px;
    margin-left: 6px;
  }
}

.price {
  margin: 0 2px;
  &::after {
    content: "元";
  }
}
</style>
