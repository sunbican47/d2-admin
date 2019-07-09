import element from "element-ui";

export function statusFormat(val) {
  switch (val) {
    case 0:
      return "成功";
    case 1:
      return "失败";
    default:
      return "无";
  }
}

export function resStatus(retcode, success, error) {
  if (retcode === "000000") {
    element.Message.success(success);
  } else {
    element.Message.error(error);
  }
}
export function resStatusResult(retcode) {
  if (retcode === "000000") {
    return true;
  } else {
    return false;
  }
}
