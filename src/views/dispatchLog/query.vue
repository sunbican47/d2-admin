<template>
  <div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form inline :model="queryFilters">
        <el-form-item label="执行器">
          <el-select
            v-model="queryFilters.jobGroup"
            @change="refreshRenderTable"
            placeholder="请选择执行器"
          >
            <el-option :label="item2.title" :value="item2.id"></el-option>
            <el-option
              v-for="(item,index) in allTable"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务">
          <el-select v-model="queryFilters.jobId" placeholder="请选择任务">
            <el-option :label="item3.jobDesc" :value="item3.id"></el-option>
            <el-option
              v-for="(item,index) in jobIdArray"
              :key="index"
              :label="item.jobDesc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryFilters.logStatus" placeholder="请选择状态">
            <el-option
              v-for="(item,index) in logStatusArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调度时间">
          <el-date-picker
            v-model="value3"
            id="ce"
            @change="changeFilterTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" v-on:click="querySubmit">查询</el-button>
        <el-button class="clear" type="info" @click="handleClear">清除</el-button>
      </el-form>
    </el-col>
  </div>
</template>

<script>
import { searchAll } from "@/api/executorManager-api.js";
import { paged } from "@/api/taskManager-api.js";
import moment from "moment";
export default {
  components: {},
  name: "edit",
  data() {
    return {
      queryFilters: {
        jobGroup: 0,
        jobId: 0,
        logStatus: -1,
        filterTime:
          moment()
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss") +
          " - " +
          moment()
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
      },
      value3: [
        moment()
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment()
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      ],
      item2: { title: "全部", id: 0 },
      item3: { jobDesc: "全部", id: 0 },
      allTable: [],
      jobIdArray: [],
      logStatusArray: [
        { name: -1, label: "全部" },
        { name: 1, label: "成功" },
        { name: 2, label: "失败" },
        { name: 3, label: "进行中" }
      ],
      pageParams: {
        current: 1,
        size: 10,
        jobGroup: 1
      }
    };
  },
  props: {
    queryFun: Function,
    handleClearFun: Function
  },
  mounted() {
    this.init();
  },
  methods: {
    handleClear() {
      const jobGroupObject = {
        name: "",
        value: this.queryFilters.jobGroup
      };
      this.allTable.map(function(condition) {
        if (condition.id == jobGroupObject.value) {
          jobGroupObject.name = condition.title;
        }
      });
      jobGroupObject.name =
        this.queryFilters.jobGroup == 0 ? "全部" : jobGroupObject.name;
      const jobIdObject = {
        name: "",
        value: this.queryFilters.jobId
      };
      this.jobIdArray.map(function(condition) {
        if (condition.id == jobIdObject.value) {
          jobIdObject.name = condition.jobDesc;
        }
      });
      jobIdObject.name =
        this.queryFilters.jobId == 0 ? "全部" : jobIdObject.name;
      this.handleClearFun(jobGroupObject, jobIdObject);
    },
    changeFilterTime(datetime) {
      this.queryFilters.filterTime = datetime[0] + " - " + datetime[1];
    },
    refreshRenderTable() {
      // this.pageParams.jobGroup = this.queryFilters.jobGroup;
      paged(this.pageParams).then(res => {
        const { bizdata } = res;
        const { data } = bizdata;
        console.warn(data);
        this.jobIdArray = data;

        // this.queryFilters.jobId = this.$route.query.jobId;
        // 点击执行器没有出现任务选择列表
      });
    },
    init() {
      // this.queryFilters.jobGroup = 0;

      Promise.all([promist, promist1]);
      if (this.$route.query.jobId != undefined) {
        this.queryFilters.jobGroup = Number(this.$route.query.jobGroup);
        this.pageParams.jobGroup = this.queryFilters.jobGroup;
        this.queryFilters.jobId = Number(this.$route.query.jobId);
        // this.queryFilters.jobId = this.$route.query.jobId;
      } else this.queryFilters.jobId = this.item3.id;
      const promist = new Promise((resolve, reject) => {
        this.refreshRenderTable();
      });
      const promist1 = new Promise((resolve, reject) => {
        searchAll().then(res => {
          const { bizdata } = res;
          this.allTable = bizdata;
        });
      });

      this.querySubmit();
    },

    //查询
    querySubmit() {
      var o = { ...this.queryFilters };
      console.log("提交的数据: " + JSON.stringify(o));
      //移除为空的
      Object.keys(o).forEach(key => o[key] === "" && delete o[key]);
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
.clear {
  float: right;
}

@media screen and (min-width: 1300px) and (max-width: 1400px) {
  .el-select {
    width: 100px;
  }
  .el-date-editor {
    width: 200px !important;
  }
}
@media screen and (max-width: 1300px) {
  .el-select {
    width: 80px;
  }
  .el-date-editor {
    width: 160px !important;
  }
}
@media screen and (min-width: 1400px) and (max-width: 1600px) {
  .el-select {
    width: 110px;
  }
  .el-date-editor {
    width: 320px !important;
  }
}
@media screen and (min-width: 1600px) {
  .el-select {
    width: 160px;
  }
  .el-date-editor {
    width: 380px !important;
  }
}
</style>
