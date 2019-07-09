<template>
  <div>
    <!--页面头部-->
    <el-col :span="24" class="toolbar header" style="padding-bottom: 0px;">
      <el-button class="add" type="success" @click="handleAdd">新增执行器</el-button>
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
      <el-table-column prop="order" min-width="120px" max-width="160px" label="排序" sortable></el-table-column>
      <el-table-column prop="appName" min-width="160px" max-width="200px" label="AppName"></el-table-column>
      <el-table-column prop="title" min-width="120px" max-width="160px" label="名称"></el-table-column>
      <el-table-column prop="addressType" min-width="120px" max-width="160px" label="注册方式">
        <template slot-scope="scope">
          <span class="rowCheck">{{scope.row.addressType==0?"自动注册":"手动注册"}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="addressList" min-width="120px" max-width="160px" label="OnLine机器地址">
        <template slot-scope="scope">
          <span
            class="rowCheck"
            style="backgroundColor:#2CB044;color:#fff"
          >{{scope.row.addressList}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="addressList" min-width="120px" max-width="160px" label="OnLine机器地址">
        <!-- :formatter="addressListSplit" -->
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.addressList" :key="index">
            <p v-if="item==','"></p>
            <span v-else>{{item}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="260px" max-width="360px">
        <template slot-scope="scope">
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
import * as api from "@/api/executorManager-api.js";
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
      pageParams: { current: 1, size: 10 },
      selectedIds: [],
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      rr: [2, 34, 4]
    };
  },
  mounted() {
    this.refreshTable(this.pageParams);
  },
  methods: {
    handleExecute() {
      console.warn("执行");
    },
    handleOperation() {
      console.warn("启定停止");
    },
    handleLog() {
      console.warn("日志");
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

<style lang="scss" scoped>
.toolbar.header {
  margin: 0px;
  padding: 0px;
  margin-bottom: 8px;
}
.operation_bg_color {
  background-color: #367fa9;
  color: #fff;
}
</style>