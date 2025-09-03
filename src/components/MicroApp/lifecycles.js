// 微应用生命周期钩子定义
const lifecycles = {
  beforeLoad: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} beforeLoad`);
  },
  beforeMount: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} beforeMount`);
  },
  afterMount: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} afterMount`);
  },
  beforeUnmount: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} beforeUnmount`);
  },
  afterUnmount: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} afterUnmount`);
  },
  activated: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} activated`);
  },
  deactivated: (appWindow) => {
    console.log(`${appWindow.__WUJIE_ID__} deactivated`);
  },
  loadError: (url, e) => {
    console.log(`${url} 加载失败`, e);
  },
};

export default lifecycles;