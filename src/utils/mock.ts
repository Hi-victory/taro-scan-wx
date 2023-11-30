import dayjs from "dayjs";
export const mockList = [
  {
    recordId: "00000000000000000001",
    taskId: "00000000000000000001",
    taskDocNo: "MOT202311260001",
    technologyRecordId: "00000000000000000001",
    technologyName: "铣床",
    inventoryId: "000000001",
    inventoryName: "B075耳套黑色",
    inventoryCode: "JS-33-04A",
    inventorySpec: "微软H00594 BBP<100PPM DEHP<100PPM",
    deliveryDate: "2023-11-27",
    unitName: "个",
    reworkQty: "0",
    scrapQty: "300",
    checkQty: "300",
    quantity: "1000",
    remark: "返工工艺",
  },
  {
    recordId: "00000000000000000002",
    taskId: "00000000000000000002",
    taskDocNo: "MOT202311260002",
    technologyRecordId: "00000000000000000002",
    technologyName: "自制",
    inventoryId: "000000002",
    inventoryName: "手机壳白色",
    inventoryCode: "JS-22-04A",
    inventorySpec: "IPHONE 12PRO",
    deliveryDate: "2023-11-27",
    unitName: "个",
    reworkQty: "0",
    scrapQty: "0",
    checkQty: "0",
    quantity: "555",
    remark: "返工工艺",
  },
  {
    recordId: "00000000000000000003",
    taskId: "00000000000000000003",
    taskDocNo: "MOT202311260003",
    technologyRecordId: "00000000000000000003",
    technologyName: "冲床",
    inventoryId: "000000003",
    inventoryName: "手机壳蓝色",
    inventoryCode: "JS-01-333-04A",
    inventorySpec: "小米6",
    deliveryDate: "2023-11-27",
    unitName: "个",
    reworkQty: "0",
    scrapQty: "0",
    checkQty: "0",
    quantity: "200",
    remark: "返工工艺",
  },
  {
    recordId: "00000000000000000004",
    taskId: "00000000000000000004",
    taskDocNo: "MOT202311260004",
    technologyRecordId: "00000000000000000004",
    technologyName: "钳工",
    inventoryId: "000000004",
    inventoryName: "B075耳套绿色",
    inventoryCode: "JS-01-13330-04A",
    inventorySpec: "微软H00594 BBP<100PPM DEHP<100PPM",
    deliveryDate: "2023-11-27",
    unitName: "个",
    reworkQty: "0",
    scrapQty: "0",
    checkQty: "100",
    quantity: "400",
    remark: "返工工艺",
  },
  {
    recordId: "00000000000000000005",
    taskId: "00000000000000000005",
    taskDocNo: "MOT202311260005",
    technologyRecordId: "00000000000000000005",
    technologyName: "品检",
    inventoryId: "000000008",
    inventoryName: "蓝色冲锋衣",
    inventoryCode: "JS-11-23-04A",
    inventorySpec: "儿童款",
    deliveryDate: "2023-11-27",
    unitName: "套",
    reworkQty: "0",
    scrapQty: "0",
    checkQty: "0",
    quantity: "1000",
    remark: "返工工艺",
  },
];

export const mockOptions = [
  { value: "00000000000000000001", label: "铣床" },
  { value: "00000000000000000002", label: "自制" },
  { value: "00000000000000000003", label: "冲床" },
  { value: "00000000000000000004", label: "钳工" },
  { value: "00000000000000000005", label: "品检" },
];

export const getFilterListMaps = (key: string) => {
  const mockMaps = (key: string, pageSize = 20) => {
    const maps = [];
    const record = mockList.find((item) => item.technologyRecordId === key);
    for (let i = 0; i < pageSize; i++) {
      maps.push({
        ...record,
        deliveryDate: dayjs().format("YYYY-MM-DD"),
        taskDocNo: `${record.taskDocNo}${i + 1}`,
        recordId: `${record.recordId}${i + 1}`,
      });
    }
    return maps;
  };

  if (key === "all") {
    const usable = {};
    let record;
    for (let i = 0; i < mockOptions.length; i++) {
      record = mockList.find(
        (item) => mockOptions[i].value === item.technologyRecordId
      );
      usable[mockOptions[i].value] = mockMaps(record.technologyRecordId, 5);
    }
    return [...Object.values(usable)].flat();
  }
  return mockMaps(key);
};
