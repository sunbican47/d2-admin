 
 <template>
  <div class="addBody">
    <el-dialog width="600px" title="添加" :visible.sync="drawerVisite">
      <el-form
        :inline="true"
        ref="editForm"
        label-width="100px"
        label-position="right"
        :model="editForm"
        :rules="editFormRules"
        class="demo-form-inline"
      >
        <el-form-item label="AppName" prop="appName">
          <el-input v-model="editForm.appName" placeholder="请输入AppName"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input type="number" v-model="editForm.order" min="1" placeholder="请选择排序"></el-input>
        </el-form-item>
        <el-form-item label="注册方式" prop="addressType">
          <el-radio v-model="editForm.addressType" label="0">自动注册</el-radio>
          <el-radio v-model="editForm.addressType" label="1">手动注册</el-radio>
        </el-form-item>
        <el-form-item label="机器地址" prop="addressList">
          <el-input
            type="textarea"
            :disabled="editForm.addressType==0"
            :autosize="{ minRows: 4}"
            v-model="editForm.addressList"
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
import lodash from "lodash";
import { searchAll } from "@/api/executorManager-api.js";
export default {
  components: { drawerForm },
  name: "edit",
  data() {
    return {
      editForm: {
        appName: "",
        title: "",
        order: "",
        addressType: "0",
        addressList: ""
      },
      editFormRules: {
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
    editFun: {
      type: Function
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
      } else {
        return callback(new Error("AppName长度限制为4~64"));
      }
    },
    validateTitle(rule, value, callback) {
      if (value.length < 4 || value.length > 12) {
        return callback(new Error("名称长度限制为4~12"));
      }
    },
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
      this.editForm.addressType = this.editForm.addressType.toString();
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
