<template>
  <el-tooltip effect="dark" :content="active ? '退出全屏' : '全屏'" placement="bottom">
    <el-button class="d2-mr btn-text can-hover" type="text" @click="toggle">
      <d2-icon v-if="active" name="compress"/>
      <d2-icon v-else name="arrows-alt" style="font-size: 16px"/>
    </el-button>
  </el-tooltip>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("d2admin/fullscreen", ["active"])
  },
  methods: {
    // 路径 d2amin/fullscreen 表示store目录下对应的文件名称， ["toggle"] 表示fullscreen文件下的动作方法名
    ...mapActions("d2admin/fullscreen", ["toggle"])
  }
};
</script>
