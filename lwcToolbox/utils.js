export const interpolate = (input,params) => {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${input}\`;`)(...vals);
}