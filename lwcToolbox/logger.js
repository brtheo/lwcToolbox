const logcolors = {
  log:'background:#75ab79;color:white;',
  error:'background:#9c0808;color:white;',
  info:'background:#fa8128;color:white;',
  perf: 'background:#840884;color:white;'
}

export const Logger = (...args) => console.log('%cLOG'+`%c ${args}`,logcolors.log,'color:#75ab79')