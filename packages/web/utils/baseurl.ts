export function withBaseUrl(url: string) {
  console.log(process.env.BASE_URL);
  return process.env.BASE_URL + url;
}
