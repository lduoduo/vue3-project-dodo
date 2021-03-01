/*
 * @Author: zouhuan
 * @Date: 2021-03-01 17:45:34
 * @Last Modified by: zouhuan
 * @Last Modified time: 2021-03-01 18:24:14
 * 错误监控临时放置在这里 + 日志美化
 */

const colorMap = {
  info: 'blue',
  log: '#3d6dad',
  warn: 'orange',
  error: 'red'
};

const tmp = {
  init(projectName) {
    this.projectName = projectName;

    this.loggerInfo = console.info;
    this.loggerWarn = console.warn;
    this.loggerError = console.error;
    this.loggerLog = console.log;

    // this.reset();
  },
  reset() {
    console.log('logger rerset');

    window.console.info = (...arg) => {
      this.log(['info', ...arg]);
    };
    window.console.log = (...arg) => {
      this.log(['log', ...arg]);
    };
    window.console.warn = (...arg) => {
      this.log(['warn', ...arg]);
    };
    window.console.error = (...arg) => {
      this.log(['error', ...arg]);
    };
  },
  log(...arg) {
    const params = arg[0];
    if (params.length === 1) return;
    const type = params[0];
    const style = `color:${colorMap[type]};font-size:15px`;
    params.shift();
    params[0] = `%c${params[0]}`;
    params.splice(1, 0, style);

    // call(参数一个个传递) & apply(参数数组传递)
    this.loggerLog.apply(console, params);
  }
};

export const start = projectName => {
  tmp.init(projectName);
};

export default start;
