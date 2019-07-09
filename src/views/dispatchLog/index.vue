<template>
  <div>
    <!--页面头部-->
    <el-col :span="24" class="toolbar header" style="padding-bottom: 0px;">
      <!-- 查询条件 -->
      <query ref="query" :queryFun="querySubmit" :handleClearFun="handleClear"></query>
    </el-col>
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
      <el-table-column prop="jobId" min-width="120px" max-width="160px" label="任务ID" sortable></el-table-column>
      <el-table-column prop="triggerTime" min-width="160px" max-width="200px" label="调度时间"></el-table-column>
      <el-table-column
        prop="triggerCode"
        min-width="120px"
        max-width="160px"
        label="调度结果 job_dashboard_rate_report"
      >
        <template slot-scope="scope">
          <span
            class="rowTriggerCode"
          >{{scope.row.triggerCode==500?"失败":scope.row.triggerCode==502?"失败(超时)":"成功"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="120px"
        max-width="160px"
        label="调度备注"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <span class="rowCheck" @click="handleCheck(scope.$index, scope.row.triggerMsg)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="handleTime" min-width="120px" max-width="160px" label="执行时间"></el-table-column>
      <el-table-column prop="handleCode" min-width="120px" max-width="160px" label="执行结果"></el-table-column>
      <el-table-column prop="handleMsg" min-width="120px" max-width="160px" label="执行备注"></el-table-column>
      <el-table-column label="操作" min-width="160px" max-width="260px">
        <template slot-scope="scope">
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
    <clear ref="clear" :clearFun="clearSubmit"></clear>
  </div>
</template>

<script>
import query from "./query";
import add from "./add";
import edit from "./edit";
import clear from "./clear";
import * as api from "@/api/dispatch-api.js";
import { statusFormat, resStatus } from "@/utils/format";
// import cronUtil from "@/utils/cronUtil";
import moment from "moment";

export default {
  components: { query, add, edit, clear },
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
      clearFormVisible: false, //清理界面
      pageParams: {
        current: 1,
        size: 10
      },
      pageParams2: {
        current: 1,
        size: 10,
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
      selectedIds: [],
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // this.refreshTable(this.pageParams);
  },
  methods: {
    //查看调度备注
    handleCheck(index, row) {
      this.$confirm(row, "调度备注", {
        showCancelButton: false,
        dangerouslyUseHTMLString: true
      });
    },
    //根据时间清理日志
    handleClear(data1, data2) {
      this.clearFormVisible = true;
      this.$refs.clear.show(data1, data2);
    },
    // 提交日志清理
    clearSubmit(clearForm) {
      this.api.clearLog(clearForm).then(res => {
        resStatus(res.retcode, "日志清理成功", "日志清理失败");
      });
    },
    //触发分页
    handleCurrentChange(val) {
      this.pageParams2.current = val;
      this.refreshTable(this.pageParams2);
    },
    //触发页行数
    handleSizeChange(val) {
      this.pageParams2.size = val;
      this.refreshTable(this.pageParams2);
    },
    //获取列表
    refreshTable(val) {
      console.warn(val);
      this.listLoading = true;
      this.api.paged(val).then(res => {
        const { bizdata } = res;
        const { data } = bizdata;
        this.tableMapping = data;
        this.total = bizdata.total;
        this.listLoading = false;
      });
    },
    //条件查询
    querySubmit(addQueryParmas) {
      // 任务页面跳转到日志页面，路由跳转参数传递，什么时候知道是跳转的参数

      var o = { ...addQueryParmas };
      this.refreshTable({
        ...this.pageParams,
        ...o
      });
      console.warn(o);
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
        this.refreshTable(this.pageParams2);
      });
    },
    //编辑
    editSubmit(editForm) {
      console.warn("编辑", editForm);
      this.api.updated(editForm).then(res => {
        resStatus(res.retcode, "编辑成功", "编辑失败");
        this.refreshTable(this.pageParams2);
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
            this.refreshTable(this.pageParams2);
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
            this.refreshTable(this.pageParams2);
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar.header {
  margin: 0px;
  padding: 0px;
}
.operation_bg_color {
  background-color: #367fa9;
  color: #fff;
}
.rowCheck {
  color: #2cafff;
  text-align: center;
  margin: 0 auto;
}
.rowTriggerCode {
  color: red;
}
</style>