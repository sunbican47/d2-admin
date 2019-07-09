<template>
  <div class="addBody">
    <el-dialog width="600px" title="添加" :visible.sync="drawerVisite">
      <el-form
        :inline="true"
        ref="addForm"
        label-width="100px"
        label-position="right"
        :model="addForm"
        :rules="addFormRules"
        class="demo-form-inline"
      >
        <el-form-item label="AppName" prop="appName">
          <el-input minlength="4" v-model="addForm.appName" placeholder="请输入AppName"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input minlength="4" v-model="addForm.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input type="number" v-model="addForm.order" min="1" placeholder="请选择排序"></el-input>
        </el-form-item>
        <el-form-item label="注册方式" prop="addressType">
          <el-radio v-model="addForm.addressType" label="0">自动注册</el-radio>
          <el-radio v-model="addForm.addressType" label="1">手动注册</el-radio>
          <!-- <el-radio @change="addForm.addressType=0" v-model="radio" label="0">自动注册</el-radio>
          <el-radio @change="addForm.addressType=1" v-model="radio" label="1">手动注册</el-radio>-->
        </el-form-item>
        <el-form-item label="机器地址" prop="addressList">
          <el-input
            type="textarea"
            :disabled="addForm.addressType==0"
            :autosize="{ minRows: 4}"
            v-model="addForm.addressList"
            placeholder="请输入执行器地址列表，多地址逗号分隔"
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
        appName: "",
        title: "",
        order: "",
        addressType: "0",
        addressList: ""
      },
      addFormRules: {
        appName: [
          {
            required: true,
            validator: this.validateAppName,
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            validator: this.validateTitle,
            trigger: "blur"
          }
        ],
        order: [{ required: true, message: "请选择排序", trigger: "blur" }],
        addressType: [
          { required: true, message: "请选择注册方式", trigger: "blur" }
        ]
        // addressList: [
        //   {
        //     required: true,
        //     message: "请输入执行器地址列表，多地址逗号分隔",
        //     trigger: "blur"
        //   }
        // ]
      },
      drawerVisite: false,
      allTable: [],
      radio: "0"
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
    validateAppName(rule, value, callback) {
      if (value.length >= 4 && value.length <= 64) {
        var valid = /^[a-z][a-zA-Z0-9-]*$/;
        if (!valid.test(value))
          callback(
            new Error("限制以小写字母开头，由小写字母、数字和中划线组成~64")
          );
        callback();
      } else {
        return callback(new Error("AppName长度限制为4~64"));
      }
    },
    validateTitle(rule, value, callback) {
      if (value.length < 4 || value.length > 12) {
        return callback(new Error("名称长度限制为4~12"));
      }
      callback();
    },
    getChildrenStatus(data) {
      this.drawerVisite = data;
    },
    show() {
      this.addForm = {
        appName: "",
        title: "",
        order: "",
        addressType: "0",
        addressList: ""
      };
      this.addForm.addressType = this.addForm.addressType.toString();
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

<style scoped>
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
  width: 400px !important;
}
.el-textarea {
  width: 400px !important;
}
</style>
