import { Text, View, Image } from "@tarojs/components";
import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./progress.module.scss";
import successSVG from "@/assets/success.svg";
import { gte } from "@/utils/BigDecimal";

enum IProgress {
  UnFinish = "UN_FINISH",
  Finish = "FINISH",
}

const isFinish = (val: string) => val === IProgress.Finish;

interface ProgressProps {
  progress?: number;
  overdue?: boolean;
  statusEnum: IProgress;
}

const Progress = ({ progress = 0, statusEnum }: ProgressProps) => {
  const [leftRotate, setLeftRotate] = useState(0);

  const [rightRotate, setRightRotate] = useState(0);

  useEffect(() => {
    if (progress >= 0 && progress <= 50) {
      setLeftRotate(0);
      setRightRotate((180 / 50) * progress);
      return;
    }
    if (progress > 50 && progress <= 100) {
      setLeftRotate((180 / 50) * (progress - 50));
      setRightRotate(180);
    }
  }, [progress]);

  return (
    <View
      className={classNames(styles.progress, { [styles.blue]: progress < 100 })}
    >
      {gte(progress, 100) && isFinish(IProgress.Finish) ? (
        <Image className={styles.icon} src={successSVG} />
      ) : (
        <>
          <View className={styles.bg}>
            <Text
              className={classNames(styles.text, {
                [styles.fontBlue]: !isFinish(statusEnum),
                [styles.success]: isFinish(statusEnum),
              })}
            >
              {!!progress ? progress : 0}%
            </Text>
          </View>
          <View className={styles.left}>
            <View
              className={styles.circle}
              style={{ transform: `rotate(${leftRotate}deg)` }}
            ></View>
          </View>
          <View className={styles.right}>
            <View
              className={styles.circle}
              style={{ transform: `rotate(${rightRotate}deg)` }}
            ></View>
          </View>
        </>
      )}
    </View>
  );
};

export default Progress;
