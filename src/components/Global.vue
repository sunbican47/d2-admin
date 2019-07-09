<script type="text/javaScript">
const sexArray = [{ name: 1, label: "男" }, { name: 0, label: "女" }];
//  0 删除  1 正常 2禁用
const statusArray = [
  { name: 0, label: "删除" },
  { name: 1, label: "正常" },
  { name: 2, label: "禁用" }
];
const executorRouteStrategyArray = [
  { name: "First", label: "第一个" },
  { name: "Last", label: "最后一个" },
  { name: "Round", label: "轮询" },
  { name: "Random", label: "随机" },
  { name: "CONSISTENT_HASH", label: "一致性HASH" },
  { name: "Least_Frequently_Used", label: "最不经常使用" },
  { name: "Least_Recently_Used", label: "最近最久不使用" },
  { name: "Failover", label: "故障转移" },
  { name: "Busyover", label: "忙碌转移" },
  { name: "Sharding_Broadcast", label: "分片广播" }
];
const executorBlockStrategyArray = [
  { name: "SERIAL_EXECUTION", label: "单机串行" },
  { name: "DISCARD_LATER", label: "丢弃后续调度" },
  { name: "COVER_EARLY", label: "覆盖之前调度" }
];
const glueTypeArray = [
  { name: "BEAN", label: "BEAN" },
  { name: "GLUE_GROOVY", label: "GLUE(Java)" },
  { name: "GLUE_SHELL", label: "GLUE(Shell)" },
  { name: "GLUE_PYTHON", label: "GLUE(Python)" },
  { name: "GLUE_PHP", label: "GLUE(PHP)" },
  { name: "GLUE_NODEJS", label: "GLUE(Nodejs)" },
  { name: "GLUE_POWERSHELL", label: "GLUE(PowerShell)" }
];
const joblogClearTypeArray = [
  { name: 1, label: "清理一个月之前日志数据" },
  { name: 2, label: "清理三个月之前日志数据" },
  { name: 3, label: "清理六个月之前日志数据" },
  { name: 4, label: "清理一年之前日志数据" },
  { name: 5, label: "清理一千条以前前日志数据" },
  { name: 6, label: "清理一万条以前日志数据" },
  { name: 7, label: "清理三万条以前日志数据" },
  { name: 8, label: "清理十万条以前日志数据" },
  { name: 9, label: "清理所有日志数据" }
];
export default {
  sexArray,
  statusArray,
  executorRouteStrategyArray,
  executorBlockStrategyArray,
  glueTypeArray,
  joblogClearTypeArray
};
</script>