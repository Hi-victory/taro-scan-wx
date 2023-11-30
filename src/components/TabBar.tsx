import { saveTabIndex } from "@/store/reducers/global";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import footerBgSVG from "../assets/footerBg.svg";
import scanSVG from "../assets/scan.svg";
import taskSVG from "../assets/task.svg";
import taskActiveSVG from "../assets/taskActive.svg";
import userSVG from "../assets/user.svg";
import userActiveSVG from "../assets/userActive.svg";
import styles from "./tabBar.module.scss";
import { useAuthorization } from "@/hooks/useAuthorization";

const urls = ["/pages/workReportingTask/index", "/pages/me/index"];

const TabBar = () => {
  const dispatch = useDispatch();

  const { toLogin, tabIndex, isUnAuthorization } = useAuthorization();

  const handleMenu = (index: number) => () => {
    if (index === 1 && isUnAuthorization) {
      toLogin();
      return;
    }
    if (index === tabIndex) {
      return;
    }
    dispatch(saveTabIndex(index));
    Taro.switchTab({
      url: urls[index],
    });
  };

  const getScan = (scanVal: string) => {
    if (!scanVal) return;
    let task, isTask;
    const isRegex = /\{/.test(scanVal.toString());
    if (isRegex) {
      task = JSON.parse(scanVal);
      isTask = task.hasOwnProperty("taskId");
    }
    return { task, isTask };
  };

  const handleScan = () => {
    if (isUnAuthorization) {
      toLogin();
      return;
    }
    Taro.scanCode({
      success: (res) => {
        const { task, isTask } = getScan(res.result);
        console.log(task, isTask);
        if (!isTask && !task?.taskId) {
          Taro.showToast({
            title: "未知二维码",
            icon: "error",
            duration: 3000,
          });
          return;
        }
        Taro.navigateTo({
          url: `/pages/scanCodeWorkReporting/index?record=${JSON.stringify({
            ...task,
            taskTechnologyId: task?.technologyId,
          })}`,
        });
      },
      fail: () => {
        Taro.showToast({
          title: "未识别到二维码",
          icon: "error",
          duration: 3000,
        });
      },
    });
  };

  return (
    <View className={styles.box}>
      <Image src={footerBgSVG} className={styles.bg} />
      <View className={styles.menuBg}>
        <View
          className={classnames(styles.menu, {
            [styles.active]: tabIndex === 0,
          })}
          onClick={handleMenu(0)}
        >
          <Image
            src={tabIndex === 0 ? taskActiveSVG : taskSVG}
            className={styles.icon}
          />
          <Text className={styles.name}>待报工任务</Text>
        </View>
        <View className={styles.scanBg} onClick={handleScan}>
          <Image src={scanSVG} className={styles.icon} />
        </View>
        <View
          className={classnames(styles.menu, {
            [styles.active]: tabIndex === 1,
          })}
          onClick={handleMenu(1)}
        >
          <Image
            src={tabIndex === 1 ? userActiveSVG : userSVG}
            className={styles.icon}
          />
          <Text className={styles.name}>个人中心</Text>
        </View>
      </View>
    </View>
  );
};

export default TabBar;
