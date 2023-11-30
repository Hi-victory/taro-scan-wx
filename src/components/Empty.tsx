import { View, Image, Text } from "@tarojs/components";
import emptySVG from "../assets/empty.svg";

interface EmptyProps {
  paddingTop?: number;
  text?: string;
}

const Empty = ({ paddingTop = 220, text="暂无数据" }: EmptyProps) => {
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: `${paddingTop}px`,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={emptySVG} style={{ width: "64px", height: "40px" }}></Image>
      <Text style={{ color: "#BFBFBF", fontSize: "14px", paddingTop: 8 }}>
        {text}
      </Text>
    </View>
  );
};

export default Empty;
