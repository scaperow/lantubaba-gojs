<template>
  <section class="d-flex flex-column flex-grow-1">
    <hair style="background-color:#fff3 !important"></hair>
    <div
      style="max-width:1200px"
      class="align-self-center flex-grow-1 flex-column d-flex align-stretch"
    >
      <div class="mt-6 mb-6 d-flex align-space-between justify-space-between">
        <div>
          <v-hover>
            <v-img max-height="100" src="/world.png">
              <h2>广场</h2>这里汇聚了来自全国各地的蓝图
            </v-img>
          </v-hover>
        </div>
        <div>
          <v-text-field
            rounded
            filled
            max="20"
            hide-details
            label="搜索标题"
            color="white"
            v-model="searchKeywords"
            dark
            append-icon="mdi-cloud-search"
            @click:append="search"
            style="width:320px"
            @keydown.enter="search"
            :loading="searching"
          ></v-text-field>
          <v-menu offset-y>
            <template v-slot:activator="{on}">
              <v-btn dark rounded text v-on="on">
                排序方式:
                <label v-if="sort==='HOT'">最热门</label>
                <label v-if="sort==='NEWLY'">新发布</label>
                <v-icon>mdi-arrow-down-drop-circle</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="sort = 'HOT'">
                <v-list-item-icon>
                  <v-icon color="success" v-if="sort==='HOT'">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>最热门</v-list-item-content>
              </v-list-item>
              <v-list-item @click="sort='NEWLY'">
                <v-list-item-icon>
                  <v-icon color="success" v-if="sort==='NEWLY'">mdi-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>新发布</v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <div
        v-if="list.length > 0"
        class="d-flex flex-row flex-grow-1 flex-wrap align-self-center justify-center justify-md-start align-content-start"
      >
        <v-hover v-for="(works,index) in list" :key="index">
          <template v-slot:default="{hover}">
            <v-card
              width="180"
              class="ma-2 pa-0"
              max-width="220"
              href="_blank"
              :elevation="hover?12:0"
              nuxt
              :to="`visit?id=${works.objectId}`"
            >
              <v-img
                :src="works|thumbnail"
                :lazy-src="works|thumbnail"
                fit="contain"
                :alt="works.name"
                height="180"
              ></v-img>
              <v-card-title style="font-size:14px" class="animated faster">{{works.name}}</v-card-title>
              <v-card-actions class="d-flex justify-space-around align-start">
                <div>
                  <v-icon size="16">mdi-thumb-up</v-icon>
                  {{works.likes}}
                </div>
                <div>
                  <v-icon size="16">mdi-comment-text</v-icon>
                  {{works.comments}}
                </div>
              </v-card-actions>
            </v-card>
          </template>
        </v-hover>
      </div>
      <div class="pa-6 white--text d-flex flex-row justify-center align-center">
        <more :dark="true" @start="more" :index="list.length" :total="total">
          <template v-slot="finish">
            <div v-if="total > 0">以上就是全部的蓝图</div>
          </template>
        </more>

      </div>
    </div>
    <foot style="background-color:#fff3 !important"></foot>
  </section>
</template>

<script>
import UserAvatar from "../components/UserAvatar";
import More from "../components/More";
import Foot from "../components/Foot";
import Hair from "../components/Hair";
import { mapGetters } from "vuex";

export default {
  name: "app",
  head() {
    return {
      title: "广场"
    };
  },
  computed: {
    ...mapGetters({
      user: "user/user",
      list: "square/list",
      total: "square/count"
    })
  },
  components: {
    UserAvatar,
    Foot,
    Hair,
    More
  },
  methods: {
    async fetch(promise) {
      this.loading = true;

      try {
        await this.$store.dispatch("square/getList", {
          index: this.index,
          size: this.size,
          keywords: this.keywords
        });
      } catch (error) {
        this.$catch(error);
      }

      if (promise && promise.resolve) {
        promise.resolve();
      }

      this.loading = false;
    },
    async search() {
      this.searching = true;
      this.index = 0;
      this.keywords = this.searchKeywords;

      await this.$store.dispatch("square/clear");
      await this.fetch();

      this.searching = false;
    },
    async more({ resolve, reject }) {
      this.index++;
      await this.fetch();
      resolve();
    }
  },
  data() {
    return {
      loading: true,
      searchKeywords: null,
      sort: "HOT",
      keywords: null,
      index: 0,
      size: 20,
      searching: false
    };
  },
  mounted() {
    this.$store.dispatch("square/clear");
    this.fetch();
  }
};
</script>

<style lang="scss" scoped>
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

section {
  letter-spacing: 2px;
  font-weight: 200;
  margin: 0;
  font-family: "Exo", sans-serif;

  font-weight: 200;
  margin: 0;
  color: #fff;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  //animation: gradientBG 15s ease infinite;

  .header {
    padding: 0 24px;
    .right {
      text-align: right;
    }
  }

  .container {
    width: 100%;
    position: absolute;
    top: 35%;
    text-align: center;
    letter-spacing: 2px;

    button {
      background: #3333;
      color: #fff;
      letter-spacing: 2px;
      border-radius: 65px;
      transition: all 0.3s;
      font-size: 18px;
      width: auto;
      height: 65px;
      padding: 0 32px;
      cursor: pointer;
      margin: 0;
      line-height: 65px;
      border: none;

      &:hover {
        background: #fff;
        color: #333;
      }

      &.tip {
        margin-top: 36px;
      }
    }
  }

  .footer {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: -100px;
    height: 100px;
    background: #fff;
    color: #9c9c9c;

    h3 {
      font-weight: 200;
    }

    h5 {
      font-weight: 200;
    }
  }

  h1 {
    font-weight: 300;
    font-size: 32px;
    font-size: 46px;
  }

  p {
    font-size: 28px;
  }

  a,
  a:hover {
    text-decoration: none;
    color: #ddd;
  }
}
</style>
