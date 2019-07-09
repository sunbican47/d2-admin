<template>
  <div>
    <!--页面头部-->
    <!-- <el-col :span="24" class="toolbar header" style="padding-bottom: 0px;"> -->
    <!-- 查询条件 -->
    <query class="search" ref="query" :queryFun="querySubmit" :handleAddFun="handleAdd"></query>
    <!-- <el-button class="add" type="success" @click="handleAdd">新增任务</el-button> -->
    <!-- <el-button type="danger" @click="batchRemove">批量删除</el-button> -->
    <!-- </el-col> -->
    <!--列表-->
    <el-table
      :data="tableMapping"
      highlight-current-row
      :stripe="true"
      border
      v-loading="listLoading"
      @selection-change="selectsChange"
      style="width:100%;"
    >
      <el-table-column type="selection" min-width="50" max-width="60"></el-table-column>
      <el-table-column prop="id" min-width="120px" max-width="160px" label="任务ID" sortable></el-table-column>
      <el-table-column prop="jobDesc" min-width="160px" max-width="200px" label="任务描述" sortable></el-table-column>
      <el-table-column prop="glueType" min-width="120px" max-width="160px" label="运行模式"></el-table-column>
      <el-table-column
        prop="executorHandler"
        min-width="120px"
        max-width="160px"
        label="JobHandler"
      ></el-table-column>
      <el-table-column
        prop="jobCron"
        min-width="120px"
        max-width="160px"
        label="Cron"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="author" min-width="120px" max-width="160px" label="负责人" sortable></el-table-column>
      <el-table-column prop="jobStatus" min-width="120px" max-width="160px" label="状态" sortable></el-table-column>
      <el-table-column label="操作" min-width="260px" max-width="360px">
        <template slot-scope="scope">
          <el-button
            size="small"
            class="operation_bg_color"
            @click="handleExecute(scope.$index, scope.row)"
          >执行</el-button>
          <el-button
            size="small"
            class="operation_bg_color"
            @click="handleOperation(scope.$index, scope.row,scope.row.jobStatus==='NONE'?'停止':'启动')"
          >{{scope.row.jobStatus==='NONE'?"停止":"启动"}}</el-button>
          <el-button
            class="operation_bg_color"
            size="small"
            @click="handleLog(scope.$index, scope.row)"
          >日志</el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, prev, pager, next, sizes"
        :total="total"
      ></el-pagination>
    </el-col>
    <add ref="add" :addFun="addSubmit"></add>
    <edit ref="edit" :editFun="editSubmit"></edit>
  </div>
</template>

<script>
import query from "./query";
import add from "./add";
import edit from "./edit";
import * as api from "@/api/taskManager-api.js";
import { statusFormat, resStatus } from "@/utils/format";
// import cronUtil from "@/utils/cronUtil";
import moment from "moment";
//
export default {
  components: { query, add, edit },
  name: "index",
  data() {
    return {
      api,
      tableMapping: [],
      total: 0,
      page: 1,
      listLoading: false,
      editFormVisible: false, //编辑界面是否显示
      addFormVisible: false, //新增界面是否显示
      pageParams: { current: 1, size: 10, jobGroup: 1 },
      selectedIds: [],
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    handleExecute(index, row) {
      console.warn("执行");

      this.$prompt("任务参数：", "执行", {
        customClass: "message-logout",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "textarea",
        inputPlaceholder: "请输入任务参数"
      })
        .then(({ value }) => {
          this.api.trigger({ id: row.id, executorParam: value }).then(res => {
            resStatus(res.retcode, "执行成功", res.message);
          });
        })
        .catch(() => {});
    },
    handleOperation(index, row, startOrStop) {
      this.$confirm("确认" + startOrStop + "?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.jobStatus === "NONE") {
            this.api.stop({ id: row.id }).then(res => {
              resStatus(res.retcode, startOrStop + "成功", res.message);
            });
          } else {
            this.api.start({ id: row.id }).then(res => {
              resStatus(res.retcode, startOrStop + "成功", res.message);
            });
          }
        })
        .catch(() => {});
    },
    handleLog(index, row) {
      console.warn("日志");
      this.$router.push({
        name: "log",
        query: { jobGroup: row.jobGroup, jobId: row.id },
        params: { jobGroup: row.jobGroup }
      });
    },
    //触发分页
    handleCurrentChange(val) {
      this.pageParams.current = val;
      this.refreshTable(this.pageParams);
    },
    handleSizeChange(val) {
      this.pageParams.size = val;
      this.refreshTable(this.pageParams);
    },
    //获取列表
    refreshTable(val) {
      console.warn(val);
      this.listLoading = true;
      this.api.paged(val).then(res => {
        const { bizdata } = res;
        console.warn(res);
        const { records } = bizdata;
        this.tableMapping = records;
        this.total = res.bizdata.total;
        this.listLoading = false;
      });
    },
    //条件查询
    querySubmit(addQueryParmas) {
      this.pageParams.jobGroup = addQueryParmas.jobGroup;
      var o = { ...addQueryParmas };
      //移除key名称为jobGroup
      Object.keys(o).forEach(key => key == "jobGroup" && delete o[key]);
      this.refreshTable({
        ...this.pageParams,
        ...o
      });
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
      this.$refs.add.show();
    },
    //显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.$refs.edit.show(row);
    },
    //新增
    addSubmit(addForm) {
      this.api.created(addForm).then(res => {
        resStatus(res.retcode, "添加成功", "添加失败");
        this.refreshTable(this.pageParams);
      });
    },
    editSubmit(editForm) {
      console.warn("编辑", editForm);
      this.api.updated(editForm).then(res => {
        resStatus(res.retcode, "编辑成功", "编辑失败");
        this.refreshTable(this.pageParams);
      });
    },
    //单个删除
    handleDel: function(index, row) {
      this.$confirm("确认删除?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let t = [];
          t.push(row.id);
          this.selectedIds = t;
          this.api.deleteByIds(this.selectedIds).then(res => {
            this.listLoading = false;
            resStatus(res.retcode, "删除成功", "删除失败");
            this.refreshTable(this.pageParams);
          });
        })
        .catch(() => {});
    },
    //选中
    selectsChange(selects) {
      let t = [];
      selects.forEach(e => {
        t.push(e.id);
      });
      this.selectedIds = t;
    },
    //批量删除
    batchRemove() {
      if (this.selectedIds.length <= 0) {
        this.$message({
          message: "请选中再删除！",
          type: "info"
        });
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          this.api.deleteByIds(this.selectedIds).then(res => {
            this.listLoading = false;
            resStatus(res.retcode, "刪除成功", "刪除失败");
            this.refreshTable(this.pageParams);
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped >
.toolbar.header {
  margin: 0px;
  padding: 0px;
}
.search {
  float: left;
}
.add {
  float: right;
}
.operation_bg_color {
  background-color: #367fa9;
  color: #fff;
}
</style>
<style lang="scss">
.message-logout {
  width: 560px;
}
</style>