export const isString = (value: any): value is string => {
  return typeof value === "string";
};
export const isObject = (value: any): value is object => {
  return typeof value === "object" && value !== null;
};
export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};
export const isNumber = (value: any): value is number => {
  return typeof value === "number";
};
export const isBoolean = (value: any): value is boolean => {
  return typeof value === "boolean";
};
export const isArray = (value: any): value is Array<any> => {
  return Array.isArray(value);
};
