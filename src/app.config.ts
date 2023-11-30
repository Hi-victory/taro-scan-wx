export default defineAppConfig({
  pages: [
    "pages/workReportingTask/index",
    "pages/me/index",
    "pages/accountLogin/index",
    "pages/scanCodeWorkReporting/index",
    "pages/login/index",
    "pages/manualWorkReporting/index",
    "pages/agreement/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    list: [
      {
        text: "首页",
        pagePath: "pages/workReportingTask/index",
      },
      {
        text: "我的",
        pagePath: "pages/me/index",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
});
