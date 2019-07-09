<template>
  <d2-container>
    <template slot="header">{{$route.meta.title}}</template>
    <el-row  type="flex" class="d2-mb" :gutter="24" justify="space-between">
      <el-col :span="12">
        <el-button type="info" icon="el-icon-arrow-left" class="d2-fl" @click="$router.back()" plain size="small">返回</el-button>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <el-col :span="18">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="管理员名称">
            <el-input size="small" v-model="form.manager_name"></el-input>
          </el-form-item>
          <el-form-item label="管理员账号">
            <el-input size="small" v-model="form.manager_account"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" v-if="operateType=='add'">
            <el-input size="small" type="password" v-model="password"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码" v-else>
            <el-input size="small" type="password" v-model="passwordText"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input size="small" v-model="form.manager_mobile"></el-input>
          </el-form-item>
          <el-form-item label="权限设置">
            <el-select size="small" v-model="group" @change="handleSelect">
              <el-option v-for="(item,i) in role" :key="i" :label="item.title" :value="item.id" :checked="group==item.id" border></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch size="small" v-model="form.status.val"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{operateType=='add'?'立即创建':'立即保存'}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex';
import {toBoolean,toOne} from '@/api/tool'
export default {
  name: 'page1',
  data(){
    return {
      form:{
        "id":"",
        "manager_name":"",
        "manager_account":"",
        "manager_mobile":"",
        "manager_avatar":"",
        "login_num":"",
        "status":[{
          "val":"",
          "text":"",
        }],
        "group":[]
      },
      role:[],
      group:'',
      password:'',
      passwordText:'*******',
      operateType:'',
      loading:true
    }
  },
  methods: {
    ...mapActions('d2admin/common',['formSubmit','getData']),
    onSubmit(){
      let {status,manager_account,manager_mobile,manager_name,id} = this.form;
      let formData = {
        group:[this.group],
        status,
        account:manager_account,
        mobile:manager_mobile,
        username:manager_name,
        password:this.password};
      formData.status = toOne(formData.status,1,0);
      if(this.operateType=='edit'){
        formData.id = id;
        formData.password = this.passwordText;
      }
      this.formSubmit({
        vm:this,
        formData,
        url:this.operateType=='add'?'/admin/manager/add':'/admin/manager/edit',
        goback:true
      }).then(res=>{
        
      }).catch(err=>{
        formData.status = toBoolean(formData.status,1);
      })
    },
    handleSelect(e){
      this.group = e;
    }
  },
  created() {
    let {id,type} = this.$route.query;
    this.operateType = type;
    this.form.id = id;
    this.getData({
      vm:this,
      url:'/admin/manager/detail',
      data:{id:id,type:type}
    }).then(res=>{
      let {admin,role} = res.data;
      let {status} =  admin;
      if(typeof admin=='object'&&admin.group){
        this.form = admin;
        if(status){
          status.val = toBoolean(status.val,1);
        }
        if(admin.group.length>0){
          this.group = admin.group[0].id;
        }
      }
      if(typeof role=='object'){
        this.role = role;
      }
    })  
  },
}
</script>
