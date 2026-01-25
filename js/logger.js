// Styled Logger Utility for Frutiger Aero
(function(){
  const palette = {
    accent: '#3fa9f5',
    success: '#2ecc71',
    warn: '#f1c40f',
    error: '#e74c3c',
    text: '#eaeef5',
    dim: '#93a4bf',
    bg: 'rgba(20,28,40,0.9)'
  };

  const baseStyle = `color: ${palette.text}; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", monospace; font-size: 12px;`;
  const tagStyle = (bg) => `background:${bg}; color:#fff; padding:2px 6px; border-radius:4px; ${baseStyle}`;
  const msgStyle = `${baseStyle}`;

  const bannerArt = `\n\n\n\n\n\n          ........................                              \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@..                       \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@..                   \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.                 \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.               \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.             \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.            \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.           \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.          \n          @@@@@@@@@@@@@@@@@@@.   ..@@@@@@@@@@@@@@@@@@@@          \n          @@@@@@@@@@@@@@@@@@@.     .@@@@@@@@@@@@@@@@@@@.         \n          @@@@@@@@@@@@@@@@@@@.     .@@@@@@@@@@@@@@@@@@@.         \n          @@@@@@@@@@@@@@@@@@@.     .@@@@@@@@@@@@@@@@@@@.         \n          @@@@@@@@@@@@@@@@@@@.   ..@@@@@@@@@@@@@@@@@@@@          \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.          \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           \n          @@@@@@@@@@@@@@@@@@@@@@@@@@@@..@@@@@@@@@@@@@.           \n          @@@@@@@@@@@@@@@@@@@@@@@@@@.   .@@@..@@@@@@.            \n          @@@@@@@@@@@@@@@@@@@@@@@@@@.    @@.  .@@@@.             \n          @@@@@@@@@@@@@@@@@@@@@@@@@.      .    .@.               \n          @@@@@@@@@@@@@@@@@@@@@@@@.                               \n          @@@@@@@@@@@@@@@@@@@@@@@@.                               \n          @@@@@@@@@@@@@@@@@@@@@@@.                                \n          .......................                                 \n\n\n\n\n\n\n`;

  function banner(){
    console.log('%c'+bannerArt, `color:${palette.accent}; font-family: monospace; font-size: 10px; line-height: 10px;`);
  }

  function group(name, collapsed=false){
    const method = collapsed ? 'groupCollapsed' : 'group';
    console[method](`%cLOG%c ${name}`, tagStyle(palette.accent), msgStyle);
  }
  function groupEnd(){ console.groupEnd(); }

  function info(message, meta){
    console.log(`%cINFO%c ${message}`, tagStyle(palette.accent), msgStyle, meta||'');
  }
  function success(message, meta){
    console.log(`%cOK%c ${message}`, tagStyle(palette.success), msgStyle, meta||'');
  }
  function warn(message, meta){
    console.warn(`%cWARN%c ${message}`, tagStyle(palette.warn), msgStyle, meta||'');
  }
  function error(message, meta){
    console.error(`%cERR%c ${message}`, tagStyle(palette.error), msgStyle, meta||'');
  }
  function event(name, detail){
    console.log(`%cEVT%c ${name}`, tagStyle(palette.dim), msgStyle, detail||'');
  }

  function time(label){ console.time(label); }
  function timeEnd(label){ console.timeEnd(label); }

  window.Logger = { banner, group, groupEnd, info, success, warn, error, event, time, timeEnd };
})();
