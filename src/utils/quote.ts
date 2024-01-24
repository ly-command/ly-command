// 定义特殊字符
const specialChar = "@@@";
export const unQuoteStr = (str: string) => {
  return specialChar + str;
};
export function quote(arg: string) {
  if (arg.startsWith(specialChar)) {
    return arg.slice(specialChar.length);
  }
  if (/^[a-z0-9/_.\-@:=]+$/i.test(arg) || arg === "") {
    return arg;
  }
  return (
    `$'` +
    arg
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\f/g, "\\f")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\v/g, "\\v")
      .replace(/\0/g, "\\0") +
    `'`
  );
}
