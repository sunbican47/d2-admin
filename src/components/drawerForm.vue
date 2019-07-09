<style>
</style>
<template>
  <div>
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="onSubmit">确 定</el-button>
  </div>
</template>
<script>
export default {
  name: "drawerForm",
  props: {
    drawerVisiteFun: false,
    width: {
      type: Number,
      default: 420
    },
    onSubmitFun: {
      type: Function
    },
    getChildrenStatus: {
      type: Function
    },
    title: {
      type: String,
      default: "编辑"
    }
  },
  data() {
    return {
      newDrawerVisite: false
    };
  },
  created() {},
  watch: {
    drawerVisiteFun: function() {
      // 监听父组件的变化
      this.newDrawerVisite = this.drawerVisiteFun;
    }
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.onSubmitFun(this.formData);
      console.warn(this.formData);
    },
    close() {
      this.newDrawerVisite = false;
      this.getChildrenStatus(this.newDrawerVisite);
      this.$emit("newDrawerVisite", this.newDrawerVisite);
    }
  }
};
</script>