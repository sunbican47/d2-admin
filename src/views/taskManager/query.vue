<template>
  <div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="queryFilters">
        <el-form-item label="执行器">
          <el-select
            @change="refreshRenderTable"
            v-model="queryFilters.jobGroup"
            placeholder="请选择执行器"
          >
            <el-option
              v-for="(item,index) in allTable"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="queryFilters.jobDesc" placeholder="请填写任务描述"></el-input>
        </el-form-item>
        <el-form-item label="JobHandler">
          <el-input v-model="queryFilters.executorHandler" placeholder="请填写JobHandler"></el-input>
        </el-form-item>
        <el-button type="primary" v-on:click="querySubmit">查询</el-button>
        <el-button class="add" type="success" @click="handleAdd">新增任务</el-button>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { searchAll } from "@/api/executorManager-api.js";
export default {
  components: {},
  name: "edit",
  data() {
    return { queryFilters: { jobGroup: "" }, allTable: [] };
  },
  props: {
    queryFun: Function,
    handleAddFun: Function
  },
  mounted() {
    this.init();
  },
  methods: {
    handleAdd() {
      this.handleAddFun();
    },
    init() {
      searchAll().then(res => {
        const { bizdata } = res;
        this.allTable = bizdata;
        if (this.allTable.length > 0) {
          this.queryFilters.jobGroup = this.allTable[0].id;
          this.querySubmit();
        }
      });
    },
    refreshRenderTable() {
      this.querySubmit();
    },
    //查询
    querySubmit() {
      var o = { ...this.queryFilters };
      console.log("提交的数据: " + JSON.stringify(o));
      //移除为空的
      Object.keys(o).forEach(key => o[key] == "" && delete o[key]);
      console.log("提交的数据: " + JSON.stringify(o));
      this.queryFun(o);
    },
    //重置
    queryReset() {
      this.queryFilters = {};
      this.queryFun(this.queryFilters);
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "../../styles/mediaCommon.less";
.add {
  float: right;
}
@media screen and (min-width: 1300px) and (max-width: 1400px) {
  .el-select,
  .el-input {
    width: 120px;
  }
}
@media screen and (max-width: 1300px) {
  .el-select,
  .el-input {
    width: 100px;
  }
}
@media screen and (min-width: 1400px) and (max-width: 1600px) {
  .el-select,
  .el-input {
    width: 140px;
  }
}
@media screen and (min-width: 1600px) {
  .el-select,
  .el-input {
    width: 180px;
  }
}
</style>
