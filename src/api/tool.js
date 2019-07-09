export function getDataString(data){
  let str = '?';
  for(let i in data){
    str+=i+'='+data[i]+'&'
  } 
  return str
}

export function toBoolean(data,toTrue) {
  if(data==toTrue){
    return true
  }else{
    return false
  }
}

export function toOne(data,num1,num2) {
  if(data){
    return num1
  }else{
    return num2
  }
}