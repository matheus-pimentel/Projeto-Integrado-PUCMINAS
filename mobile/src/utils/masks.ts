export function maskValue(value: string) {
  value = value.replace(/\D/g, "");
  
  return (Number(value)/100).toFixed(2).replace(".",",");
}

export function maskDate(value: string) {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{2})(\d)/g, "$1/$2");

  if(value.length > 5) {
    value = value.split("/")[0] + "/" + value.split("/")[1].replace(/^(\d{2})(\d)/g, "$1/$2");
  }

  return value;
}

export function maskRealNumber(value) {
  var value = value.toFixed(2).split('.');
  value[0] = value[0].split(/(?=(?:...)*$)/).join('.');
  return value.join(',');
}