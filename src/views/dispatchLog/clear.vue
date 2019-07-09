<template>
  <div>
    <!--清理界面-->
    <el-dialog width="660px" title="日志清理" :visible.sync="drawerVisite">
      <el-form
        :inline="true"
        ref="clearForm"
        label-width="115px"
        label-position="right"
        :model="clearForm"
        class="demo-form-inline"
      >
        <el-form-item label="执行器" prop="jobGroup">
          <el-input disabled :placeholder="this.jobGroupName"></el-input>
        </el-form-item>
        <el-form-item label="任务" prop="jobId">
          <el-input disabled :placeholder="this.jobIdName"></el-input>
        </el-form-item>
        <el-form-item label="清理方式" prop="type">
          <el-select v-model="clearForm.type" placeholder="请选择清理方式">
            <el-option
              v-for="(item,index) in this.GLOBAL.joblogClearTypeArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <drawerForm
        slot="footer"
        class="dialog-footer"
        ref="drawerForm"
        :drawerVisiteFun="drawerVisite"
        :getChildrenStatus="getChildrenStatus"
        :onSubmitFun="onSubmit"
        title="日志清理"
      ></drawerForm>
    </el-dialog>
  </div>
</template>

<script>
import drawerForm from "@/components/drawerForm";
import lodash from "lodash";
import { searchAll } from "@/api/executorManager-api.js";
export default {
  components: { drawerForm },
  name: "clear",
  data() {
    return {
      clearForm: { type: 1 },
      drawerVisite: false,
      jobGroupName: "",
      jobIdName: ""
    };
  },
  props: {
    clearFun: {
      type: Function
    }
  },
  methods: {
    getChildrenStatus(data) {
      this.drawerVisite = data;
    },
    // 显示日志清理
    show(data1, data2) {
      this.drawerVisite = true;
      this.clearForm.jobGroup = data1.value;
      this.jobGroupName = data1.name;
      this.clearForm.jobId = data2.value;
      this.jobIdName = data2.name;
    },
    onSubmit() {
      //表单校验
      this.$refs["clearForm"].validate(valid => {
        if (valid) {
          this.clearFun(this.clearForm);
          this.$refs.drawerForm.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 460px !important;
}
</style>
