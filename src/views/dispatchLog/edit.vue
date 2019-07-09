<template>
  <div>
    <!--编辑界面-->
    <el-dialog width="900px" title="编辑" :visible.sync="drawerVisite">
      <el-form
        :inline="true"
        ref="editForm"
        label-width="150px"
        label-position="right"
        :model="editForm"
        :rules="editFormRules"
        class="demo-form-inline"
      >
        <el-form-item label="执行器" prop="jobGroup">
          <el-select v-model="editForm.jobGroup" placeholder="请选择执行器">
            <el-option
              v-for="(item,index) in allTable"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="jobDesc">
          <el-input v-model="editForm.jobDesc" placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item label="路由策略" prop="executorRouteStrategy">
          <el-select v-model="editForm.executorRouteStrategy" placeholder="请选择路由策略">
            <el-option
              v-for="(item,index) in this.GLOBAL.executorRouteStrategyArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cron" prop="jobCron">
          <el-input v-model="editForm.jobCron" placeholder="请输入Cron"></el-input>
        </el-form-item>
        <el-form-item label="运行模式" prop="glueType">
          <el-select v-model="editForm.glueType" placeholder="请选择运行模式">
            <el-option
              v-for="(item,index) in this.GLOBAL.glueTypeArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="JobHandler" prop="executorHandler">
          <el-input v-model="editForm.executorHandler" placeholder="请输入JobHandler"></el-input>
        </el-form-item>
        <el-form-item label="阻塞处理策略" prop="executorBlockStrategy">
          <el-select v-model="editForm.executorBlockStrategy" placeholder="请选择阻塞处理策略">
            <el-option
              v-for="(item,index) in this.GLOBAL.executorBlockStrategyArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子任务ID" prop="childJobId">
          <el-input v-model="editForm.childJobId" placeholder="请输入子任务的任务ID，如存在多个则逗号分割"></el-input>
        </el-form-item>
        <el-form-item label="任务超时时间" prop="executorTimeout">
          <el-input v-model="editForm.executorTimeout" placeholder="任务超时时间，单位秒，大于零时生效"></el-input>
        </el-form-item>
        <el-form-item label="失败重试次数" prop="executorFailRetryCount">
          <el-input v-model="editForm.executorFailRetryCount" placeholder="失败重新次数，大于零时生效"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="author">
          <el-input v-model="editForm.author" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item label="报警邮件" prop="alarmEmail">
          <el-input v-model="editForm.alarmEmail" placeholder="请输入报警邮件,多个邮件地址则逗号分割"></el-input>
        </el-form-item>
        <el-form-item label="任务参数" prop="executorParam">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="editForm.executorParam"
            placeholder="请输入任务参数"
          ></el-input>
        </el-form-item>
      </el-form>
      <drawerForm
        slot="footer"
        class="dialog-footer"
        ref="drawerForm"
        :drawerVisiteFun="drawerVisite"
        :getChildrenStatus="getChildrenStatus"
        :onSubmitFun="onSubmit"
        title="编辑用户"
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
  name: "edit",
  data() {
    return {
      editForm: {},
      allTable: [],
      drawerVisite: false,
      editFormRules: {
        jobGroup: [
          { required: true, message: "请选择执行器", trigger: "blur" }
        ],
        jobDesc: [
          { required: true, message: "请输入任务描述", trigger: "blur" }
        ],
        executorRouteStrategy: [
          { required: true, message: "请选择路由策略", trigger: "blur" }
        ],
        jobCron: [{ required: true, message: "请输入Cron", trigger: "blur" }],
        glueType: [
          { required: true, message: "请选择运行模式", trigger: "blur" }
        ],
        executorHandler: [
          { required: true, message: "请输入JobHandler", trigger: "blur" }
        ],
        executorBlockStrategy: [
          { required: true, message: "请选择阻塞处理策略", trigger: "blur" }
        ],
        author: [{ required: true, message: "请输入负责人", trigger: "blur" }]
      }
    };
  },
  props: {
    editFun: {
      type: Function
    }
  },
  methods: {
    getChildrenStatus(data) {
      this.drawerVisite = data;
    },
    // 显示编辑
    show(item) {
      this.drawerVisite = true;
      console.log("编辑的对象是: " + JSON.stringify(item));
      this.editForm = lodash.cloneDeep(item);
      console.log("编辑的对象是: " + JSON.stringify(this.editForm));
      // this.editForm = item;
      searchAll().then(res => {
        const { bizdata } = res;
        this.allTable = bizdata;
      });
    },
    onSubmit() {
      //表单校验
      this.$refs["editForm"].validate(valid => {
        console.log("valid: " + valid);
        console.log("editForm: " + JSON.stringify(this.editForm));
        if (valid) {
          this.editFun(this.editForm);
          this.$refs.drawerForm.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select,
.el-date-editor {
  width: 100% !important;
}
.el-input {
  width: 223px !important;
}
.el-textarea {
  width: 610px !important;
}
</style>
