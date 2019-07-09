<template>
  <div class="addBody">
    <el-dialog width="900px" title="添加" :visible.sync="drawerVisite">
      <el-form
        :inline="true"
        ref="addForm"
        label-width="150px"
        label-position="right"
        :model="addForm"
        :rules="addFormRules"
        class="demo-form-inline"
      >
        <el-form-item label="执行器" prop="jobGroup">
          <el-select v-model="addForm.jobGroup" placeholder="请选择执行器">
            <el-option
              v-for="(item,index) in allTable"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务描述" prop="jobDesc">
          <el-input v-model="addForm.jobDesc" placeholder="请输入任务描述"></el-input>
        </el-form-item>
        <el-form-item label="路由策略" prop="executorRouteStrategy">
          <el-select v-model="addForm.executorRouteStrategy" placeholder="请选择路由策略">
            <el-option
              v-for="(item,index) in this.GLOBAL.executorRouteStrategyArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cron" prop="jobCron">
          <el-input v-model="addForm.jobCron" placeholder="请输入Cron"></el-input>
        </el-form-item>
        <el-form-item label="运行模式" prop="glueType">
          <el-select v-model="addForm.glueType" placeholder="请选择运行模式">
            <el-option
              v-for="(item,index) in this.GLOBAL.glueTypeArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="JobHandler" prop="executorHandler">
          <el-input v-model="addForm.executorHandler" placeholder="请输入JobHandler"></el-input>
        </el-form-item>
        <el-form-item label="阻塞处理策略" prop="executorBlockStrategy">
          <el-select v-model="addForm.executorBlockStrategy" placeholder="请选择阻塞处理策略">
            <el-option
              v-for="(item,index) in this.GLOBAL.executorBlockStrategyArray"
              :key="index"
              :label="item.label"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子任务ID" prop="childJobId">
          <el-input v-model="addForm.childJobId" placeholder="请输入子任务的任务ID，如存在多个则逗号分割"></el-input>
        </el-form-item>
        <el-form-item label="任务超时时间" prop="executorTimeout">
          <el-input v-model="addForm.executorTimeout" placeholder="任务超时时间，单位秒，大于零时生效"></el-input>
        </el-form-item>
        <el-form-item label="失败重试次数" prop="executorFailRetryCount">
          <el-input v-model="addForm.executorFailRetryCount" placeholder="失败重新次数，大于零时生效"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="author">
          <el-input v-model="addForm.author" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item label="报警邮件" prop="alarmEmail">
          <el-input v-model="addForm.alarmEmail" placeholder="请输入报警邮件,多个邮件地址则逗号分割"></el-input>
        </el-form-item>
        <el-form-item label="任务参数" prop="executorParam">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="addForm.executorParam"
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
        title="添加用户"
      ></drawerForm>
    </el-dialog>
  </div>
</template>

<script>
import drawerForm from "@/components/drawerForm";
import { searchAll } from "@/api/executorManager-api.js";
export default {
  components: { drawerForm },
  name: "add",
  data() {
    return {
      addForm: {
        jobGroup: "",
        jobDesc: "",
        executorRouteStrategy: "",
        jobCron: "",
        glueType: "",
        executorHandler: "",
        executorBlockStrategy: "",
        childJobId: "",
        executorTimeout: "",
        executorFailRetryCount: "",
        author: "",
        alarmEmail: "",
        executorParam: ""
      },
      addFormRules: {
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
      },
      drawerVisite: false,
      allTable: []
    };
  },
  props: {
    addFun: {
      type: Function,
      default() {
        return [];
      }
    }
  },
  methods: {
    getChildrenStatus(data) {
      this.drawerVisite = data;
    },
    show() {
      this.addForm = {};
      this.drawerVisite = true;
      searchAll().then(res => {
        const { bizdata } = res;
        this.allTable = bizdata;
      });
    },
    onSubmit() {
      //表单校验
      this.$refs["addForm"].validate(valid => {
        console.log("valid: " + valid);
        console.log("addForm: " + JSON.stringify(this.addForm));
        if (valid) {
          this.addFun(this.addForm);
          this.$refs.drawerForm.close();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.addBody {
  height: 100%;
  overflow: auto;
  padding-bottom: 50px;
  padding-right: 16px;
}
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
