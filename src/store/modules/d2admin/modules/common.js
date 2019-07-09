import {
  GetList,
  GetList_by_post,
  GetData,
  FormSubmit,
  DeleteItem
} from "../../../../api/sys.common";
export default {
  namespaced: true,
  actions: {
    /**
     * @description 获取列表
     * @param {String} url 接口
     * @param {boolean} hideData 是否忽略post参数
     * @param {Object} vm 实例
     * @param {Object} vm.listData 在vm中创建
     * @param {String} search 关键字
     * @param {Int} page：current_page 第几页
     * @param {Int} size 一页显示的个数
     */
    getList({ dispatch }, { vm, addData, url, hideData, method }) {
      return new Promise((resolve, reject) => {
        let ajaxdata = { url };
        if (!hideData) {
          let { page, size, search } = vm.listData;
          ajaxdata.listData = {
            size,
            search,
            page
          };
          if (addData) {
            for (let i in addData) {
              ajaxdata.listData[i] = addData[i];
            }
          }
        }
        if (method == "post") {
          GetList_by_post(ajaxdata)
            .then(async res => {
              if (!hideData) {
                for (let i in res.data) {
                  vm.listData[i] = res.data[i];
                }
              }
              vm.loading = false;
              resolve(res);
            })
            .catch(err => {
              console.log("err: ", err);
              vm.loading = false;
              reject(err);
            });
        } else {
          GetList(ajaxdata)
            .then(async res => {
              if (!hideData) {
                for (let i in res.data) {
                  vm.listData[i] = res.data[i];
                }
              }
              vm.loading = false;
              resolve(res);
            })
            .catch(err => {
              console.log("err: ", err);
              vm.loading = false;
              reject(err);
            });
        }
      });
    },
    /**
     * @description 获取信息
     * @param {Object} data ajax参数
     */
    getData({ dispatch }, { vm, url, data }) {
      return new Promise((resolve, reject) => {
        GetData(data, url)
          .then(async res => {
            vm.loading = false;
            resolve(res);
          })
          .catch(err => {
            vm.loading = false;
            console.log("err: ", err);
            reject(err);
          });
      });
    },
    /**
     * @description 删除
     * @param id
     */
    deleteItem({ dispatch }, { vm, url, data }) {
      return new Promise((resolve, reject) => {
        DeleteItem(data, url)
          .then(async res => {
            resolve(res);
            vm.loading = false;
          })
          .catch(err => {
            vm.loading = false;
            console.log("err: ", err);
            reject(err);
          });
      });
    },
    /**
     * @description 提交表单
     * @param {Object} vm.formData formData表单提交信息
     */
    formSubmit({ dispatch }, { vm, formData, url, goback }) {
      return new Promise((resolve, reject) => {
        FormSubmit(formData, url)
          .then(async res => {
            if (goback) {
              setTimeout(() => {
                vm.loading = false;
                vm.$router.back();
              }, 800);
            } else {
              vm.loading = false;
            }
            vm.$message({ type: "success", message: res.msg });
            resolve(res);
          })
          .catch(err => {
            vm.loading = false;
            console.log("err: ", err);
            reject(err);
          });
      });
    }
  }
};
