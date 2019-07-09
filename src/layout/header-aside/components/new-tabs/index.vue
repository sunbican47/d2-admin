<template>
  <div class="d2-multiple-page-control-group" flex>
    <div class="d2-multiple-page-control-content" flex-box="1">
      <div class="d2-multiple-page-control-content-inner">
        <!-- <div class="bx-tab-title">{{$route.name==undefined?'':$route.name+''}}
          <i class="el-icon-arrow-right"></i>
        </div>-->
        <div
          class="bx-tab-item"
          :class="{'oncheck':i==index}"
          v-for="(item,i) in tabshow"
          :key="i"
          @click="setTabCheck(i)"
        >
          <div class="main">{{item.meta.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      tabshow: [],
      index: 0
    };
  },
  computed: {
    ...mapState("d2admin/menu", ["aside", "asideCollapse"])
  },
  methods: {
    getRoute(name) {
      for (let j in this.aside) {
        let tabMap = this.aside[j].children;
        if (this.aside[j].name == name && tabMap != undefined) {
          if (tabMap.length > 0) {
            this.tabshow = tabMap;
          }
        } else {
          this.tabshow = [];
        }
      }
    },
    setTabCheck(i) {
      this.index = i;
      this.$router.push(this.tabshow[i].path);
      console.log(i, this.tabshow[i].path);
    }
  },
  mounted() {
    console.log(this.aside);
    this.getRoute(this.$route.name);
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.$nextTick(() => {
          this.index = 0;
          this.getRoute(val.name);
          console.log(this.aside);
        });
      },
      // 深度观察监听
      deep: true
    }
  }
};
</script>
<style lang="scss" scope>
$hh: 40px;
.d2-multiple-page-control-content-inner {
  border-bottom: 1px solid #cfd7e5;
  display: flex;
  flex-direction: row;
  height: $hh;
}
.bx-tab-title {
  height: $hh;
  min-width: $hh * 2;
  line-height: $hh;
  text-align: center;
  padding: 0 8px;
  font-size: 15px;
}
.bx-tab-item {
  height: ($hh)-1;
  min-width: $hh * 2;
  line-height: $hh;
  text-align: center;
  padding: 0 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13.5px;
  opacity: 0.8;
  border-color: #fff;
  border-radius: 3px 3px 0 0;
}
.bx-tab-item:hover,
.bx-tab-item.oncheck {
  padding: 0 12px;
  background-color: rgba(255, 255, 255, 1);
  color: #2f74ff;
  font-size: 15px;
  border: 1px solid #cfd7e5;
  border-bottom: none;
}
</style>
