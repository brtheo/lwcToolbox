const LOG_COLORS = {
  log: {main:'#75ab79',accent:'white'},
  error:{main:'#9c0808',accent:'white'},
  warn:{main:'#fa8128',accent:'white'},
  perf: {main:'#840884',accent:'white'}
}
const getLogTypeStyle = l => `background:${LOG_COLORS[l].main};color:${LOG_COLORS.log.accent};`
const getLogColor = l => `color:${LOG_COLORS[l].main}`;
const unproxifiy = obj => JSON.parse(JSON.stringify(obj));
const isObject = l => l instanceof Object;
const sortLog = (args) => {
  const objLog = [];
  return [objLog, args.reduce((prev, curr) =>
    isObject(curr)
      ? (_ => {
        objLog.push(curr);
        return prev;
      })()
      : prev.concat([curr]), 
  [])];
}
const perfLog = (logType, args) => {
  genericLog(logType,['Start'],'group');
  console.time(args.at(0));
  args.at(1)();
  console.timeEnd(args.at(0));
  genericLog(logType, ['End']);
  console.groupEnd();
}
const closeGroup = objLog => {
  console.log(objLog.map(unproxifiy));
  console.groupEnd();
}
const genericLog = (logType, args, method='log') => { 
  const [objLog, stringLogs] = sortLog(args);
  console[objLog.length > 0 ? 'group' : method](
    `%c ${logType.toUpperCase()} `+`%c ${stringLogs.join(' ')}`,
    getLogTypeStyle(logType),
    getLogColor(logType)
  );
  objLog.length > 0 && closeGroup(objLog);
}
export const createLogger = () =>
  Object.keys(LOG_COLORS).reduce((ret, logType) => 
    Object.assign(ret,{
    [logType]: (...args) => logType == 'perf'
      ? perfLog(logType, args) 
      : genericLog(logType, args, logType)
  }),{}
)

export const Logger = createLogger()