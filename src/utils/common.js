import moment from "moment";
export function returnDateTime(knewDateTime) {
  let obj = {};
  if (knewDateTime == "今日") {
    obj = {
      startDate: moment()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  } else if (knewDateTime == "昨日") {
    obj = {
      startDate: moment()
        .subtract(1, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .subtract(1, "days")
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  } else if (knewDateTime == "本月") {
    obj = {
      startDate: moment()
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  } else if (knewDateTime == "上个月") {
    obj = {
      startDate: moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  } else if (knewDateTime == "最近一周") {
    obj = {
      startDate: moment()
        .subtract(1, "weeks")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  } else if (knewDateTime == "最近一月") {
    obj = {
      startDate: moment()
        .subtract(1, "months")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    };
  }
  return obj;
}
