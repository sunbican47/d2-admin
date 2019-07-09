<template>
  <div class="chart-container">
    <template slot="header">{{$route.meta.title}}</template>
    <ul class="getCounts">
      <li id="task">
        <i class="el-icon-s-flag"></i>
        <div class="info-box-content">
          <span class="info-box-text">任务数量</span>
          <span class="info-box-number">{{taskCount.jobInfoCount}}</span>
          <div class="progress">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
          <span class="progress-description">调度中心运行的任务数量</span>
        </div>
      </li>
      <li id="dispatch" class="haveDistinct">
        <i class="el-icon-document"></i>
        <div class="info-box-content">
          <span class="info-box-text">调度次数</span>
          <span class="info-box-number">{{taskCount.jobLogCount}}</span>
          <div class="progress">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
          <span class="progress-description">调度中心触发的调度次数</span>
        </div>
      </li>
      <li id="executor">
        <i class="el-icon-s-operation"></i>
        <div class="info-box-content">
          <span class="info-box-text">执行器数量</span>
          <span class="info-box-number">{{taskCount.executorCount}}</span>
          <div class="progress">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
          <span class="progress-description">调度中心在线的执行器机器数量</span>
        </div>
      </li>
    </ul>
    <div class="row">
      <div class="box">
        <div class="box-header with-border">
          <p class="box-title">调度报表</p>
          <div class="pull-right box-tools">
            <el-row>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-date change_size"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(sele,index) in selectDateTime"
                    :key="index"
                    :class="knewDateTime==sele?'selectDateTime':''"
                    :command="sele"
                    icon="el-icon-date"
                  >{{sele}}</el-dropdown-item>
                  <div id="guding">
                    <el-date-picker
                      v-model="value2"
                      id="ce"
                      type="datetimerange"
                      @change="yy"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      align="right"
                    ></el-date-picker>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </el-row>
          </div>
        </div>
        <div class="box-body">
          <ul class="picture">
            <!-- 左侧折线图 -->
            <li class="line_picture" id="lineChart" style="height: 350px;">
              <!-- <div ></div> -->
            </li>
            <!-- 右侧饼图 -->
            <li class="garden_picture" id="pieChart" style="height: 350px;">
              <!-- <div ></div> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import * as common from "../../../utils/common.js";
import * as api from "../../../api/runningEchart-api.js";
export default {
  data() {
    return {
      api,
      common,
      gg: true,
      chartColumn: null,
      chartBar: null,
      chartLine: null,
      chartPie: null,
      taskCount: {
        executorCount: "",
        jobInfoCount: "",
        jobLogCount: "",
        jobLogSuccessCount: ""
      },
      selectDateTime: [
        "今日",
        "昨日",
        "本月",
        "上个月",
        "最近一周",
        "最近一月",
        "自定义"
      ],
      knewDateTime: "最近一周",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: ""
    };
  },

  mounted: function() {
    this.freshChartInit();
    this.refreshTaskCount();
  },
  methods: {
    refreshTaskCount() {
      this.api.taskCount().then(res => {
        console.warn(res);
        const { bizdata } = res;
        console.warn(bizdata);
        this.taskCount = bizdata;
        console.warn(this.taskCount);
      });
    },
    freshChartInit() {
      let obj = {};
      obj = common.returnDateTime(this.knewDateTime);
      this.api.chartInfo(obj).then(res => {
        this.lineChartInit(res);
        this.pieChartInit(res);
      });
    },
    lineChartInit(data) {
      const { bizdata } = data;
      var chartColumn = echarts.init(document.getElementById("lineChart"));
      chartColumn.setOption({
        title: {
          text: "日期分布图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["成功", "失败", "进行中"]
        },
        toolbox: {
          feature: {}
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: bizdata.content.triggerDayList
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "成功",
            type: "line",
            stack: "Total",
            areaStyle: { normal: {} },
            data: bizdata.content.triggerDayCountSucList
          },
          {
            name: "失败",
            type: "line",
            stack: "Total",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: bizdata.content.triggerDayCountFailList
          },
          {
            name: "进行中",
            type: "line",
            stack: "Total",
            areaStyle: { normal: {} },
            data: bizdata.content.triggerDayCountRunningList
          }
        ],
        color: ["#00A65A", "#c23632", "#F39C12"]
      });
    },
    pieChartInit(data) {
      const { bizdata } = data;
      var option = {
        title: {
          text: "成功比例图",
          x: "center",
          align: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["成功", "失败", "进行中"]
        },
        series: [
          {
            //name: '分布比例',
            type: "pie",
            radius: "55%",
            center: ["56%", "60%"],
            data: [
              {
                name: "成功",
                value: bizdata.content.triggerCountSucTotal
              },
              {
                name: "失败",
                value: bizdata.content.triggerCountFailTotal
              },
              {
                name: "进行中",
                value: bizdata.content.triggerCountRunningTotal
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        color: ["#00A65A", "#c23632", "#F39C12"]
      };
      var pieChart = echarts.init(document.getElementById("pieChart"));
      pieChart.setOption(option);
    },
    handleCommand(command) {
      this.knewDateTime = command;
      if (this.knewDateTime == "自定义") {
        document.querySelectorAll("#c")[0].focus();
        console.warn(this.value2);
      }
      this.freshChartInit();
    },
    yy(date) {
      let obj = {};
      obj = {
        startDate: this.value2[0],
        endDate: this.value2[1]
      };
      console.warn(obj);
      this.api.chartInfo(obj).then(res => {
        this.lineChartInit(res);
        this.pieChartInit(res);
      });
    }
  }
  // updated: function() {
  //   this.freshChartInit();
  // }
};
</script>

<style lang="scss" scoped>
.getCounts {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 0px -20px;
  align-content: flex-start;

  padding: 0px;
  li {
    flex: 1;
    flex-basis: 200px;
    height: 92px;
    margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 15px;
    box-sizing: border-box;
    border-radius: 3px;
  }
  #task {
    background-color: #00c0ef;
  }
  #dispatch {
    background-color: #f39c12;
  }
  #executor {
    background-color: #00a65a;
  }
}

.el-col {
  padding: 30px 20px;
}
.el-icon-s-flag,
.el-icon-document,
.el-icon-s-operation {
  float: left;
  width: 92px;
  line-height: 92px;
  font-size: 45px;
  text-align: center;
  vertical-align: middle;
  font-weight: 400;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
}
.info-box-text {
  text-transform: uppercase;
  margin-top: 8px;
}
.info-box-content {
  color: #fff;
  width: 100%;
  display: block;
  height: 92px;
}
.info-box-text,
.progress-description,
.info-box-number {
  display: block;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 8px;
}
.info-box-number {
  margin-top: 6px;
  margin-bottom: 6px;
  font-size: 18px;
}
.progress-description {
  margin-top: 6px;
}
.progress {
  display: block;
  overflow: hidden;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 2px solid #fff;
}
.box-header.with-border {
  padding: 12px 0px;
  border-bottom: 1px solid #d2d6de;
}
.box-title {
  display: inline;
  padding-left: 8px;
  font-size: 18px;
}
.pull-right.box-tools {
  float: right;
  display: inline;
}
.row {
  background-color: #fff;
  margin: -5px;
}
.picture {
  list-style: none;
  padding: 0px;
  display: flex;
}
.line_picture {
  flex-grow: 2;
  flex-shrink: 2;
  flex-basis: 400px;
}
.garden_picture {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 200px;
}
.el-icon-date.change_size {
  font-size: 32px !important;
  vertical-align: middle;
  margin-top: -4px;
  padding-right: 8px;
}
.selectDateTime {
  background-color: #ecf5ff;
}

.el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange {
  height: 0px !important;
  width: 0px !important;
  padding: 0px !important;
  margin: 0px !important;
  position: absolute;
  opacity: 0;
  top: 368px !important;
  right: 134px !important;
}
.el-range-separator {
  margin-top: -20px;
}
</style>
