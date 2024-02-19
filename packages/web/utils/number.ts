export function formatDownloadNum(num: number) {
  // 将数字转为字符串
  const strNum = num.toString();
  // 如果数字超过 1000
  if (strNum.length > 3) {
    // 用 k 替换最后三个字符
    const formattedNum = strNum.slice(0, -3) + "k";
    return formattedNum;
  } else {
    return strNum;
  }
}
