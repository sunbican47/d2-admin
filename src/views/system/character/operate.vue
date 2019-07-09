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
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item prop="title" label="角色名称">
            <el-input size="small" :disabled="form.id==1" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input size="small" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="权限设置" v-if="form.id!=1">
            <div class="rule-main" v-for="(item,i) in node" :key="i"> 
              <p class="d2-clear-right">
                <span class="d2-fl" :class="{'czt':item.checked==1}">
                {{item.title}}
                </span>
                <span class="d2-fr pointer" :class="{'czt':item.checked==1}" @click="handleSelect({p1:i},'greatparent')">
                  {{item.checked==0?'全选':'取消'}}
                  <i class="el-icon-check" v-if="item.checked==0"></i>
                  <i class="el-icon-close" v-else></i>
                </span>
              </p>
              <div class="rule-view d2-clear-right" v-for="(items,ii) in item.child" :key="ii">
                <p>
                  <span class="rule-child bound" :class="{'checked':items.checked==1}" @click="handleSelect({p1:i,p2:ii},'parent')">
                    {{items.title}}
                    <i class="el-icon-check" v-if="items.checked==1"></i>
                    <i class="el-icon-close" v-else></i>
                    </span>
                </p>
                <div class="rule-child-view d2-w100">
                  <span class="rule-child bound" :class="{'checked':itemschild.checked==1}" v-for="(itemschild,iii) in items.child" :key="iii" @click="handleSelect({p1:i,p2:ii,p3:iii},'son')">
                    {{itemschild.title}}
                    <i class="el-icon-check" v-if="itemschild.checked==1"></i>
                    <i class="el-icon-close" v-else></i>
                  </span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="权限设置" v-else>
            <p class="cwarning">全部权限，无需修改</p>
          </el-form-item>
          <el-form-item label="是否开启" v-if="form.id!=1">
            <el-switch size="small" v-model="form.status"></el-switch>
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
        status:true,
        remark:'',
        title:''
      },
      node:[],
      loading:true,
      rules: {
        title: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    ...mapActions('d2admin/common',['formSubmit','getData']),
     onSubmit(){
       this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          let nodes = this.node;
          let {status,remark,title,id} = this.form;
          let formData = {status,remark,title};
          let nodesarr = [];
          formData.status = toOne(formData.status,1,0);
          for(let i in nodes){  
            if(nodes[i].checked==1){
              nodesarr.push(nodes[i].id);
              for(let j in nodes[i].child){
                let nodechild = nodes[i].child[j];
                if(nodechild.checked==1){
                  nodesarr.push(nodechild.id);
                  for(let k in nodechild.child){
                    if(nodechild.child[k].checked==1){
                      nodesarr.push(nodechild.child[k].id);
                    }
                  }
                }
              }
            }
          }
          formData.rules = nodesarr;
          if(this.operateType=='edit'){
            formData.id = id;
          }
          this.formSubmit({
            vm:this,
            formData,
            url:this.operateType=='add'?'/admin/manager/add_role':'/admin/manager/edit_role',
            goback:true
          }).then(res=>{
            
          }).catch(err=>{
            this.loading = false;
            formData.status = toBoolean(formData.status,1);
          })
        }else{
          this.$message.error('请输入内容信息')
        }
      })
    },
    handleSelect(obj,p){
      let nodes = this.node;
      let pnode,pnode2,pnode3;
      pnode = nodes[obj.p1];
      if(obj.p2>=0){
        pnode2 = pnode.child[obj.p2];
      }
      if(obj.p3>=0){
        pnode3 = pnode2.child[obj.p3];
      }
      switch (p) {
        case 'greatparent':
          pnode.checked = pnode.checked==1?0:1;
          for(let j in pnode.child){
            let childs = pnode.child[j];
            childs.checked = pnode.checked;
            for(let k in childs.child){
              childs.child[k].checked = pnode.checked;
            }
          }
          break;
        case 'parent':
          pnode2.checked = pnode2.checked==1?0:1;
          pnode.checked = pnode2.checked==1?1:0;
          for(let n in pnode2.child){
            pnode2.child[n].checked = pnode2.checked;
          }
          break;
        case 'son':
          pnode3.checked = pnode3.checked==1?0:1;
          let isSelectChild = false;
          if(pnode3.checked==1){
            isSelectChild = true;
          }else{
            for(let m in pnode2.child){
              if(pnode2.child[m].checked==1){
                isSelectChild = true
              }
            }
          }
          pnode.checked = isSelectChild?1:0;
          pnode2.checked = isSelectChild?1:0;
          
          break;  
        default:

          break;
      }
      console.log(nodes)
      this.node = nodes;
    }
  },
  created() {
    let {id,type} = this.$route.query;
    this.operateType = type;
    this.form.id = id;
    this.getData({
      vm:this,
      url:'/admin/manager/role_detail',
      data:{id:id,type:type}
    }).then(res=>{
      let { node,group } = res.data;
      this.node = node;
      if(type=='edit'){
        this.form.title = group.title;
        this.form.remark = group.remark;
        this.form.status = toBoolean(group.status,1);
      }
    })  
  },
}
</script>
<style lang="scss">
$czt:#409EFF;
.rule-main{-webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;}
.rule-view{border-bottom:1px solid #f2f2ff;}
.rule-child-view{margin-bottom: 4px;}
.rule-item,.rule-child{min-width: 80px;padding:8px 12px;border-radius: 4px;border:1px solid #e2e2e2;margin-right:10px;cursor: pointer;
transition: all 0.2s ease;font-size: 14px;color:#999;}
.rule-child{padding:6px 10px;font-size: 13px;}
.rule-item:hover,.rule-child:hover{border:1px solid $czt;color:$czt;transform: scale(1.1);}
.rule-item.checked,.rule-child.checked{border:1px solid $czt;color:$czt;}
</style>

