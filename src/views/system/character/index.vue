<template>
  <d2-container>
    <template slot="header">{{$route.meta.title}}</template>
    <el-row  type="flex" class="d2-mb" :gutter="24" justify="space-between">
      <el-col :span="12"></el-col>
      <el-col :span="12">
        <el-button type="success" class="d2-fr" @click="goto('','add')" plain size="small">添加角色</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="listData.data"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="角色名称"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          min-width="15%">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="primary" @click="goto(scope,'edit')" plain size="small">编辑</el-button>
            <el-button type="danger" plain size="small" v-if="scope.row.id!=1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <div class="tc d2-mt">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="listData.current_page"
        :page-size="listData.size"
        size="small"
        layout="prev, pager, next, jumper"
        :total="Number(listData.total)">
      </el-pagination>
    </div>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'page1',
  data(){
    return {
      listData:{
        size:20,
        search:'',
        page:1,
        current_page:1,
        total:0,
        data:[]
      },
      options:[]
    }
  },
  methods: {
    ...mapActions('d2admin/common',['getList']),
    requestAdminList(_this){
      this.getList({
        vm:_this,
        url:'/admin/manager/role_list'
      }).then(res=>{

      })
    },
    handleCurrentChange(val){
      this.listData.page = val;
      this.requestAdminList(this)
    },
    goto(scope,type){
      let id;
      if(scope.row){
        id = scope.row.id
      }else{
        id = ''
      }
      this.$router.push('characteroperate?type='+type+'&id='+id)
    }
  },
  created() {
    this.requestAdminList(this);
  },
  
}
</script>
